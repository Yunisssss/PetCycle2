-- 005_transactions.sql
-- One row per deposit attempt (TransactionItem in src/lib/types.ts).
--
-- * user_id is NULL for anonymous deposits.
-- * shelter_id and user_display_name are filled by a BEFORE INSERT trigger (007).
-- * food_dispensed_grams has NO default on purpose: the grams-per-deposit rule
--   (SDP says 2 g, current UI demo uses 20 g / 30 g) must be decided in one place.
-- * (machine_id, device_event_id) lets the ESP32 retry or flush its offline cache
--   without creating duplicates.

create table public.transactions (
  id                    uuid primary key default gen_random_uuid(),
  machine_id            uuid not null references public.machines(id) on delete cascade,
  shelter_id            uuid not null references public.shelters(id) on delete restrict,
  user_id               uuid references public.profiles(id) on delete set null,
  user_display_name     text not null default 'Anonymous',
  item_type             public.item_type not null,
  status                public.tx_status not null default 'accepted',
  food_dispensed_grams  integer not null check (food_dispensed_grams >= 0),
  food_type             public.food_type not null,
  device_event_id       text,
  occurred_at           timestamptz not null default now(),
  created_at            timestamptz not null default now(),
  unique (machine_id, device_event_id)
);

create index transactions_machine_time_idx on public.transactions (machine_id, occurred_at desc);
create index transactions_shelter_time_idx on public.transactions (shelter_id, occurred_at desc);
create index transactions_user_time_idx    on public.transactions (user_id, occurred_at desc);
create index transactions_time_idx         on public.transactions (occurred_at desc);
