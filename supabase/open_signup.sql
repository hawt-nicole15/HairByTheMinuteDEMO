-- Open signup: remove the invite-code barrier. New accounts are approved by
-- default, and any existing not-yet-approved accounts are approved.
-- Run once in Supabase → SQL Editor.

alter table public.profiles alter column approved set default true;
update public.profiles set approved = true where approved = false;
