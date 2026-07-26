-- Approved Flash Tour cruise catalogue.  Draft-only and idempotent for dashboard review.
with cruises(slug, title, sort_order) as (
  values
    ('magic-i', 'Magic I', 10),
    ('magic-ii', 'Magic II', 20),
    ('lady-carol', 'Lady Carol', 30),
    ('lady-mary', 'Lady Mary', 40),
    ('nile-excellence', 'Nile Excellence', 50),
    ('nile-majestic', 'Nile Majestic', 60),
    ('nile-divine', 'Nile Divine', 70),
    ('flash-boats', 'Flash Boats', 80),
    ('luxury-speed-boat', 'Luxury Speed Boat', 90)
), inserted as (
  insert into public.content_entries (content_type, slug, title, locale, status, sort_order, is_active, draft_data)
  select 'cruise'::public.content_type, slug, title, 'en', 'draft', sort_order, true,
    jsonb_build_object('title', title, 'slug', slug, 'shortDescription', '', 'fullDescription', '', 'facilities', '[]'::jsonb, 'diningOptions', '[]'::jsonb, 'accessibility', '[]'::jsonb, 'gallery', '[]'::jsonb, 'displayOrder', sort_order, 'isActive', true, 'kind', 'cruise')
  from cruises
  on conflict (content_type, locale, slug) do nothing
  returning id, slug, draft_data
), all_cruises as (
  select id, slug, draft_data from public.content_entries where content_type = 'cruise' and locale = 'en' and slug in (select slug from cruises)
), seo as (
  insert into public.seo_entries (content_entry_id, locale, draft_data)
  select id, 'en', jsonb_build_object('title', '', 'description', '', 'keywords', '[]'::jsonb, 'canonicalUrl', '', 'openGraph', jsonb_build_object('title', '', 'description', '', 'image', ''))
  from all_cruises
  on conflict (content_entry_id, locale) where content_entry_id is not null do nothing
  returning content_entry_id
)
insert into public.content_revisions (resource_type, resource_id, version, snapshot, event)
select 'cruise', cruise.id, 1, jsonb_build_object('content', cruise.draft_data, 'seo', coalesce(seo.draft_data, '{}'::jsonb)), 'draft_saved'
from all_cruises cruise
join public.seo_entries seo on seo.content_entry_id = cruise.id and seo.locale = 'en'
on conflict (resource_type, resource_id, version) do nothing;
