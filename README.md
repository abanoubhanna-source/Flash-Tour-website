# Flash Group Web

The Flash Tour public website and its CMS dashboard — Next.js 16 (App Router) + React 19 + Supabase.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). The CMS dashboard lives at `/dashboard`.

## Environments

There is **one** of everything. If something looks duplicated, it isn't:

| | Where | Notes |
|---|---|---|
| Code | `github.com/abanoubhanna-source/Flash-Tour-website` | single remote (`origin`) |
| Hosting | Vercel project `flash-tour` | single project |
| Database | Supabase project `wrhovmsvkhzppdnegiep` ("Flashtour website", `eu-central-1`) | **the only real database** |
| Local database | Supabase CLI stack in Docker (API on `:55321`, Studio on `:55323`) | disposable sandbox, not a second environment |

### Which database does `npm run dev` use?

Whichever one `.env.local` points at — and by default that is the **live hosted project**, not the local Docker stack. Edits made through the dashboard in local dev are therefore real, published edits.

`.env.local` keeps exactly one active Supabase block; the other is commented out with instructions for switching. Duplicate `NEXT_PUBLIC_SUPABASE_URL` keys in a single `.env` file silently override each other (last definition wins), so never leave two blocks uncommented.

To work against the local sandbox instead:

```bash
npm run supabase:start
npx supabase status   # read the current local keys
```

then swap the commented blocks in `.env.local` and restart the dev server.

## Database workflow

Migrations live in `supabase/migrations/` and are the single source of truth for schema, RLS policies, and seeded content.

```bash
npm run db:reset   # rebuild the LOCAL database from migrations + seed
npm run db:test    # run the pgTAP suite (supabase/tests/)
npm run db:types   # regenerate src/types/database.generated.ts from the local DB
```

Applying migrations to the hosted project (`supabase db push`) affects the live site. Always run `db:reset` and `db:test` locally first.

## Content model

Public pages read published CMS content through security-barrier views (`published_content_entries`, `published_destination_hierarchy`, `published_pages`) which expose only rows that are `published`, active, and have non-null `published_data`. The raw `content_entries` / `content_relations` tables have no `anon` grant.

Every public page ships a curated fallback (`src/data/*.json` or an inline default array) that renders when the CMS has nothing published for that slug — so the site never renders empty.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm run lint` | ESLint |
| `npm run supabase:start` / `supabase:stop` | local Supabase stack (needs Docker) |
| `npm run db:reset` / `db:test` / `db:types` | see [Database workflow](#database-workflow) |

## Conventions

This repo targets Next.js 16, whose APIs and file conventions differ from earlier versions. See [`AGENTS.md`](AGENTS.md) — check `node_modules/next/dist/docs/` before writing code against an API you remember from an older release.
