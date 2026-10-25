-- 011_views.sql

-- Safe, public subset of machines for the community app (/app) and landing page.
-- Deliberately OWNER-privileged (no security_invoker) so it can read machines
-- despite RLS. It must never expose ip_address, wifi, sensors, expiry or credentials.
-- (Supabase's linter will flag this as a security-definer view; that is intended here.)
create or replace view public.public_machines as
select
  m.id,
  m.code,
  m.name,
  m.shelter_id,
  m.location,
  m.address,
  m.latitude,
  m.longitude,
  m.status,
  m.last_sync_at,
  m.bottles_current,
  m.bottles_capacity,
  m.cans_current,
  m.cans_capacity,
  m.cat_food_current_grams,
  m.cat_food_capacity_grams,
  m.dog_food_current_grams,
  m.dog_food_capacity_grams
from public.machines m;

grant select on public.public_machines to anon, authenticated;

-- Daily totals for charts. security_invoker => RLS on transactions still applies.
create or replace view public.daily_collection
with (security_invoker = true) as
select
  (t.occurred_at at time zone 'Asia/Manila')::date as day,
  t.shelter_id,
  t.machine_id,
  t.item_type,
  count(*)                       as total_items,
  sum(t.food_dispensed_grams)    as total_food_grams
from public.transactions t
where t.status = 'accepted'
group by 1, 2, 3, 4;
