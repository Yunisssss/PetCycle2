# PetCycle database (Supabase / PostgreSQL)

Every schema change lives in `supabase/migrations/` as a numbered SQL file.
The repo is the source of truth; the Supabase dashboard is only where we run them.

## Rules
1. One concern per file, named `NNN_short_description.sql`. Use the next unused number. **No duplicate numbers.**
2. **Never edit a migration that has already been applied.** Add a new file instead (`013_...`).
3. No dashboard-only schema changes. If you changed something in the dashboard, write the matching migration file.
4. Every new table gets `enable row level security` and its policies **in the same migration**.
5. Secrets never go in SQL files (no keys, no real emails/passwords).

## Current migrations
| File | Purpose |
|---|---|
| 001_extensions_and_enums | enum types |
| 002_shelters | partner shelters |
| 003_profiles | profiles, Google sign-up trigger, role helpers |
| 004_machines | machines + device credentials |
| 005_transactions | deposits |
| 006_alerts | system alerts |
| 007_functions_and_triggers | status derivation, alert engine, inventory updates |
| 008_rpc_functions | refill_food, collect_bin, resolve_alert, get_leaderboard |
| 009_rls_policies | row level security + column grants |
| 010_realtime | realtime publication |
| 011_views | public_machines, daily_collection |
| 012_seed_data | demo shelter + machine |

## How to apply
**Manually (current):** Supabase Dashboard > SQL Editor > New query > paste one file > Run. Go in numeric order, one file at a time, and stop at the first error.

**CLI (optional later):** `npx supabase link --project-ref <ref>` then `npx supabase db push`.

## Roles
- Anyone who signs in with Google becomes a `user`.
- Promote staff in the SQL Editor (set role and shelter in ONE statement):
  ```sql
  update public.profiles
     set role = 'shelter', shelter_id = (select id from public.shelters where name = 'PAWS Animal Rehabilitation Center')
   where email = 'staff@example.com';

  update public.profiles
     set role = 'superadmin', agency = 'LGU Environmental Management Bureau'
   where email = 'admin@example.com';
  ```
- The person must have signed in once first so their profile row exists.

## Device writes
The ESP32 never touches tables directly. It POSTs to a server route that checks a
device key and inserts into `transactions` with the service role. Database triggers
then update machine counts, hopper levels, shelter totals and alerts.
