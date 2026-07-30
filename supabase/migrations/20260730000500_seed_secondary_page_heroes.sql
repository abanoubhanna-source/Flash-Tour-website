-- Extend the Pages CMS module beyond Home/About: give Services, Destinations,
-- Hospitality, Contact, and Partner Portal their own editable hero section,
-- seeded with today's hardcoded copy so the public site's appearance is
-- unchanged until an editor deliberately changes something (same pattern as
-- 20260724000100_pages_module_seed.sql for Home).
--
-- Uses gen_random_uuid() for every id (not hand-crafted ids like the original
-- Home seed) to avoid repeating the invalid-UUID bug fixed in
-- 20260725000600_fix_pages_seed_uuids.sql — z.uuid() on the dashboard side
-- requires real RFC-4122 version/variant nibbles.

do $$
declare
  new_page_id uuid;
begin
  if not exists (select 1 from public.pages where key = 'services') then
    insert into public.pages (id, key, path, name, template_key, locale, enabled)
    values (gen_random_uuid(), 'services', '/services', 'Services', 'services', 'en', true)
    returning id into new_page_id;

    insert into public.page_sections (id, page_id, key, component_key, sort_order, enabled, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'hero', 'services_hero', 0, true,
      '{"eyebrow":"Global Portfolio","title":"Our","accentTitle":"Expertise.","subtitle":"From exclusive leisure travel to flawless corporate event management, Flash Group delivers uncompromised quality across every touchpoint of your journey.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"","alt":""}}'::jsonb,
      '{"eyebrow":"Global Portfolio","title":"Our","accentTitle":"Expertise.","subtitle":"From exclusive leisure travel to flawless corporate event management, Flash Group delivers uncompromised quality across every touchpoint of your journey.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"","alt":""}}'::jsonb,
      now());

    insert into public.seo_entries (id, page_id, locale, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'en',
      '{"title":"Our Services | Flash Group","description":"From exclusive leisure travel to flawless corporate event management, Flash Group delivers uncompromised quality.","canonicalPath":"/services","ogImage":""}'::jsonb,
      '{"title":"Our Services | Flash Group","description":"From exclusive leisure travel to flawless corporate event management, Flash Group delivers uncompromised quality.","canonicalPath":"/services","ogImage":""}'::jsonb,
      now());
  end if;

  if not exists (select 1 from public.pages where key = 'destinations') then
    insert into public.pages (id, key, path, name, template_key, locale, enabled)
    values (gen_random_uuid(), 'destinations', '/destinations', 'Destinations', 'destinations', 'en', true)
    returning id into new_page_id;

    insert into public.page_sections (id, page_id, key, component_key, sort_order, enabled, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'hero', 'destinations_hero', 0, true,
      '{"eyebrow":"Global Reach","title":"Explore Our","accentTitle":"World","subtitle":"Five distinct regions. Infinite possibilities. Discover the destinations where Flash Group brings luxury to life.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/map.png","alt":"Global Destinations"}}'::jsonb,
      '{"eyebrow":"Global Reach","title":"Explore Our","accentTitle":"World","subtitle":"Five distinct regions. Infinite possibilities. Discover the destinations where Flash Group brings luxury to life.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/map.png","alt":"Global Destinations"}}'::jsonb,
      now());

    insert into public.seo_entries (id, page_id, locale, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'en',
      '{"title":"Destinations | Flash Group","description":"Five distinct regions. Infinite possibilities. Discover the destinations where Flash Group brings luxury to life.","canonicalPath":"/destinations","ogImage":"/images/map.png"}'::jsonb,
      '{"title":"Destinations | Flash Group","description":"Five distinct regions. Infinite possibilities. Discover the destinations where Flash Group brings luxury to life.","canonicalPath":"/destinations","ogImage":"/images/map.png"}'::jsonb,
      now());
  end if;

  if not exists (select 1 from public.pages where key = 'hospitality') then
    insert into public.pages (id, key, path, name, template_key, locale, enabled)
    values (gen_random_uuid(), 'hospitality', '/hospitality', 'Hospitality', 'hospitality', 'en', true)
    returning id into new_page_id;

    insert into public.page_sections (id, page_id, key, component_key, sort_order, enabled, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'hero', 'hospitality_hero', 0, true,
      '{"eyebrow":"Hospitality Without Borders","title":"Everywhere You Seek","accentTitle":"Excellence.","subtitle":"Our hospitality is a different breed. We are not just a service provider; we are the destination. From the majestic Nile and the vibrant Red Sea to the exotic Indian Ocean and historic European coastlines—wherever luxury is demanded, we are there.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/hospitality-hero.jpg","alt":"Flash Group Portfolio"}}'::jsonb,
      '{"eyebrow":"Hospitality Without Borders","title":"Everywhere You Seek","accentTitle":"Excellence.","subtitle":"Our hospitality is a different breed. We are not just a service provider; we are the destination. From the majestic Nile and the vibrant Red Sea to the exotic Indian Ocean and historic European coastlines—wherever luxury is demanded, we are there.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/hospitality-hero.jpg","alt":"Flash Group Portfolio"}}'::jsonb,
      now());

    insert into public.seo_entries (id, page_id, locale, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'en',
      '{"title":"Hospitality | Flash Group","description":"Our hospitality is a different breed. We are not just a service provider; we are the destination.","canonicalPath":"/hospitality","ogImage":"/images/hospitality-hero.jpg"}'::jsonb,
      '{"title":"Hospitality | Flash Group","description":"Our hospitality is a different breed. We are not just a service provider; we are the destination.","canonicalPath":"/hospitality","ogImage":"/images/hospitality-hero.jpg"}'::jsonb,
      now());
  end if;

  if not exists (select 1 from public.pages where key = 'contact') then
    insert into public.pages (id, key, path, name, template_key, locale, enabled)
    values (gen_random_uuid(), 'contact', '/contact', 'Contact', 'contact', 'en', true)
    returning id into new_page_id;

    insert into public.page_sections (id, page_id, key, component_key, sort_order, enabled, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'hero', 'contact_hero', 0, true,
      '{"eyebrow":"Global Presence","title":"Partner With","accentTitle":"Flash Group","subtitle":"For tour operators, corporate entities, event planners, and hospitality partners seeking direct access to Flash Group infrastructure.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/office-1.jpg","alt":"Flash Group Headquarters"}}'::jsonb,
      '{"eyebrow":"Global Presence","title":"Partner With","accentTitle":"Flash Group","subtitle":"For tour operators, corporate entities, event planners, and hospitality partners seeking direct access to Flash Group infrastructure.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/office-1.jpg","alt":"Flash Group Headquarters"}}'::jsonb,
      now());

    insert into public.seo_entries (id, page_id, locale, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'en',
      '{"title":"Contact | Flash Group","description":"For tour operators, corporate entities, event planners, and hospitality partners seeking direct access to Flash Group infrastructure.","canonicalPath":"/contact","ogImage":"/images/office-1.jpg"}'::jsonb,
      '{"title":"Contact | Flash Group","description":"For tour operators, corporate entities, event planners, and hospitality partners seeking direct access to Flash Group infrastructure.","canonicalPath":"/contact","ogImage":"/images/office-1.jpg"}'::jsonb,
      now());
  end if;

  if not exists (select 1 from public.pages where key = 'partner_portal') then
    insert into public.pages (id, key, path, name, template_key, locale, enabled)
    values (gen_random_uuid(), 'partner_portal', '/partner-portal', 'Partner Portal', 'partner_portal', 'en', true)
    returning id into new_page_id;

    insert into public.page_sections (id, page_id, key, component_key, sort_order, enabled, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'hero', 'partner_portal_hero', 0, true,
      '{"eyebrow":"Global B2B Network","title":"Partner With","accentTitle":"The Empire","subtitle":"Join an elite network of global travel agencies and corporate event organizers. Gain direct access to our contracted rates, owned assets, and unparalleled DMC expertise.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"","alt":""}}'::jsonb,
      '{"eyebrow":"Global B2B Network","title":"Partner With","accentTitle":"The Empire","subtitle":"Join an elite network of global travel agencies and corporate event organizers. Gain direct access to our contracted rates, owned assets, and unparalleled DMC expertise.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"","alt":""}}'::jsonb,
      now());

    insert into public.seo_entries (id, page_id, locale, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'en',
      '{"title":"Partner Portal | Flash Group","description":"Join an elite network of global travel agencies and corporate event organizers.","canonicalPath":"/partner-portal","ogImage":""}'::jsonb,
      '{"title":"Partner Portal | Flash Group","description":"Join an elite network of global travel agencies and corporate event organizers.","canonicalPath":"/partner-portal","ogImage":""}'::jsonb,
      now());
  end if;
end $$;
