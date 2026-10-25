<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Database / Supabase rules (append to AGENTS.md)

- Every schema change is a NEW file in `supabase/migrations/` named `NNN_description.sql`
  (next unused 3-digit number; never reuse a number).
- Never edit a migration that has already been applied. Add a new one.
- No dashboard-only schema changes: if the DB changes, the repo gets a migration file.
- Every new table enables RLS and defines its policies in the same migration.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only: never import `lib/supabase/admin` into a
  client component, never use a `NEXT_PUBLIC_` prefix on it, never commit `.env*` files.
- Roles (`user`, `shelter`, `superadmin`) are enforced by RLS in the database. UI checks are
  only for navigation/UX, never for security.
- After a migration changes the schema, regenerate types:
  `npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts`
- Next.js 16: `cookies()`, `headers()` and `params` are async, and `middleware.ts` has been
  renamed `proxy.ts`. Check the local Next.js docs before writing auth/session code.
