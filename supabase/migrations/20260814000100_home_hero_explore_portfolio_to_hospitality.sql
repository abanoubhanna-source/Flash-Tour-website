-- The Home hero's "Explore Portfolio" secondary CTA (first slide) pointed to
-- /brands, a page with no navigation entry point of its own. Point it to
-- /hospitality instead, which is fully built out and already in the main nav.

update page_sections
set draft_data = jsonb_set(
  draft_data,
  '{slides,0,secondaryCta,href}',
  '"/hospitality"'
)
where key = 'hero'
  and page_id = (select id from pages where path = '/')
  and draft_data->'slides'->0->>'id' = 'group';

update page_sections
set published_data = jsonb_set(
  published_data,
  '{slides,0,secondaryCta,href}',
  '"/hospitality"'
)
where key = 'hero'
  and page_id = (select id from pages where path = '/')
  and published_data is not null
  and published_data->'slides'->0->>'id' = 'group';
