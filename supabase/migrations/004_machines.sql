-- 004_machines.sql
-- One wide row per machine, matching MachineData in src/lib/types.ts.
-- Defaults come from the mock machine (capacities 400/300 pcs, 5000/8000 g).
--
-- status is derived by trigger (007): online <-> warning from fill levels,
-- 'offline' is set by run_machine_health_check(), 'maintenance' is manual.

create table public.machines (
  id                        uuid primary key default gen_random_uuid(),
  code                      text not null unique,            -- e.g. PC-QC-01
  name                      text not null,
  shelter_id                uuid not null references public.shelters(id) on delete restrict,
  location                  text,                            -- short label
  address                   text,
  latitude                  double precision,                -- for the map view
  longitude                 double precision,
  status                    public.machine_status not null default 'offline',
  last_sync_at              timestamptz,
  ip_address                text,
  wifi_rssi                 integer,                         -- dBm, e.g. -58 (UI derives "Strong")

  bottles_current           integer not null default 0,
  bottles_capacity          integer not null default 400,
  cans_current              integer not null default 0,
  cans_capacity             integer not null default 300,

  cat_food_current_grams    integer not null default 0,
  cat_food_capacity_grams   integer not null default 5000,
  dog_food_current_grams    integer not null default 0,
  dog_food_capacity_grams   integer not null default 8000,
  cat_food_expiry_date      date,
  dog_food_expiry_date      date,

  sensor_ultrasonic         public.sensor_status not null default 'healthy',
  sensor_camera             public.sensor_status not null default 'healthy',
  sensor_load_cell          public.sensor_status not null default 'healthy',
  sensor_dispenser_motor    public.sensor_status not null default 'healthy',

  created_at                timestamptz not null default now(),

  constraint bottles_in_range check (bottles_current >= 0 and bottles_current <= bottles_capacity),
  constraint cans_in_range    check (cans_current    >= 0 and cans_current    <= cans_capacity),
  constraint cat_in_range     check (cat_food_current_grams >= 0 and cat_food_current_grams <= cat_food_capacity_grams),
  constraint dog_in_range     check (dog_food_current_grams >= 0 and dog_food_current_grams <= dog_food_capacity_grams)
);

create index machines_shelter_idx on public.machines (shelter_id);

-- Device credentials live in their own table so they can never leak through
-- a SELECT on machines. RLS is enabled in 009 with NO policies = service role only.
create table public.machine_credentials (
  machine_id   uuid primary key references public.machines(id) on delete cascade,
  key_hash     text not null unique,        -- SHA-256 of the device key, never the key itself
  created_at   timestamptz not null default now(),
  rotated_at   timestamptz
);
