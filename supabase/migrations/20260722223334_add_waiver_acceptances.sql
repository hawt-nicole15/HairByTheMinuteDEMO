-- Beta waiver acceptance log (append-only audit record).
-- Run once in Supabase → SQL Editor. Also included in schema.sql for fresh setups.

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

-- Users may record and read only their own acceptance; rows are immutable
-- (no update/delete granted).
grant select, insert on public.waiver_acceptances to authenticated;

drop policy if exists "waiver_insert_own" on public.waiver_acceptances;
create policy "waiver_insert_own" on public.waiver_acceptances
  for insert with check (user_id = auth.uid());

drop policy if exists "waiver_select_own" on public.waiver_acceptances;
create policy "waiver_select_own" on public.waiver_acceptances
  for select using (user_id = auth.uid());
