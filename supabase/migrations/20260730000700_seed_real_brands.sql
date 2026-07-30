-- The Brands dashboard module had only one archived QA test entry — the 6
-- real brands shown on the public site (/brands, Home's brand teaser) only
-- ever existed as the static src/data/brands.json fallback, never as real
-- CMS content, so editing "brands" from the dashboard was a no-op.
--
-- Five of the six are the same real properties already published under
-- Hospitality (True Beach Resort, Kiwengwa Beach Resort, 1920s Boutique
-- Hotel, Rossini, and the Nile Excellence dahabiya) — this seeds them as
-- their own "brand" entries (a brand-page pitch is worded differently from
-- a hospitality property's operational detail copy, so this isn't a
-- duplicate to dedupe, it's the missing brand-facing content). "Nile
-- Serenity" has no other CMS counterpart anywhere, so it's seeded from the
-- existing brands.json copy directly. icon/color are carried as plain
-- extra JSON fields (contentSchema doesn't model them yet) since
-- getPublishedCollection passes the whole draft_data object through as-is.

insert into public.content_entries (
  content_type, slug, title, locale, status, sort_order, is_active, draft_data, published_data, published_at
)
select
  'brand', v.slug, v.title, 'en', 'published', v.sort_order, true, v.data, v.data, now()
from (values
  ('nile-serenity', 'Nile Serenity', 10, jsonb_build_object(
    'seedKey', 'official-brand-nile-serenity',
    'title', 'Nile Serenity', 'slug', 'nile-serenity',
    'shortDescription', 'Setting the absolute benchmark for river cruising.',
    'fullDescription', 'Designed for the global elite, offering uninterrupted panoramic views and uncompromised luxury on the Nile.',
    'facilities', jsonb_build_array('72 Luxury Suites', 'Gourmet Gastronomy', 'Rooftop Infinity Pool', 'Private Docking'),
    'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/cruise-1.jpg', 'alt', 'Nile Serenity', 'caption', '')),
    'icon', 'Ship', 'color', 'teal', 'displayOrder', 10, 'isActive', true
  )),
  ('nile-excellence-brand', 'Nile Excellence', 20, jsonb_build_object(
    'seedKey', 'official-brand-nile-excellence',
    'title', 'Nile Excellence', 'slug', 'nile-excellence-brand',
    'shortDescription', 'A seamless blend of contemporary design and classic river heritage.',
    'fullDescription', 'Featuring expansive sun decks and premium culinary experiences along the historic waters.',
    'facilities', jsonb_build_array('68 Premium Cabins', 'Panoramic Lounge', 'Spa & Wellness', 'VIP Concierge'),
    'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/cruise-2.jpg', 'alt', 'Nile Excellence', 'caption', '')),
    'icon', 'Ship', 'color', 'teal', 'displayOrder', 20, 'isActive', true
  )),
  ('true-beach-resort-brand', 'True Beach Resort', 30, jsonb_build_object(
    'seedKey', 'official-brand-true-beach-resort',
    'title', 'True Beach Resort', 'slug', 'true-beach-resort-brand',
    'shortDescription', 'Our signature hospitality shines at Marsa Alam.',
    'fullDescription', 'Thoughtfully divided into a vibrant family-friendly resort and an exclusive adults-only village for ultimate serenity.',
    'facilities', jsonb_build_array('Family & Adults Zones', 'Premium Dining', 'Private Pools', 'Kitesurfing Hub'),
    'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/true-beach.jpg', 'alt', 'True Beach Resort', 'caption', '')),
    'icon', 'Palmtree', 'color', 'amber', 'displayOrder', 30, 'isActive', true
  )),
  ('kiwengwa-beach-resort-brand', 'Kiwengwa Beach Resort', 40, jsonb_build_object(
    'seedKey', 'official-brand-kiwengwa-beach-resort',
    'title', 'Kiwengwa Beach Resort', 'slug', 'kiwengwa-beach-resort-brand',
    'shortDescription', 'Flash Group standard of luxury in Zanzibar.',
    'fullDescription', 'Boasting over 200 modern African-style units, it offers a seamless blend of natural beauty and tropical premium comfort.',
    'facilities', jsonb_build_array('200+ Luxury Rooms', '4 Restaurants & 3 Bars', '3 Swimming Pools', 'Private Sandbanks'),
    'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/zanzibar-island.jpg', 'alt', 'Kiwengwa Beach Resort', 'caption', '')),
    'icon', 'Palmtree', 'color', 'amber', 'displayOrder', 40, 'isActive', true
  )),
  ('1920s-boutique-hotel-brand', '1920s Boutique Hotel', 50, jsonb_build_object(
    'seedKey', 'official-brand-1920s-boutique-hotel',
    'title', '1920s Boutique Hotel', 'slug', '1920s-boutique-hotel-brand',
    'shortDescription', 'Step back in time in the prestigious district of Heliopolis.',
    'fullDescription', 'A meticulously restored 100-year-old historic villa, offering a seamless blend of classic 1920s architecture and modern sophistication.',
    'facilities', jsonb_build_array('Restored 1920s Villa', 'Luxury Boutique Suites', 'Historic Garden Setting', 'VIP Concierge'),
    'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/1920s-hotel.jpg', 'alt', '1920s Boutique Hotel', 'caption', '')),
    'icon', 'Building', 'color', 'slate', 'displayOrder', 50, 'isActive', true
  )),
  ('rossini-fine-dining-brand', 'Rossini Fine Dining', 60, jsonb_build_object(
    'seedKey', 'official-brand-rossini-fine-dining',
    'title', 'Rossini Fine Dining', 'slug', 'rossini-fine-dining-brand',
    'shortDescription', 'A true landmark in Cairo''s fine dining scene since 1993.',
    'fullDescription', 'Proud bearer of the prestigious Chaine des Rotisseurs certification, Rossini offers authentic Italian and Mediterranean gastronomy.',
    'facilities', jsonb_build_array('Chaine des Rotisseurs', 'Italian Gastronomy', 'Premium Seafood', 'Elite Atmosphere'),
    'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/rossini.jpg', 'alt', 'Rossini Fine Dining', 'caption', '')),
    'icon', 'Building', 'color', 'emerald', 'displayOrder', 60, 'isActive', true
  ))
) as v(slug, title, sort_order, data)
where not exists (
  select 1 from public.content_entries existing
  where existing.content_type = 'brand' and existing.slug = v.slug
);

insert into public.content_revisions (resource_type, resource_id, version, snapshot, event)
select 'brand', e.id, 1, jsonb_build_object('seedKey', 'official_brand_seed_v1', 'content', e.published_data), 'published'
from public.content_entries e
where e.content_type = 'brand'
  and e.published_data ? 'seedKey'
  and e.published_data->>'seedKey' like 'official-brand-%'
  and not exists (
    select 1 from public.content_revisions r
    where r.resource_type = 'brand' and r.resource_id = e.id
      and r.snapshot->>'seedKey' = 'official_brand_seed_v1'
  );
