// Prompt assembly for the gemini edge function.
// Ported from services/gemini.ts + context/HairProfileContext.tsx so the
// persona, knowledge, and profile framing live server-side (never shipped
// to the client). Ordering is static-first to maximise implicit cache hits.

import { buildHairKnowledge, HairProfileData } from './knowledge.ts';

export const NIA_PERSONA =
`You are Cassi, a highly engaging, empathetic, and conversational natural hair care expert specializing in type 3 and type 4 natural hair. Your goal is to guide users through their hair journey naturally through dialogue, not to dump information at them.

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

export const NIA_OPENER =
  "Hi! I'm Cassi, your natural hair care guide. I've reviewed your hair profile and I'm ready to help. What questions do you have about your natural hair journey?";

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  porosity: {
    high_porosity: 'High porosity (absorbs quickly)',
    medium_porosity: 'Medium porosity',
    low_porosity: 'Low porosity (products sit on top)',
  },
  elasticity: {
    low_elasticity: 'Low elasticity (snaps immediately)',
    good_elasticity: 'Good elasticity (stretches and bounces back)',
    damaged_elasticity: 'Damaged elasticity (stretches but stays limp)',
  },
  thickness: {
    fine: 'Fine strands',
    medium: 'Medium strands',
    coarse: 'Coarse strands',
  },
  curl_pattern: {
    type_3: 'Type 3 — soft S-shaped coils',
    type_4ab: 'Type 4A/4B — tight Z-coils',
    type_4c: 'Type 4C — dense, minimal definition',
  },
  styling_goal: {
    wash_and_go: 'Defined wash-and-gos',
    twist_braid_out: 'Twist-outs or braid-outs',
    stretched: 'Stretched styles (blowouts, banding)',
    protective: 'Protective styles (braids, wigs, weaves)',
  },
  scalp: {
    dry_scalp: 'Dry and flaky scalp',
    oily_scalp: 'Oily scalp',
    balanced_scalp: 'Balanced scalp',
    sensitive_scalp: 'Sensitive/easily irritated scalp',
  },
};

const GOAL_LABELS: Record<string, string> = {
  moisture: 'Moisture & Hydration',
  growth: 'Healthy Growth',
  curl_definition: 'Curl Definition',
  protective_maintenance: 'Protective Style Maintenance',
  strength: 'Strength & Breakage Reduction',
  scalp_health: 'Scalp Health',
};

export function buildProfilePrompt(profile: HairProfileData): string {
  const q = profile.questionnaireAnswers ?? {};
  const goals = profile.hairGoals ?? [];
  const name = profile.accountInfo
    ? `${profile.accountInfo.firstName ?? ''} ${profile.accountInfo.lastName ?? ''}`.trim()
    : '';

  const lines = [
    'USER HAIR PROFILE:',
    name ? `- Name: ${name}` : null,
    `- Porosity: ${ANSWER_LABELS.porosity[q.porosity] ?? 'Not answered'}`,
    `- Elasticity: ${ANSWER_LABELS.elasticity[q.elasticity] ?? 'Not answered'}`,
    `- Strand thickness: ${ANSWER_LABELS.thickness[q.thickness] ?? 'Not answered'}`,
    `- Curl pattern: ${ANSWER_LABELS.curl_pattern[q.curl_pattern] ?? 'Not answered'}`,
    `- Preferred style: ${ANSWER_LABELS.styling_goal[q.styling_goal] ?? 'Not answered'}`,
    `- Scalp type: ${ANSWER_LABELS.scalp[q.scalp] ?? 'Not answered'}`,
    `- Hair goals: ${goals.map((g) => GOAL_LABELS[g] ?? g).join(', ') || 'None selected'}`,
  ].filter((l): l is string => l !== null);

  return lines.join('\n');
}

export interface TrackingData {
  dailyLog: { completedSteps: string[]; washedToday: boolean; completedTreatments: string[] } | null;
  treatmentHistory: { date: string; names: string[] }[];
  usedProducts: string[];
}

export function buildTrackingContext(t: TrackingData): string {
  const lines: string[] = ['## What the user has been doing (tracking data):'];
  if (t.dailyLog) {
    lines.push(`- Today's daily steps completed: ${t.dailyLog.completedSteps.length ? t.dailyLog.completedSteps.join(', ') : 'none yet'}`);
    lines.push(`- Washed hair today: ${t.dailyLog.washedToday ? 'yes' : 'no'}`);
    lines.push(`- Weekly treatments done today: ${t.dailyLog.completedTreatments.length ? t.dailyLog.completedTreatments.join(', ') : 'none'}`);
  }
  if (t.treatmentHistory.length) {
    const recent = t.treatmentHistory.slice(-4).map((e) => `${e.date}: ${e.names.join(', ')}`).join('; ');
    lines.push(`- Recent treatment history: ${recent}`);
  } else {
    lines.push('- No weekly treatments logged yet');
  }
  lines.push(`- Products the user is currently using: ${t.usedProducts.length ? t.usedProducts.join(', ') : 'none selected yet'}`);
  return lines.join('\n');
}

export const HAIR_ONLY_GUARD =
  'You only answer questions about hair care, hair products, and natural hair. If asked about anything else, say: "I\'m only able to help with hair care questions — feel free to ask me anything about your natural hair journey!"';

export const ROUTINE_PROMPT_SUFFIX =
`Based on this user's hair profile and the knowledge above, generate a personalized hair care routine as a JSON object with exactly this structure:
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

// Full static-first system prompt for chat.
export function buildChatSystemPrompt(profile: HairProfileData, tracking: TrackingData): string {
  return [
    NIA_PERSONA,
    buildHairKnowledge(profile),
    buildProfilePrompt(profile),
    buildTrackingContext(tracking),
    HAIR_ONLY_GUARD,
  ].filter(Boolean).join('\n\n');
}

// Full prompt for routine generation.
export function buildRoutinePrompt(profile: HairProfileData): string {
  return [
    NIA_PERSONA,
    buildHairKnowledge(profile),
    buildProfilePrompt(profile),
    ROUTINE_PROMPT_SUFFIX,
  ].join('\n\n');
}
