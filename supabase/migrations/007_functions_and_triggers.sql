-- 007_functions_and_triggers.sql
-- Server-side business rules, so the UI and the IoT device never have to
-- duplicate them:
--   1. machine status is derived from fill levels
--   2. alerts are created / auto-resolved when a machine row changes
--   3. a new transaction updates machine counts, hopper levels and shelter totals

-- 1. STATUS DERIVATION -------------------------------------------------
-- 'online' <-> 'warning' follows fill levels. 'offline' and 'maintenance' are left alone.
create or replace function public.machines_derive_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status in ('online', 'warning') then
    if new.cat_food_current_grams < 0.2 * new.cat_food_capacity_grams
       or new.dog_food_current_grams < 0.2 * new.dog_food_capacity_grams
       or new.bottles_current >= 0.9 * new.bottles_capacity
       or new.cans_current    >= 0.9 * new.cans_capacity then
      new.status := 'warning';
    else
      new.status := 'online';
    end if;
  end if;
  return new;
end;
$$;

create trigger machines_derive_status
  before insert or update on public.machines
  for each row execute function public.machines_derive_status();

-- 2. ALERTS ------------------------------------------------------------
-- Open the alert if p_active, otherwise resolve any open one for that condition.
create or replace function public._sync_alert(
  p_machine_id uuid,
  p_shelter_id uuid,
  p_type       public.alert_type,
  p_subject    text,
  p_active     boolean,
  p_severity   public.alert_severity,
  p_title      text,
  p_message    text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_active then
    insert into public.alerts (machine_id, shelter_id, type, subject, severity, title, message)
    values (p_machine_id, p_shelter_id, p_type, p_subject, p_severity, p_title, p_message)
    on conflict (machine_id, type, (coalesce(subject, ''))) where resolved = false
    do update set severity = excluded.severity,
                  title    = excluded.title,
                  message  = excluded.message;
  else
    update public.alerts
       set resolved = true, resolved_at = now()
     where machine_id = p_machine_id
       and type = p_type
       and coalesce(subject, '') = coalesce(p_subject, '')
       and resolved = false;
  end if;
end;
$$;

create or replace function public.refresh_machine_alerts(p_machine_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  m          public.machines%rowtype;
  cat_pct    numeric;
  dog_pct    numeric;
  bottle_pct numeric;
  can_pct    numeric;
begin
  select * into m from public.machines where id = p_machine_id;
  if not found then
    return;
  end if;

  cat_pct    := round(100.0 * m.cat_food_current_grams / nullif(m.cat_food_capacity_grams, 0), 1);
  dog_pct    := round(100.0 * m.dog_food_current_grams / nullif(m.dog_food_capacity_grams, 0), 1);
  bottle_pct := round(100.0 * m.bottles_current / nullif(m.bottles_capacity, 0), 1);
  can_pct    := round(100.0 * m.cans_current    / nullif(m.cans_capacity, 0), 1);

  -- low food (< 20%, critical below 10%)
  perform public._sync_alert(m.id, m.shelter_id, 'low_food', 'cat',
    coalesce(cat_pct, 100) < 20,
    case when coalesce(cat_pct, 100) < 10 then 'critical'::public.alert_severity else 'warning'::public.alert_severity end,
    'Cat Food Hopper Below 20%',
    format('Remaining cat food is %sg (%s%% capacity). Restock suggested within 24 hours.', m.cat_food_current_grams, cat_pct));

  perform public._sync_alert(m.id, m.shelter_id, 'low_food', 'dog',
    coalesce(dog_pct, 100) < 20,
    case when coalesce(dog_pct, 100) < 10 then 'critical'::public.alert_severity else 'warning'::public.alert_severity end,
    'Dog Food Hopper Below 20%',
    format('Remaining dog food is %sg (%s%% capacity). Restock suggested within 24 hours.', m.dog_food_current_grams, dog_pct));

  -- bins (>= 90%, critical when full)
  perform public._sync_alert(m.id, m.shelter_id, 'bin_full', 'bottle',
    coalesce(bottle_pct, 0) >= 90,
    case when coalesce(bottle_pct, 0) >= 100 then 'critical'::public.alert_severity else 'warning'::public.alert_severity end,
    'Bottle Bin Nearly Full',
    format('Bottle bin holds %s of %s items (%s%%). Schedule a collection.', m.bottles_current, m.bottles_capacity, bottle_pct));

  perform public._sync_alert(m.id, m.shelter_id, 'bin_full', 'can',
    coalesce(can_pct, 0) >= 90,
    case when coalesce(can_pct, 0) >= 100 then 'critical'::public.alert_severity else 'warning'::public.alert_severity end,
    'Can Bin Nearly Full',
    format('Can bin holds %s of %s items (%s%%). Schedule a collection.', m.cans_current, m.cans_capacity, can_pct));

  -- expiring stock (within 30 days, critical once expired)
  perform public._sync_alert(m.id, m.shelter_id, 'expiring_stock', 'cat',
    m.cat_food_expiry_date is not null and m.cat_food_expiry_date <= current_date + 30,
    case when m.cat_food_expiry_date < current_date then 'critical'::public.alert_severity else 'warning'::public.alert_severity end,
    'Cat Food Expiring Soon',
    format('Cat food in this machine expires on %s.', m.cat_food_expiry_date));

  perform public._sync_alert(m.id, m.shelter_id, 'expiring_stock', 'dog',
    m.dog_food_expiry_date is not null and m.dog_food_expiry_date <= current_date + 30,
    case when m.dog_food_expiry_date < current_date then 'critical'::public.alert_severity else 'warning'::public.alert_severity end,
    'Dog Food Expiring Soon',
    format('Dog food in this machine expires on %s.', m.dog_food_expiry_date));

  -- offline
  perform public._sync_alert(m.id, m.shelter_id, 'offline', null,
    m.status = 'offline',
    'critical',
    'Machine Offline',
    'No data has been received from this machine recently.');
end;
$$;

create or replace function public.machines_after_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.refresh_machine_alerts(new.id);
  return null;
end;
$$;

create trigger machines_refresh_alerts
  after insert or update of
    status,
    bottles_current, bottles_capacity, cans_current, cans_capacity,
    cat_food_current_grams, cat_food_capacity_grams, dog_food_current_grams, dog_food_capacity_grams,
    cat_food_expiry_date, dog_food_expiry_date
  on public.machines
  for each row execute function public.machines_after_change();

-- Call from a schedule (Vercel Cron -> API route using the service role, or pg_cron):
-- marks silent machines offline and re-checks expiry dates for every machine.
create or replace function public.run_machine_health_check(p_stale_minutes integer default 10)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  r record;
begin
  update public.machines
     set status = 'offline'
   where status in ('online', 'warning')
     and last_sync_at < now() - make_interval(mins => p_stale_minutes);

  for r in select id from public.machines loop
    perform public.refresh_machine_alerts(r.id);
  end loop;
end;
$$;

-- 3. TRANSACTIONS ------------------------------------------------------
create or replace function public.tx_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select m.shelter_id into new.shelter_id
    from public.machines m where m.id = new.machine_id;

  if new.user_id is not null then
    select coalesce(p.display_name, public.short_name(p.full_name))
      into new.user_display_name
      from public.profiles p where p.id = new.user_id;
  end if;

  new.user_display_name := coalesce(new.user_display_name, 'Anonymous');
  return new;
end;
$$;

create trigger tx_before_insert
  before insert on public.transactions
  for each row execute function public.tx_before_insert();

create or replace function public.tx_after_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Any transaction proves the machine is alive; only accepted ones change stock.
  update public.machines m set
    bottles_current = case when new.status = 'accepted' and new.item_type = 'bottle'
                           then least(m.bottles_current + 1, m.bottles_capacity) else m.bottles_current end,
    cans_current    = case when new.status = 'accepted' and new.item_type = 'can'
                           then least(m.cans_current + 1, m.cans_capacity) else m.cans_current end,
    cat_food_current_grams = case when new.status = 'accepted' and new.food_type = 'cat'
                           then greatest(m.cat_food_current_grams - new.food_dispensed_grams, 0) else m.cat_food_current_grams end,
    dog_food_current_grams = case when new.status = 'accepted' and new.food_type = 'dog'
                           then greatest(m.dog_food_current_grams - new.food_dispensed_grams, 0) else m.dog_food_current_grams end,
    last_sync_at = now(),
    status = case when m.status = 'maintenance' then m.status else 'online' end
  where m.id = new.machine_id;

  if new.status = 'accepted' then
    update public.shelters s set
      total_recycled_items      = s.total_recycled_items + 1,
      total_food_received_grams = s.total_food_received_grams + new.food_dispensed_grams
    where s.id = new.shelter_id;
  end if;

  return null;
end;
$$;

create trigger tx_after_insert
  after insert on public.transactions
  for each row execute function public.tx_after_insert();
