-- 008_rpc_functions.sql
-- Functions the UI calls with supabase.rpc(...). They run as SECURITY DEFINER
-- and do their own permission checks, so shelter staff never get direct UPDATE
-- rights on machines or alerts.

-- Restock a food hopper (store.refillFood)
create or replace function public.refill_food(
  p_machine_id uuid,
  p_food       public.food_type,
  p_grams      integer,
  p_expiry     date
)
returns public.machines
language plpgsql
security definer
set search_path = ''
as $$
declare
  m public.machines;
begin
  if p_grams is null or p_grams <= 0 then
    raise exception 'grams must be positive';
  end if;

  select * into m from public.machines where id = p_machine_id for update;
  if not found then
    raise exception 'machine not found';
  end if;
  if not public.can_manage_shelter(m.shelter_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  if p_food = 'cat' then
    update public.machines
       set cat_food_current_grams = least(cat_food_current_grams + p_grams, cat_food_capacity_grams),
           cat_food_expiry_date   = p_expiry,
           last_sync_at           = now()
     where id = p_machine_id
     returning * into m;
  else
    update public.machines
       set dog_food_current_grams = least(dog_food_current_grams + p_grams, dog_food_capacity_grams),
           dog_food_expiry_date   = p_expiry,
           last_sync_at           = now()
     where id = p_machine_id
     returning * into m;
  end if;

  return m;
end;
$$;

-- Empty a recyclables bin (store.collectBin)
create or replace function public.collect_bin(
  p_machine_id uuid,
  p_bin        public.item_type
)
returns public.machines
language plpgsql
security definer
set search_path = ''
as $$
declare
  m public.machines;
begin
  select * into m from public.machines where id = p_machine_id for update;
  if not found then
    raise exception 'machine not found';
  end if;
  if not public.can_manage_shelter(m.shelter_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  if p_bin = 'bottle' then
    update public.machines set bottles_current = 0 where id = p_machine_id returning * into m;
  else
    update public.machines set cans_current = 0 where id = p_machine_id returning * into m;
  end if;

  return m;
end;
$$;

-- Manually resolve an alert (store.resolveAlert).
-- Note: if the condition still holds, it re-opens on the next machine update.
create or replace function public.resolve_alert(p_alert_id uuid)
returns public.alerts
language plpgsql
security definer
set search_path = ''
as $$
declare
  a public.alerts;
begin
  select * into a from public.alerts where id = p_alert_id;
  if not found then
    raise exception 'alert not found';
  end if;
  if not public.can_manage_shelter(a.shelter_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  update public.alerts
     set resolved = true, resolved_at = now()
   where id = p_alert_id
   returning * into a;

  return a;
end;
$$;

-- Leaderboard: p_period = 'all' | 'week' | 'month'. Exposes only short display names.
create or replace function public.get_leaderboard(
  p_period text default 'all',
  p_limit  integer default 20
)
returns table (
  rank                bigint,
  user_id             uuid,
  display_name        text,
  items_recycled      bigint,
  food_donated_grams  bigint,
  shelter_supported   text
)
language sql
stable
security definer
set search_path = ''
as $$
  with agg as (
    select t.user_id,
           count(*)                        as items,
           coalesce(sum(t.food_dispensed_grams), 0) as grams
      from public.transactions t
     where t.user_id is not null
       and t.status = 'accepted'
       and (
         p_period = 'all'
         or t.occurred_at >= case p_period
                               when 'week'  then now() - interval '7 days'
                               when 'month' then now() - interval '30 days'
                             end
       )
     group by t.user_id
  ),
  last_shelter as (
    select distinct on (t.user_id) t.user_id, s.name
      from public.transactions t
      join public.shelters s on s.id = t.shelter_id
     where t.user_id is not null
     order by t.user_id, t.occurred_at desc
  )
  select row_number() over (order by a.items desc, a.grams desc, p.display_name),
         a.user_id,
         coalesce(p.display_name, 'Anonymous'),
         a.items,
         a.grams,
         ls.name
    from agg a
    join public.profiles p on p.id = a.user_id
    left join last_shelter ls on ls.user_id = a.user_id
   order by 1
   limit least(greatest(p_limit, 1), 100);
$$;

-- EXECUTE PERMISSIONS --------------------------------------------------
-- Callable from the app by signed-in users only:
revoke execute on function public.refill_food(uuid, public.food_type, integer, date) from public, anon;
revoke execute on function public.collect_bin(uuid, public.item_type)                from public, anon;
revoke execute on function public.resolve_alert(uuid)                                from public, anon;
revoke execute on function public.get_leaderboard(text, integer)                     from public, anon;
grant  execute on function public.refill_food(uuid, public.food_type, integer, date) to authenticated;
grant  execute on function public.collect_bin(uuid, public.item_type)                to authenticated;
grant  execute on function public.resolve_alert(uuid)                                to authenticated;
grant  execute on function public.get_leaderboard(text, integer)                     to authenticated;

-- Internal only (triggers, cron via service role):
revoke execute on function public._sync_alert(uuid, uuid, public.alert_type, text, boolean, public.alert_severity, text, text) from public, anon, authenticated;
revoke execute on function public.refresh_machine_alerts(uuid)        from public, anon, authenticated;
revoke execute on function public.run_machine_health_check(integer)   from public, anon, authenticated;
revoke execute on function public.machines_after_change()             from public, anon, authenticated;
revoke execute on function public.tx_before_insert()                  from public, anon, authenticated;
revoke execute on function public.tx_after_insert()                   from public, anon, authenticated;
revoke execute on function public.handle_new_user()                   from public, anon, authenticated;
