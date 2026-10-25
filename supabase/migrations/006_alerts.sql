-- 006_alerts.sql
-- SystemAlert in src/lib/types.ts. Alerts are created and auto-resolved by
-- refresh_machine_alerts() (007); staff can also resolve them via resolve_alert() (008).
--
-- `subject` separates alerts of the same type on one machine
-- ('cat' / 'dog' for food, 'bottle' / 'can' for bins, NULL otherwise).

create table public.alerts (
  id           uuid primary key default gen_random_uuid(),
  machine_id   uuid not null references public.machines(id) on delete cascade,
  shelter_id   uuid not null references public.shelters(id) on delete cascade,
  type         public.alert_type not null,
  subject      text,
  severity     public.alert_severity not null,
  title        text not null,
  message      text not null,
  resolved     boolean not null default false,
  resolved_at  timestamptz,
  created_at   timestamptz not null default now()
);

-- At most one OPEN alert per machine + condition.
create unique index alerts_one_open_per_condition
  on public.alerts (machine_id, type, (coalesce(subject, '')))
  where resolved = false;

create index alerts_shelter_open_idx on public.alerts (shelter_id, resolved, created_at desc);
