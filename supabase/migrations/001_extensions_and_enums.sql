-- 001_extensions_and_enums.sql
-- Shared enum types. Values mirror src/lib/types.ts.

create type public.user_role       as enum ('superadmin', 'shelter', 'user');
create type public.machine_status  as enum ('online', 'warning', 'offline', 'maintenance');
create type public.sensor_status   as enum ('healthy', 'check');
create type public.item_type       as enum ('bottle', 'can');
create type public.food_type       as enum ('cat', 'dog');
create type public.tx_status       as enum ('accepted', 'rejected');
create type public.alert_type      as enum ('low_food', 'bin_full', 'expiring_stock', 'offline');
create type public.alert_severity  as enum ('critical', 'warning', 'info');
