-- The About page's 11 sections (hero_intro, experience, highlights,
-- work_process, vision, mission, services_summary, expansion_journey,
-- ceo_message, team, languages) already hold real written copy in
-- draft_data (seeded by 20260725000200_seed_official_website_content.sql)
-- but published_data was null everywhere, the page itself was never
-- enabled, and it never got a seo_entries row at all — which is why the
-- dashboard showed it as Draft with SEO "Missing".
--
-- This only publishes what's already there; it does NOT wire the public
-- /about page to read it. That page's fields (hero.tag/title_part1/
-- title_part2, flat vision/mission/ceo_message strings, a differently-
-- shaped timeline) don't line up one-to-one with these section shapes, so
-- rendering them needs a deliberate mapping pass, not a rushed one.

update public.page_sections
set published_data = draft_data, published_at = now()
where page_id = (select id from public.pages where key = 'about')
  and published_data is null;

update public.pages
set enabled = true
where key = 'about';

insert into public.seo_entries (page_id, locale, draft_data, published_data, published_at)
select
  p.id, 'en',
  jsonb_build_object('title', 'About Flash Tour | Flash Group', 'description', 'Flash Tour Group is an IATA and ASTA licensed travel agency offering a wide range of travel services since 1985.', 'canonicalPath', '/about', 'ogImage', ''),
  jsonb_build_object('title', 'About Flash Tour | Flash Group', 'description', 'Flash Tour Group is an IATA and ASTA licensed travel agency offering a wide range of travel services since 1985.', 'canonicalPath', '/about', 'ogImage', ''),
  now()
from public.pages p
where p.key = 'about'
  and not exists (select 1 from public.seo_entries s where s.page_id = p.id);

insert into public.content_revisions (resource_type, resource_id, version, snapshot, event)
select
  'page', p.id, 1,
  jsonb_build_object('seedKey', 'about_page_publish_v1', 'page', jsonb_build_object('key', p.key, 'path', p.path)),
  'published'
from public.pages p
where p.key = 'about'
  and not exists (
    select 1 from public.content_revisions r
    where r.resource_type = 'page' and r.resource_id = p.id and r.snapshot->>'seedKey' = 'about_page_publish_v1'
  );
