-- Unlike Egypt/UAE/Italy/Zanzibar, Morocco's Marrakech attractions (Luxury
-- Riads, Jemaa el-Fnaa, Bahia Palace) only ever existed as hardcoded copy in
-- src/app/destinations/morocco/page.tsx — no destination_attraction rows
-- backed them, so /api/destinations/hierarchy?slug=morocco always returned
-- attractions: [] for Marrakech, and the new /destinations/morocco/marrakech
-- drill-down page would have nothing to show. Create the three real entries
-- (copy taken verbatim from the page) and link them to the existing
-- Marrakech destination_place entry, matching the pattern already used for
-- every other country's attractions.

with new_attractions (slug, title, summary, full_description, image_url) as (
  values
    ('luxury-riads', 'Luxury Riads',
     'Curated high-end Riads in the heart of the Medina.',
     'Experience ultimate privacy and authentic Moroccan hospitality in our curated selection of high-end Riads located in the heart of the Medina.',
     '/images/destinations/morocco/marrakech-riad-interior.jpg'),
    ('jemaa-el-fnaa', 'Jemaa el-Fnaa',
     'The vibrant heartbeat of Marrakech.',
     'The vibrant heartbeat of the city. A UNESCO Masterpiece of the Oral and Intangible Heritage of Humanity, offering an unforgettable cultural immersion.',
     '/images/destinations/morocco/marrakech-jemaa-el-fnaa.jpg'),
    ('bahia-palace', 'Bahia Palace',
     'A 19th-century palace of Islamic and Moroccan architecture.',
     'A 19th-century palace reflecting the true essence of Islamic and Moroccan architectural brilliance, surrounded by lush, tranquil gardens.',
     '/images/destinations/morocco/marrakech-bahia-palace.jpg')
),
inserted as (
  insert into public.content_entries (content_type, slug, title, locale, status, sort_order, draft_data, published_data, published_at)
  select
    'destination_attraction',
    na.slug,
    na.title,
    'en',
    'published',
    row_number() over () * 10,
    jsonb_build_object(
      'kind', 'attraction', 'name', na.title, 'slug', na.slug, 'summary', na.summary, 'fullDescription', na.full_description,
      'gallery', jsonb_build_array(jsonb_build_object('url', na.image_url, 'alt', na.title, 'assetId', null)),
      'isActive', true, 'displayOrder', row_number() over () * 10, 'seedKey', 'official-morocco-attraction-' || na.slug
    ),
    jsonb_build_object(
      'kind', 'attraction', 'name', na.title, 'slug', na.slug, 'summary', na.summary, 'fullDescription', na.full_description,
      'gallery', jsonb_build_array(jsonb_build_object('url', na.image_url, 'alt', na.title, 'assetId', null)),
      'isActive', true, 'displayOrder', row_number() over () * 10, 'seedKey', 'official-morocco-attraction-' || na.slug
    ),
    now()
  from new_attractions na
  where not exists (
    select 1 from public.content_entries existing
    where existing.content_type = 'destination_attraction' and existing.slug = na.slug
  )
  returning id, slug
)
insert into public.content_relations (source_id, target_id, relation_type, sort_order)
select
  (select id from public.content_entries where content_type = 'destination_place' and slug = 'marrakech'),
  inserted.id,
  'contains_attraction',
  row_number() over ()
from inserted;
