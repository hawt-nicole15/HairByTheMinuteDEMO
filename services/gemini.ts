import { HairRoutine } from '@/types';
import { supabase } from '@/services/supabase';

// The persona, knowledge base, prompt building, and Gemini key all live in the
// Supabase Edge Function now. This client only forwards the user's message +
// history; the function loads the profile and tracking data from the database.

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const NIA_OPENER =
  "Hi! I'm Cassi, your natural hair care guide. I've reviewed your hair profile and I'm ready to help. What questions do you have about your natural hair journey?";

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

async function invokeGemini<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('gemini', { body });
  if (error) {
    // Try to pull the structured error the function returned
    let detail = '';
    try { detail = (await (error as any).context?.json?.())?.error ?? ''; } catch { /* ignore */ }
    if (detail === 'not approved') throw new Error('Your account is pending approval.');
    throw new Error(detail || 'I\'m having trouble connecting right now. Please try again.');
  }
  return data as T;
}

export async function generateHairRoutine(): Promise<HairRoutine> {
  const data = await invokeGemini<{ routine: HairRoutine }>({ mode: 'routine' });
  return data.routine;
}

export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const data = await invokeGemini<{ text: string }>({
    mode: 'chat',
    message: userMessage,
    history: history.map((m) => ({ role: m.role, text: m.text })),
    localDate: todayISO(),
  });
  return data.text;
}
