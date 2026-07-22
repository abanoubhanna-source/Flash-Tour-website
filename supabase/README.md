# Flash Tour CMS database

The Supabase schema is managed exclusively through versioned files in this directory. Do not make
production schema or policy changes manually in Supabase Studio.

## Local workflow

1. Start Docker Desktop.
2. Run `supabase start` from the repository root.
3. Run `supabase db reset` to apply migrations and local seed data.
4. Run `supabase test db` to execute the pgTAP policy tests.
5. Regenerate application types after every migration:

   ```sh
   supabase gen types typescript --local > src/types/database.generated.ts
   ```

The `site-media` storage bucket is public-read and staff-write. Draft CMS data remains in protected
base tables; the public website reads only the `published_*` projections.

Production credentials belong in Vercel environment variables. Never commit service-role keys.
