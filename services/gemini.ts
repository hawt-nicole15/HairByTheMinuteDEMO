import { HairProfileData, HairRoutine, DailyLog, TreatmentEntry } from '@/types';
import { buildGeminiPrompt } from '@/context/HairProfileContext';
import { buildHairKnowledge } from '@/knowledge/hairKnowledge';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const NIA_PERSONA = `You are Cassi, a highly engaging, empathetic, and conversational natural hair care expert specializing in type 3 and type 4 natural hair. Your goal is to guide users through their hair journey naturally through dialogue, not to dump information at them.

# Personality & Tone
- Tone: Friendly, warm, and confident — like a knowledgeable friend who happens to know everything about natural hair.
- Vocabulary: Simple, natural language. No jargon, no robotic phrases. Contractions are great ("you're", "let's", "I'd").
- Empathy: Acknowledge the user's situation. If they're frustrated or struggling, reflect that before jumping into advice.

# Conversational Rules
1. Be Brief: Keep responses concise — 1 to 3 sentences for most replies. Never write walls of text.
2. Progressive Disclosure: Only answer what was directly asked. Don't front-load every edge case or detail unless the user wants more.
3. Interactive Dialogue: End almost every response with a relevant follow-up question to keep the conversation going.
4. Active Listening: If the request is vague, ask 1 clarifying question before answering.
5. Reference Context: Weave in what you already know about the user's hair profile and what they've shared earlier in the conversation.

# Response Format
- Write in natural, spoken-style paragraphs. Use contractions and conversational fillers where they feel natural.
- For standard conversational replies, use flowing sentences — not bullet points.
- Only use bullet points or numbered lists when presenting multiple steps or a comparison where structure genuinely helps.
- Never use LaTeX notation (e.g. $\\rightarrow$) — use plain words like "then" or "followed by" instead.`;


interface GeminiPart {
  text: string;
}

interface GeminiMessage {
  role: 'user' | 'model';
  parts: [GeminiPart];
}

async function callGemini(messages: GeminiMessage[], jsonMode = false): Promise<string> {
  if (!API_KEY) throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not set — restart the dev server after adding .env');

  const body: Record<string, unknown> = { contents: messages };
  if (jsonMode) {
    body.generationConfig = { responseMimeType: 'application/json' };
  }

  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[Gemini] API error:', res.status, err);
    throw new Error(`Gemini ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

const ROUTINE_PROMPT_SUFFIX = `Based on this user's hair profile and the knowledge above, generate a personalized hair care routine as a JSON object with exactly this structure:
{
  "washDayFrequency": "string (e.g., 'every 7-10 days')",
  "washDaySteps": [
    { "name": "string", "description": "string (1 sentence, actionable)", "tip": "string (5-8 words)" }
  ],
  "dailySteps": [
    { "name": "string", "description": "string (1 sentence)", "tip": "string (5-8 words)" }
  ],
  "weeklyTreatments": [
    { "name": "string", "description": "string (1 sentence)", "frequency": "string" }
  ],
  "productRecommendations": [
    { "type": "string", "suggestions": ["Brand name 1", "Brand name 2"], "why": "string" }
  ],
  "tips": ["string (1 sentence each)"]
}

Include 3-5 wash day steps, 2-3 daily steps, 1-2 weekly treatments, 3-4 product types, and 3-5 tips. Recommend affordable, widely available products. Keep all descriptions short and scannable.`;

export async function generateHairRoutine(profile: HairProfileData): Promise<HairRoutine> {
  const prompt = [
    NIA_PERSONA,
    buildHairKnowledge(profile),
    buildGeminiPrompt(profile),
    ROUTINE_PROMPT_SUFFIX,
  ].join('\n\n');

  const raw = await callGemini([{ role: 'user', parts: [{ text: prompt }] }], true);

  try {
    return JSON.parse(raw) as HairRoutine;
  } catch {
    return {
      washDayFrequency: 'every 7-10 days',
      washDaySteps: [{ name: 'Your Routine', description: raw, tip: '' }],
      dailySteps: [],
      weeklyTreatments: [],
      productRecommendations: [],
      tips: [],
    };
  }
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const NIA_OPENER =
  "Hi! I'm Cassi, your natural hair care guide. I've reviewed your hair profile and I'm ready to help. What questions do you have about your natural hair journey?";

export function buildTrackingContext(
  dailyLog: DailyLog | null,
  treatmentHistory: TreatmentEntry[],
  usedProducts: string[],
): string {
  const lines: string[] = ['## What the user has been doing (tracking data):'];

  if (dailyLog) {
    lines.push(`- Today's daily steps completed: ${dailyLog.completedSteps.length > 0 ? dailyLog.completedSteps.join(', ') : 'none yet'}`);
    lines.push(`- Washed hair today: ${dailyLog.washedToday ? 'yes' : 'no'}`);
    lines.push(`- Weekly treatments done today: ${dailyLog.completedTreatments.length > 0 ? dailyLog.completedTreatments.join(', ') : 'none'}`);
  }

  if (treatmentHistory.length > 0) {
    const recent = treatmentHistory.slice(-4);
    const summary = recent.map((e) => `${e.date}: ${e.names.join(', ')}`).join('; ');
    lines.push(`- Recent treatment history: ${summary}`);
  } else {
    lines.push('- No weekly treatments logged yet');
  }

  lines.push(`- Products the user is currently using: ${usedProducts.length > 0 ? usedProducts.join(', ') : 'none selected yet'}`);

  return lines.join('\n');
}

export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string,
  profile: HairProfileData,
  trackingContext?: string,
): Promise<string> {
  const systemPrompt = [
    NIA_PERSONA,
    buildHairKnowledge(profile),
    buildGeminiPrompt(profile),
    trackingContext ?? '',
    'You only answer questions about hair care, hair products, and natural hair. If asked about anything else, say: "I\'m only able to help with hair care questions — feel free to ask me anything about your natural hair journey!"',
  ].filter(Boolean).join('\n\n');

  const messages: GeminiMessage[] = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: NIA_OPENER }] },
    ...history.map((m) => ({ role: m.role, parts: [{ text: m.text }] as [GeminiPart] })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  return callGemini(messages);
}

export { NIA_OPENER };
