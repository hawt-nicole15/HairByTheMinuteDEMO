-- HairByTheMinute — beta schema
-- Run this once in the Supabase dashboard → SQL Editor.
-- Safe to run on a fresh project. Creates tables, RLS, and the auth functions.

-- ---------------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------------

-- Account + hair profile (one row per user, created automatically on signup)
create table if not exists public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  email                 text,
  first_name            text,
  last_name             text,
  approved              boolean     not null default true,    -- open signup; invite flow left in place but unused
  questionnaire_answers jsonb       not null default '{}'::jsonb,
  hair_goals            text[]      not null default '{}',
  is_onboarded          boolean     not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Invite codes (single-use). Pregenerated via seed_invite_codes.sql.
create table if not exists public.invite_codes (
  code       text primary key,
  label      text,                                            -- optional note, e.g. tester name
  used_by    uuid references auth.users(id) on delete set null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);

-- Cached AI-generated routine + LLM usage audit for the generation call
create table if not exists public.routines (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  routine      jsonb       not null,
  llm_audit    jsonb,                                         -- {model_name, tokens_in, tokens_out, cached_tokens, generated_at}
  generated_at timestamptz not null default now()
);

-- Per-message chat log + token usage (monitoring; written server-side only)
create table if not exists public.chats (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users(id) on delete cascade,
  created_at         timestamptz not null default now(),
  user_message       text,
  assistant_message  text,
  model_name         text,
  tokens_in          integer,
  tokens_out         integer,
  cached_tokens      integer
);
create index if not exists chats_user_created_idx on public.chats (user_id, created_at desc);

-- Tracking: today's checklist (which steps/treatments done, washed?)
create table if not exists public.daily_logs (
  user_id              uuid        not null references auth.users(id) on delete cascade,
  log_date             date        not null,
  completed_steps      text[]      not null default '{}',
  completed_treatments text[]      not null default '{}',
  washed_today         boolean     not null default false,
  updated_at           timestamptz not null default now(),
  primary key (user_id, log_date)
);

-- Tracking: history of deep/weekly treatments over time
create table if not exists public.treatment_history (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  treatment_date date        not null,
  names          text[]      not null default '{}',
  created_at     timestamptz not null default now()
);
create index if not exists treatment_history_user_date_idx on public.treatment_history (user_id, treatment_date);

-- Tracking: wash cadence (drives "next wash day" countdown)
create table if not exists public.wash_schedule (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  last_wash_date date,
  frequency_days integer,
  updated_at     timestamptz not null default now()
);

-- Tracking: periodic self-ratings of progress per goal (-1 worse / 0 same / 1 better)
create table if not exists public.goal_checkins (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  checkin_date date        not null,
  ratings      jsonb       not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists goal_checkins_user_date_idx on public.goal_checkins (user_id, checkin_date);

-- Tracking: products the user currently uses
create table if not exists public.product_usage (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  products   text[]      not null default '{}',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.invite_codes      enable row level security;
alter table public.routines          enable row level security;
alter table public.chats             enable row level security;
alter table public.daily_logs        enable row level security;
alter table public.treatment_history enable row level security;
alter table public.wash_schedule     enable row level security;
alter table public.goal_checkins     enable row level security;
alter table public.product_usage     enable row level security;

-- profiles: users read + update ONLY their own row. approved/email are not
-- client-updatable (see column grants below); insert is via trigger only.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- user-owned tables: full CRUD on own rows only
drop policy if exists "routines_own"          on public.routines;
create policy "routines_own"          on public.routines          for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "daily_logs_own"        on public.daily_logs;
create policy "daily_logs_own"        on public.daily_logs        for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "treatment_history_own" on public.treatment_history;
create policy "treatment_history_own" on public.treatment_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "wash_schedule_own"     on public.wash_schedule;
create policy "wash_schedule_own"     on public.wash_schedule     for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "goal_checkins_own"     on public.goal_checkins;
create policy "goal_checkins_own"     on public.goal_checkins     for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "product_usage_own"     on public.product_usage;
create policy "product_usage_own"     on public.product_usage     for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- chats + invite_codes: NO client policies. Only the Edge Function (service
-- role) and redeem_invite_code() (security definer) may touch them.

-- ---------------------------------------------------------------------------
-- 3. PRIVILEGES  (RLS gates rows; these gate which columns/tables/roles)
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.routines          to authenticated;
grant select, insert, update, delete on public.daily_logs        to authenticated;
grant select, insert, update, delete on public.treatment_history to authenticated;
grant select, insert, update, delete on public.wash_schedule     to authenticated;
grant select, insert, update, delete on public.goal_checkins     to authenticated;
grant select, insert, update, delete on public.product_usage     to authenticated;

-- profiles: read all own columns, but only update the safe ones
-- (approved + email are intentionally excluded so a client cannot self-approve)
grant select on public.profiles to authenticated;
grant update (first_name, last_name, questionnaire_answers, hair_goals, is_onboarded, updated_at)
  on public.profiles to authenticated;

-- chats + invite_codes: no grants to authenticated (locked to service role)

-- ---------------------------------------------------------------------------
-- 4. FUNCTIONS + TRIGGERS
-- ---------------------------------------------------------------------------

-- Create a profile row automatically whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Redeem a single-use invite code -> approve the current user.
-- Returns true if the user ends up approved, false if the code was invalid/used.
create or replace function public.redeem_invite_code(p_code text)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_ok  boolean := false;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  -- already approved? don't burn another code
  if (select approved from public.profiles where id = v_uid) then
    return true;
  end if;

  update public.invite_codes
     set used_by = v_uid, used_at = now()
   where code = p_code
     and used_by is null
  returning true into v_ok;

  if v_ok then
    update public.profiles set approved = true, updated_at = now() where id = v_uid;
    return true;
  end if;

  return false;
end;
$$;

revoke all on function public.redeem_invite_code(text) from public;
grant execute on function public.redeem_invite_code(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. BETA WAIVER ACCEPTANCE LOG (append-only)
-- ---------------------------------------------------------------------------
create table if not exists public.waiver_acceptances (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  waiver_version text        not null,
  accepted_at    timestamptz not null default now(),
  user_agent     text
);
create index if not exists waiver_acceptances_user_idx
  on public.waiver_acceptances (user_id, waiver_version);

alter table public.waiver_acceptances enable row level security;
grant select, insert on public.waiver_acceptances to authenticated;

drop policy if exists "waiver_insert_own" on public.waiver_acceptances;
create policy "waiver_insert_own" on public.waiver_acceptances
  for insert with check (user_id = auth.uid());
drop policy if exists "waiver_select_own" on public.waiver_acceptances;
create policy "waiver_select_own" on public.waiver_acceptances
  for select using (user_id = auth.uid());
