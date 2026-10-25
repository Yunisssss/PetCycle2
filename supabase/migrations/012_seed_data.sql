-- 012_seed_data.sql
-- Demo data ported from src/lib/mock-data.ts (only the PAWS sample shelter and
-- machine PC-QC-01 were available when this file was written).
-- TODO(agent): port the remaining shelters/machines/alerts from mock-data.ts
--              into NEW migration files (013_seed_more_shelters.sql, ...).
-- Idempotent: safe to run twice.

with s as (
  insert into public.shelters (
    name, location, contact, email, cats_count, dogs_count, urgent_needs,
    total_food_received_grams, total_recycled_items, image_url, about
  )
  values (
    'PAWS Animal Rehabilitation Center',
    'Aurora Blvd, Katipunan Valley, Quezon City',
    '(02) 8475-1688',
    'info@paws.org.ph',
    142, 198,
    array['Kitten Wet & Dry Food', 'Adult Dog Maintenance Kibble', 'Clean Towels'],
    324500, 16225,
    '/images/feed-strays.jpg',
    'Dedicated to the prevention of cruelty to animals and operating a shelter for rescued stray dogs and cats.'
  )
  on conflict (name) do nothing
  returning id
)
insert into public.machines (
  code, name, shelter_id, location, address, status, last_sync_at, ip_address, wifi_rssi,
  bottles_current, bottles_capacity, cans_current, cans_capacity,
  cat_food_current_grams, cat_food_capacity_grams, dog_food_current_grams, dog_food_capacity_grams,
  cat_food_expiry_date, dog_food_expiry_date
)
select
  'PC-QC-01', 'PetCycle Machine #1', s.id,
  'Katipunan Avenue Entrance, QC',
  'Aurora Blvd, Katipunan Valley, Quezon City',
  'online', now() - interval '2 minutes', '192.168.1.104', -58,
  342, 400, 184, 300,
  980, 5000, 4200, 8000,
  date '2026-11-18', date '2027-04-12'
from s
on conflict (code) do nothing;
