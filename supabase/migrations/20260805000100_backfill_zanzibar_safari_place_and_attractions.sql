-- Unlike Zanzibar Island, the "Safari" section on the Zanzibar destination
-- page (Selous Reserve / Ngorongoro Conservation / Mikumi Park) only ever
-- existed as hardcoded text with no slug and no backing CMS entries, so it
-- had zero dashboard control and no detail pages. Create it as a real
-- destination_place under Zanzibar (Tanzania) with its three attractions,
-- copy taken verbatim from the page — matching the same fix already applied
-- to Morocco's Marrakech attractions.

insert into public.content_entries (content_type, slug, title, locale, status, sort_order, draft_data, published_data, published_at)
values (
  'destination_place',
  'safari',
  'Safari',
  'en',
  'published',
  600,
  jsonb_build_object(
    'kind', 'place', 'name', 'Safari', 'slug', 'safari', 'country', 'Tanzania',
    'summary', 'Private car Safari excursions into Africa''s biggest Savannas.',
    'fullDescription', 'Africa, the land of the wildlife. The most famous Safari''s in the world are in the biggest Savannas located in Africa. Luckily, we are here to make your experience unforgettable. Yes, you read it right. We organize Safari excursions with a private car, and accommodation. You can stay in the Savannah for a couple of days or you can enjoy the best of both worlds, because we have now launched an overday Safari from Zanzibar Island to Mikumi or Selous.',
    'gallery', jsonb_build_array(jsonb_build_object('url', '/images/safari-main.jpg', 'alt', 'Safari', 'assetId', null)),
    'isActive', true, 'displayOrder', 600, 'seedKey', 'official-zanzibar-safari'
  ),
  jsonb_build_object(
    'kind', 'place', 'name', 'Safari', 'slug', 'safari', 'country', 'Tanzania',
    'summary', 'Private car Safari excursions into Africa''s biggest Savannas.',
    'fullDescription', 'Africa, the land of the wildlife. The most famous Safari''s in the world are in the biggest Savannas located in Africa. Luckily, we are here to make your experience unforgettable. Yes, you read it right. We organize Safari excursions with a private car, and accommodation. You can stay in the Savannah for a couple of days or you can enjoy the best of both worlds, because we have now launched an overday Safari from Zanzibar Island to Mikumi or Selous.',
    'gallery', jsonb_build_array(jsonb_build_object('url', '/images/safari-main.jpg', 'alt', 'Safari', 'assetId', null)),
    'isActive', true, 'displayOrder', 600, 'seedKey', 'official-zanzibar-safari'
  ),
  now()
)
on conflict (content_type, locale, slug) do nothing;

insert into public.content_relations (source_id, target_id, relation_type, sort_order)
select
  '33000000-0000-4000-8000-000000000003'::uuid,
  ce.id,
  'contains_place',
  1
from public.content_entries ce
where ce.content_type = 'destination_place' and ce.slug = 'safari'
on conflict (source_id, target_id, relation_type) do nothing;

with new_attractions (slug, title, summary, full_description, image_url, sort_order) as (
  values
    ('selous-reserve', 'Selous Reserve',
     'Africa''s largest protected wildlife reserve.',
     'Africa''s largest protected reserve and home to the largest concentration of elephants in the world. Announced as a world heritage site by UNESCO.',
     '/images/selous.jpg', 610),
    ('ngorongoro-conservation', 'Ngorongoro Conservation',
     'A safe haven for globally threatened species.',
     'A safe haven for globally threatened species to thrive in their natural habitat free of poachers. Also serves as settlements for semi-nomadic Massai tribes.',
     '/images/ngorongoro.jpg', 620),
    ('mikumi-park', 'Mikumi Park',
     'Home to the tree-climbing lions.',
     'A wild park featuring a variety of wild animals and home to the tree-climbing lions. A resting spot for several migratory wildlife.',
     '/images/mikumi.jpg', 630)
),
inserted as (
  insert into public.content_entries (content_type, slug, title, locale, status, sort_order, draft_data, published_data, published_at)
  select
    'destination_attraction',
    na.slug,
    na.title,
    'en',
    'published',
    na.sort_order,
    jsonb_build_object(
      'kind', 'attraction', 'name', na.title, 'slug', na.slug, 'summary', na.summary, 'fullDescription', na.full_description,
      'gallery', jsonb_build_array(jsonb_build_object('url', na.image_url, 'alt', na.title, 'assetId', null)),
      'isActive', true, 'displayOrder', na.sort_order, 'seedKey', 'official-zanzibar-attraction-' || na.slug
    ),
    jsonb_build_object(
      'kind', 'attraction', 'name', na.title, 'slug', na.slug, 'summary', na.summary, 'fullDescription', na.full_description,
      'gallery', jsonb_build_array(jsonb_build_object('url', na.image_url, 'alt', na.title, 'assetId', null)),
      'isActive', true, 'displayOrder', na.sort_order, 'seedKey', 'official-zanzibar-attraction-' || na.slug
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
  (select id from public.content_entries where content_type = 'destination_place' and slug = 'safari'),
  inserted.id,
  'contains_attraction',
  row_number() over ()
from inserted;
