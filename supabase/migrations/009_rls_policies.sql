-- 009_rls_policies.sql
-- Row Level Security for every table. Anything not allowed here is denied.
--
-- Who can do what
--   superadmin : read/manage everything
--   shelter    : read their own shelter's machines, transactions, alerts;
--                edit their own shelter profile; restock/collect via RPC (008)
--   user       : read own profile and own transactions; see public shelters and
--                the public_machines view (011)
--   device     : never touches tables directly -- the server API route uses the
--                service role (which bypasses RLS) after checking the device key

alter table public.shelters             enable row level security;
alter table public.profiles             enable row level security;
alter table public.machines             enable row level security;
alter table public.machine_credentials  enable row level security;
alter table public.transactions         enable row level security;
alter table public.alerts               enable row level security;

-- Column-level write limits (stronger than RLS alone: a user cannot promote
-- themselves to superadmin, or inflate a shelter's totals).
revoke update on public.profiles from anon, authenticated;
grant  update (full_name, display_name, avatar_url) on public.profiles to authenticated;

revoke update on public.shelters from anon, authenticated;
grant  update (name, location, contact, email, cats_count, dogs_count, urgent_needs, image_url, about)
  on public.shelters to authenticated;

revoke insert, update, delete on public.transactions from anon, authenticated;
revoke insert, update, delete on public.alerts       from anon, authenticated;
revoke all on public.machine_credentials from anon, authenticated;

-- SHELTERS -------------------------------------------------------------
create policy "shelters: public read" on public.shelters
  for select to anon, authenticated using (true);

create policy "shelters: staff update own, superadmin any" on public.shelters
  for update to authenticated
  using (public.can_manage_shelter(id))
  with check (public.can_manage_shelter(id));

create policy "shelters: superadmin insert" on public.shelters
  for insert to authenticated with check (public.is_superadmin());

create policy "shelters: superadmin delete" on public.shelters
  for delete to authenticated using (public.is_superadmin());

-- PROFILES -------------------------------------------------------------
create policy "profiles: read own or superadmin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_superadmin());

create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- MACHINES -------------------------------------------------------------
-- Full rows (ip, sensors, expiry...) for staff and superadmin only.
-- Community users read the safe subset through the public_machines view.
create policy "machines: staff read own shelter" on public.machines
  for select to authenticated
  using (public.can_manage_shelter(shelter_id));

create policy "machines: superadmin manage" on public.machines
  for all to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- machine_credentials: RLS on, no policies => service role only.

-- TRANSACTIONS ---------------------------------------------------------
create policy "transactions: own shelter, own rows, or superadmin" on public.transactions
  for select to authenticated
  using (
    public.can_manage_shelter(shelter_id)
    or user_id = auth.uid()
  );
-- No insert policy: deposits are written by the server (service role).

-- ALERTS ---------------------------------------------------------------
create policy "alerts: own shelter or superadmin" on public.alerts
  for select to authenticated
  using (public.can_manage_shelter(shelter_id));
-- No write policies: alerts are managed by triggers and resolve_alert().
