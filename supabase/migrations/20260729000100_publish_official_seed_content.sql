-- Publish the official website content that was seeded as drafts in
-- 20260725000200_seed_official_website_content.sql.
--
-- Safety guarantees:
--   * only rows carrying a seedKey starting with 'official-' are touched;
--   * any row already published, or any row without that seedKey marker
--     (i.e. anything a human has created or edited by hand), is left alone;
--   * this only promotes draft_data -> published_data, it never invents data.

update public.content_entries
set
  published_data = draft_data,
  status = 'published',
  published_at = now()
where status = 'draft'
  and draft_data ? 'seedKey'
  and draft_data->>'seedKey' like 'official-%';

-- One 'published' revision per row this migration promotes, so the history
-- in the dashboard reflects that these went live via this migration.
insert into public.content_revisions (resource_type, resource_id, version, snapshot, event)
select
  e.content_type::text,
  e.id,
  coalesce((select max(r.version) from public.content_revisions r
            where r.resource_type = e.content_type::text and r.resource_id = e.id), 0) + 1,
  jsonb_build_object('seedKey', 'official_website_content_publish_v1', 'content', e.published_data),
  'published'
from public.content_entries e
where e.status = 'published'
  and e.published_data ? 'seedKey'
  and e.published_data->>'seedKey' like 'official-%'
  and not exists (
    select 1 from public.content_revisions r
    where r.resource_type = e.content_type::text
      and r.resource_id = e.id
      and r.snapshot->>'seedKey' = 'official_website_content_publish_v1'
  );
