-- Generate 100 single-use invite codes.
-- Run in Supabase → SQL Editor AFTER schema.sql. Re-runnable (tops up toward
-- new random codes; on_conflict skips any rare collision).

insert into public.invite_codes (code)
select 'HBTM-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6))
from generate_series(1, 100)
on conflict (code) do nothing;

-- Copy the list to hand out to testers:
select code from public.invite_codes where used_by is null order by created_at;
