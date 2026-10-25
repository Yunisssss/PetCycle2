-- 010_realtime.sql
-- Live dashboard updates. Realtime applies RLS, so a user only receives
-- changes for rows they are allowed to SELECT.

alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.machines;
alter publication supabase_realtime add table public.alerts;
