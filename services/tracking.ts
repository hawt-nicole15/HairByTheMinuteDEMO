// Data-access layer for per-user tracking data, backed by Supabase/Postgres.
// Maps the app's camelCase types to the snake_case DB columns so the screens
// keep using the same shapes they used with AsyncStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/services/supabase';
import { HairRoutine, DailyLog, TreatmentEntry, WashSchedule, GoalCheckIn } from '@/types';

async function uid(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

// ---- Routine staleness (set when the hair profile/goals change) ----
const ROUTINE_STALE_KEY = 'hbtm_routine_stale';
export async function markRoutineStale(): Promise<void> {
  try { await AsyncStorage.setItem(ROUTINE_STALE_KEY, '1'); } catch { /* ignore */ }
}
export async function isRoutineStale(): Promise<boolean> {
  try { return (await AsyncStorage.getItem(ROUTINE_STALE_KEY)) === '1'; } catch { return false; }
}
export async function clearRoutineStale(): Promise<void> {
  try { await AsyncStorage.removeItem(ROUTINE_STALE_KEY); } catch { /* ignore */ }
}

// ---- Routine (written server-side by the edge function; read here) ----
export async function getRoutine(): Promise<HairRoutine | null> {
  const { data } = await supabase.from('routines').select('routine').maybeSingle();
  return (data?.routine as HairRoutine) ?? null;
}

// ---- Daily log ----
export async function getDailyLog(date: string): Promise<DailyLog | null> {
  const { data } = await supabase
    .from('daily_logs')
    .select('log_date, completed_steps, completed_treatments, washed_today')
    .eq('log_date', date)
    .maybeSingle();
  if (!data) return null;
  return {
    date: data.log_date,
    completedSteps: data.completed_steps ?? [],
    completedTreatments: data.completed_treatments ?? [],
    washedToday: data.washed_today ?? false,
  };
}

export async function saveDailyLog(log: DailyLog): Promise<void> {
  const id = await uid();
  if (!id) return;
  await supabase.from('daily_logs').upsert(
    {
      user_id: id,
      log_date: log.date,
      completed_steps: log.completedSteps,
      completed_treatments: log.completedTreatments,
      washed_today: log.washedToday,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,log_date' },
  );
}

// ---- Treatment history ----
export async function getTreatmentHistory(): Promise<TreatmentEntry[]> {
  const { data } = await supabase
    .from('treatment_history')
    .select('treatment_date, names')
    .order('treatment_date', { ascending: true });
  return (data ?? []).map((r) => ({ date: r.treatment_date, names: r.names ?? [] }));
}

// Records a treatment for a given day, merging names into that day's entry.
export async function recordTreatment(date: string, name: string): Promise<void> {
  const id = await uid();
  if (!id) return;
  const { data: existing } = await supabase
    .from('treatment_history')
    .select('id, names')
    .eq('treatment_date', date)
    .limit(1)
    .maybeSingle();
  if (existing) {
    const names = Array.from(new Set([...(existing.names ?? []), name]));
    await supabase.from('treatment_history').update({ names }).eq('id', existing.id);
  } else {
    await supabase.from('treatment_history').insert({ user_id: id, treatment_date: date, names: [name] });
  }
}

// ---- Wash schedule ----
export async function getWashSchedule(): Promise<WashSchedule | null> {
  const { data } = await supabase
    .from('wash_schedule')
    .select('last_wash_date, frequency_days')
    .maybeSingle();
  if (!data || !data.last_wash_date || data.frequency_days == null) return null;
  return { lastWashDate: data.last_wash_date, frequencyDays: data.frequency_days };
}

export async function saveWashSchedule(s: WashSchedule): Promise<void> {
  const id = await uid();
  if (!id) return;
  await supabase.from('wash_schedule').upsert({
    user_id: id,
    last_wash_date: s.lastWashDate,
    frequency_days: s.frequencyDays,
    updated_at: new Date().toISOString(),
  });
}

// ---- Goal check-ins ----
export async function getGoalCheckins(): Promise<GoalCheckIn[]> {
  const { data } = await supabase
    .from('goal_checkins')
    .select('checkin_date, ratings')
    .order('checkin_date', { ascending: true });
  return (data ?? []).map((r) => ({ date: r.checkin_date, ratings: (r.ratings as GoalCheckIn['ratings']) ?? {} }));
}

export async function addGoalCheckin(entry: GoalCheckIn): Promise<void> {
  const id = await uid();
  if (!id) return;
  await supabase.from('goal_checkins').insert({
    user_id: id,
    checkin_date: entry.date,
    ratings: entry.ratings,
  });
}

// ---- Product usage ----
export async function getProductUsage(): Promise<string[]> {
  const { data } = await supabase.from('product_usage').select('products').maybeSingle();
  return data?.products ?? [];
}

export async function saveProductUsage(products: string[]): Promise<void> {
  const id = await uid();
  if (!id) return;
  await supabase.from('product_usage').upsert({
    user_id: id,
    products,
    updated_at: new Date().toISOString(),
  });
}
