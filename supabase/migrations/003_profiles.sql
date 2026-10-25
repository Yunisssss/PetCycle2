-- 003_profiles.sql
-- One profile per auth user (Google sign-in creates the auth user; the trigger
-- below creates the profile). Roles mirror UserRole in src/lib/types.ts.
--
-- SECURITY: everyone who signs up starts as 'user'. 'shelter' and 'superadmin'
-- are assigned manually (SQL editor / service role) -- never from the client.

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  full_name     text,
  display_name  text,                       -- short public name, e.g. "Juan D."
  avatar_url    text,
  role          public.user_role not null default 'user',
  shelter_id    uuid references public.shelters(id) on delete restrict,
  agency        text,                       -- superadmin only, e.g. LGU bureau
  created_at    timestamptz not null default now(),
  constraint shelter_role_needs_shelter check (role <> 'shelter' or shelter_id is not null)
);

create index profiles_shelter_idx on public.profiles (shelter_id);

-- "Juan Dela Cruz" -> "Juan C."
create or replace function public.short_name(full_name text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when full_name is null or btrim(full_name) = '' then 'Anonymous'
    when position(' ' in btrim(full_name)) = 0 then btrim(full_name)
    else split_part(btrim(full_name), ' ', 1) || ' ' ||
         upper(left(regexp_replace(btrim(full_name), '^.*\s', ''), 1)) || '.'
  end;
$$;

-- Create the profile automatically on first sign-in (Google or otherwise).
-- Role is ALWAYS 'user'; never read it from user metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name');
begin
  insert into public.profiles (id, email, full_name, display_name, avatar_url)
  values (
    new.id,
    new.email,
    v_name,
    public.short_name(v_name),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helpers used by RLS policies and RPCs (always return true/false, never null).
create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'superadmin'
  );
$$;

-- superadmin, or shelter staff belonging to that shelter
create or replace function public.can_manage_shelter(p_shelter_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (p.role = 'superadmin' or (p.role = 'shelter' and p.shelter_id = p_shelter_id))
  );
$$;
