// Edge Function: gemini
// The ONLY place the Gemini key + knowledge base live. Verifies the caller is
// a logged-in, approved user, builds the prompt server-side, calls Gemini
// 3.5-flash-lite, logs token usage, and returns the result.
//
// Body:
//   { mode: 'chat', message: string, history?: {role,text}[], localDate?: string }
//   { mode: 'routine' }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  buildChatSystemPrompt,
  buildRoutinePrompt,
  NIA_OPENER,
  TrackingData,
} from './prompt.ts';
import { HairProfileData } from './knowledge.ts';

const MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

interface GeminiPart { text: string }
interface GeminiMessage { role: 'user' | 'model'; parts: GeminiPart[] }
interface Usage { tokens_in: number; tokens_out: number; cached_tokens: number }

async function callGemini(
  apiKey: string,
  contents: GeminiMessage[],
  jsonMode: boolean,
): Promise<{ text: string; usage: Usage }> {
  const body: Record<string, unknown> = { contents };
  if (jsonMode) body.generationConfig = { responseMimeType: 'application/json' };

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[gemini] API error', res.status, err);
    throw new Error(`Gemini ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const u = data.usageMetadata ?? {};
  const usage: Usage = {
    tokens_in: u.promptTokenCount ?? 0,
    tokens_out: (u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0),
    cached_tokens: u.cachedContentTokenCount ?? 0,
  };
  return { text, usage };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

  if (!GEMINI_API_KEY) return json({ error: 'server not configured' }, 500);

  // --- Auth: identify the caller from their JWT ---
  const authHeader = req.headers.get('Authorization') ?? '';
  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) return json({ error: 'unauthorized' }, 401);

  // --- Service-role client for privileged reads/writes ---
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  // --- Load profile + approval gate ---
  const { data: profileRow } = await admin
    .from('profiles')
    .select('approved, first_name, last_name, email, questionnaire_answers, hair_goals')
    .eq('id', user.id)
    .single();

  if (!profileRow) return json({ error: 'no profile' }, 403);
  if (!profileRow.approved) return json({ error: 'not approved' }, 403);

  const profile: HairProfileData = {
    questionnaireAnswers: profileRow.questionnaire_answers ?? {},
    hairGoals: profileRow.hair_goals ?? [],
    accountInfo: {
      firstName: profileRow.first_name ?? undefined,
      lastName: profileRow.last_name ?? undefined,
      email: profileRow.email ?? undefined,
    },
  };

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'invalid body' }, 400);
  }
  const mode = payload.mode;

  try {
    // ------------------------------------------------------------------
    // ROUTINE GENERATION
    // ------------------------------------------------------------------
    if (mode === 'routine') {
      const prompt = buildRoutinePrompt(profile);
      const { text, usage } = await callGemini(
        GEMINI_API_KEY,
        [{ role: 'user', parts: [{ text: prompt }] }],
        true,
      );

      let routine: unknown;
      try {
        routine = JSON.parse(text);
      } catch {
        routine = {
          washDayFrequency: 'every 7-10 days',
          washDaySteps: [{ name: 'Your Routine', description: text, tip: '' }],
          dailySteps: [], weeklyTreatments: [], productRecommendations: [], tips: [],
        };
      }

      await admin.from('routines').upsert({
        user_id: user.id,
        routine,
        llm_audit: { model_name: MODEL, ...usage, generated_at: new Date().toISOString() },
        generated_at: new Date().toISOString(),
      });

      return json({ routine });
    }

    // ------------------------------------------------------------------
    // CHAT
    // ------------------------------------------------------------------
    if (mode === 'chat') {
      const message = String(payload.message ?? '').trim();
      if (!message) return json({ error: 'empty message' }, 400);
      const history = Array.isArray(payload.history) ? payload.history : [];
      const localDate = String(payload.localDate ?? new Date().toISOString().split('T')[0]);

      // Load tracking context from DB
      const [dailyRes, treatRes, prodRes] = await Promise.all([
        admin.from('daily_logs')
          .select('completed_steps, completed_treatments, washed_today')
          .eq('user_id', user.id).eq('log_date', localDate).maybeSingle(),
        admin.from('treatment_history')
          .select('treatment_date, names')
          .eq('user_id', user.id).order('treatment_date', { ascending: true }).limit(20),
        admin.from('product_usage')
          .select('products').eq('user_id', user.id).maybeSingle(),
      ]);

      const tracking: TrackingData = {
        dailyLog: dailyRes.data
          ? {
              completedSteps: dailyRes.data.completed_steps ?? [],
              completedTreatments: dailyRes.data.completed_treatments ?? [],
              washedToday: dailyRes.data.washed_today ?? false,
            }
          : null,
        treatmentHistory: (treatRes.data ?? []).map((r) => ({ date: r.treatment_date, names: r.names ?? [] })),
        usedProducts: prodRes.data?.products ?? [],
      };

      const systemPrompt = buildChatSystemPrompt(profile, tracking);
      const contents: GeminiMessage[] = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: NIA_OPENER }] },
        ...history.map((m: { role: string; text: string }) => ({
          role: m.role === 'model' ? 'model' as const : 'user' as const,
          parts: [{ text: String(m.text ?? '') }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ];

      const { text, usage } = await callGemini(GEMINI_API_KEY, contents, false);

      // Fire-and-forget usage + message log
      await admin.from('chats').insert({
        user_id: user.id,
        user_message: message,
        assistant_message: text,
        model_name: MODEL,
        tokens_in: usage.tokens_in,
        tokens_out: usage.tokens_out,
        cached_tokens: usage.cached_tokens,
      });

      return json({ text });
    }

    return json({ error: 'unknown mode' }, 400);
  } catch (e) {
    console.error('[gemini] handler error', e);
    return json({ error: 'ai request failed' }, 502);
  }
});
