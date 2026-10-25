-- 002_shelters.sql
-- Partner shelters (ShelterData in src/lib/types.ts).
-- total_* columns are maintained by a trigger on transactions (see 007).

create table public.shelters (
  id                          uuid primary key default gen_random_uuid(),
  name                        text not null unique,
  location                    text,
  contact                     text,
  email                       text,
  cats_count                  integer not null default 0 check (cats_count >= 0),
  dogs_count                  integer not null default 0 check (dogs_count >= 0),
  urgent_needs                text[] not null default '{}',
  total_food_received_grams   bigint not null default 0 check (total_food_received_grams >= 0),
  total_recycled_items        bigint not null default 0 check (total_recycled_items >= 0),
  image_url                   text,
  about                       text,
  created_at                  timestamptz not null default now()
);
