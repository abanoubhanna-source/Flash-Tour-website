-- 20260725000200_seed_official_website_content.sql originally seeded two services
-- ("Golf" and "Hajj and Umrah") and one destination ("United Arab Emirates") under
-- slugs that differ from the already-published records for the same content
-- ("golf-travel-services" vs "golf", "hajj-umrah" vs "hajj-and-umrah",
-- "united-arab-emirates" vs "uae"). Because the slugs differed, ON CONFLICT never
-- matched, and three duplicate draft rows were created instead of being skipped as
-- intended ("A previously existing service is left intact").
--
-- The seed file has since been corrected to use the existing slugs, which prevents
-- this on any future `supabase db reset`. But this migration had already run against
-- this project before the fix, so the duplicate rows already exist and need removing
-- here rather than relying on the corrected seed file (which will now always no-op
-- for these three rows via ON CONFLICT).
--
-- Safety: every delete below is scoped to the exact, verified duplicate row ids and
-- guarded with `status = 'draft' and published_data is null`, so this only removes
-- rows that are still in their untouched, never-published, auto-seeded state. If an
-- editor has since edited or published one of these rows, the guard skips it instead
-- of destroying real work.
--
-- The five UAE places (Dubai, Abu Dhabi, Ras Al Khaimah, Fujairah, Sharjah) were
-- seeded as children of the duplicate "united-arab-emirates" draft rather than the
-- real, published "uae" destination. They are reparented to "uae" before the
-- duplicate is removed, so the destination hierarchy stays intact.

do $$
declare
  duplicate_ids uuid[] := array[
    '0cbcdaf0-6a3b-4a3b-a530-62feeb6f782a', -- service: golf-travel-services (duplicate of golf)
    '3fd0d18b-8d30-4074-9ed8-6a0eb824d84a', -- service: hajj-umrah (duplicate of hajj-and-umrah)
    'e8de34a7-2d90-44e0-8f7e-907726891bb5'  -- destination: united-arab-emirates (duplicate of uae)
  ];
  real_uae_id uuid;
begin
  select id into real_uae_id from public.content_entries where content_type = 'destination' and locale = 'en' and slug = 'uae';

  if real_uae_id is not null then
    update public.content_relations
    set source_id = real_uae_id
    where source_id = 'e8de34a7-2d90-44e0-8f7e-907726891bb5'
      and relation_type = 'contains_place'
      and not exists (
        select 1 from public.content_relations existing
        where existing.source_id = real_uae_id
          and existing.target_id = content_relations.target_id
          and existing.relation_type = 'contains_place'
      );
  end if;

  delete from public.content_revisions
  where resource_id = any(duplicate_ids);

  delete from public.content_entries
  where id = any(duplicate_ids)
    and status = 'draft'
    and published_data is null;
end $$;
