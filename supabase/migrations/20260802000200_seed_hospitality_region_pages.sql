-- Give each of the 5 Hospitality deep-dive pages (Nile Cruises, Coastal
-- Sanctuaries, Tropical Retreats, European Elegance, Urban Centers) their own
-- Pages-module entry, same pattern as 20260730000500_seed_secondary_page_heroes.sql.
-- Seeded with the real hero/intro/CTA copy that was hardcoded on each page, so
-- the redesigned template renders the same real content from day one.
--
-- introHeading/introBody/ctaHeading/ctaBody were added to pageHeroSchema
-- alongside the existing eyebrow/title/accentTitle/subtitle/image fields —
-- both live in the same "hero" page_section draft_data/published_data blob.

do $$
declare
  new_page_id uuid;
begin
  if not exists (select 1 from public.pages where key = 'hospitality_nile_cruises') then
    insert into public.pages (id, key, path, name, template_key, locale, enabled)
    values (gen_random_uuid(), 'hospitality_nile_cruises', '/hospitality/nile-cruises', 'Hospitality — Nile Cruises', 'hospitality_region', 'en', true)
    returning id into new_page_id;

    insert into public.page_sections (id, page_id, key, component_key, sort_order, enabled, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'hero', 'hospitality_region_hero', 0, true,
      '{"eyebrow":"100% Exclusively Owned Fleet","title":"The River","accentTitle":"Masters","subtitle":"Commanding the ancient waters of the Nile with absolute prestige, uncompromised luxury, and legendary hospitality.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/cruise-1.jpg","alt":"The Royal Nile Fleet"},"introHeading":"A Legacy Forged on the World''s Most Historic River","introBody":"We do not just broker river cruises; we own and operate a majestic fleet of floating palaces. From intimate boutique vessels to our ultra-luxury flagship, every ship in the Flash Group portfolio guarantees your VIP clients an unforgettable journey through Egypt''s timeless wonders.","ctaHeading":"Command The Current.","ctaBody":"Ready to secure the ultimate floating luxury for your elite clients? Partner directly with the source."}'::jsonb,
      '{"eyebrow":"100% Exclusively Owned Fleet","title":"The River","accentTitle":"Masters","subtitle":"Commanding the ancient waters of the Nile with absolute prestige, uncompromised luxury, and legendary hospitality.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/cruise-1.jpg","alt":"The Royal Nile Fleet"},"introHeading":"A Legacy Forged on the World''s Most Historic River","introBody":"We do not just broker river cruises; we own and operate a majestic fleet of floating palaces. From intimate boutique vessels to our ultra-luxury flagship, every ship in the Flash Group portfolio guarantees your VIP clients an unforgettable journey through Egypt''s timeless wonders.","ctaHeading":"Command The Current.","ctaBody":"Ready to secure the ultimate floating luxury for your elite clients? Partner directly with the source."}'::jsonb,
      now());

    insert into public.seo_entries (id, page_id, locale, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'en',
      '{"title":"Nile Cruises | Flash Group Hospitality","description":"Commanding the ancient waters of the Nile with absolute prestige, uncompromised luxury, and legendary hospitality.","canonicalPath":"/hospitality/nile-cruises","ogImage":"/images/cruise-1.jpg"}'::jsonb,
      '{"title":"Nile Cruises | Flash Group Hospitality","description":"Commanding the ancient waters of the Nile with absolute prestige, uncompromised luxury, and legendary hospitality.","canonicalPath":"/hospitality/nile-cruises","ogImage":"/images/cruise-1.jpg"}'::jsonb,
      now());
  end if;

  if not exists (select 1 from public.pages where key = 'hospitality_coastal_sanctuaries') then
    insert into public.pages (id, key, path, name, template_key, locale, enabled)
    values (gen_random_uuid(), 'hospitality_coastal_sanctuaries', '/hospitality/coastal-sanctuaries', 'Hospitality — Coastal Sanctuaries', 'hospitality_region', 'en', true)
    returning id into new_page_id;

    insert into public.page_sections (id, page_id, key, component_key, sort_order, enabled, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'hero', 'hospitality_region_hero', 0, true,
      '{"eyebrow":"Mastering the Land and Sea","title":"Coastal","accentTitle":"Sanctuaries","subtitle":"From the golden sands to the deep blue. Experience our signature hospitality dominating the coastline.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/true-beach.jpg","alt":"Coastal Sanctuaries"},"introHeading":"A Symphony of Sand and Sea","introBody":"You will find our signature hospitality at the 5-Star True Beach Resort in Marsa Alam, perfectly complemented by our private motorboats and diving yachts. Whether you seek thrilling marine adventures or secluded beachfront tranquility, our coastal properties deliver an uncompromised standard of luxury.","ctaHeading":"Partner With The Best.","ctaBody":"Secure the ultimate coastal luxury for your elite clients. Connect with our corporate relations team today."}'::jsonb,
      '{"eyebrow":"Mastering the Land and Sea","title":"Coastal","accentTitle":"Sanctuaries","subtitle":"From the golden sands to the deep blue. Experience our signature hospitality dominating the coastline.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/true-beach.jpg","alt":"Coastal Sanctuaries"},"introHeading":"A Symphony of Sand and Sea","introBody":"You will find our signature hospitality at the 5-Star True Beach Resort in Marsa Alam, perfectly complemented by our private motorboats and diving yachts. Whether you seek thrilling marine adventures or secluded beachfront tranquility, our coastal properties deliver an uncompromised standard of luxury.","ctaHeading":"Partner With The Best.","ctaBody":"Secure the ultimate coastal luxury for your elite clients. Connect with our corporate relations team today."}'::jsonb,
      now());

    insert into public.seo_entries (id, page_id, locale, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'en',
      '{"title":"Coastal Sanctuaries | Flash Group Hospitality","description":"From the golden sands to the deep blue. Experience our signature hospitality dominating the coastline.","canonicalPath":"/hospitality/coastal-sanctuaries","ogImage":"/images/true-beach.jpg"}'::jsonb,
      '{"title":"Coastal Sanctuaries | Flash Group Hospitality","description":"From the golden sands to the deep blue. Experience our signature hospitality dominating the coastline.","canonicalPath":"/hospitality/coastal-sanctuaries","ogImage":"/images/true-beach.jpg"}'::jsonb,
      now());
  end if;

  if not exists (select 1 from public.pages where key = 'hospitality_tropical_retreats') then
    insert into public.pages (id, key, path, name, template_key, locale, enabled)
    values (gen_random_uuid(), 'hospitality_tropical_retreats', '/hospitality/tropical-retreats', 'Hospitality — Tropical Retreats', 'hospitality_region', 'en', true)
    returning id into new_page_id;

    insert into public.page_sections (id, page_id, key, component_key, sort_order, enabled, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'hero', 'hospitality_region_hero', 0, true,
      '{"eyebrow":"The Exotic Shores of Tanzania","title":"Tropical","accentTitle":"Retreats","subtitle":"Zanzibar''s Premium Estates. We deliver the Flash Group standard of luxury wrapped in a breathtaking tropical environment.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/zanzibar-main.jpg","alt":"Tropical Retreats"},"introHeading":"A Symphony of Wildlife and Luxury","introBody":"Our footprint extends to the exotic shores of Tanzania. At our fully-owned Kiwengwa Beach Resort, we provide an unparalleled gateway to Zanzibar''s white sand beaches and East Africa''s majestic Savannas, perfectly suited for elite leisure and corporate incentive groups.","ctaHeading":"Partner With The Best.","ctaBody":"Secure the ultimate tropical escapes for your elite clients. Connect with our corporate relations team today."}'::jsonb,
      '{"eyebrow":"The Exotic Shores of Tanzania","title":"Tropical","accentTitle":"Retreats","subtitle":"Zanzibar''s Premium Estates. We deliver the Flash Group standard of luxury wrapped in a breathtaking tropical environment.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/zanzibar-main.jpg","alt":"Tropical Retreats"},"introHeading":"A Symphony of Wildlife and Luxury","introBody":"Our footprint extends to the exotic shores of Tanzania. At our fully-owned Kiwengwa Beach Resort, we provide an unparalleled gateway to Zanzibar''s white sand beaches and East Africa''s majestic Savannas, perfectly suited for elite leisure and corporate incentive groups.","ctaHeading":"Partner With The Best.","ctaBody":"Secure the ultimate tropical escapes for your elite clients. Connect with our corporate relations team today."}'::jsonb,
      now());

    insert into public.seo_entries (id, page_id, locale, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'en',
      '{"title":"Tropical Retreats | Flash Group Hospitality","description":"Zanzibar''s Premium Estates. We deliver the Flash Group standard of luxury wrapped in a breathtaking tropical environment.","canonicalPath":"/hospitality/tropical-retreats","ogImage":"/images/zanzibar-main.jpg"}'::jsonb,
      '{"title":"Tropical Retreats | Flash Group Hospitality","description":"Zanzibar''s Premium Estates. We deliver the Flash Group standard of luxury wrapped in a breathtaking tropical environment.","canonicalPath":"/hospitality/tropical-retreats","ogImage":"/images/zanzibar-main.jpg"}'::jsonb,
      now());
  end if;

  if not exists (select 1 from public.pages where key = 'hospitality_european_elegance') then
    insert into public.pages (id, key, path, name, template_key, locale, enabled)
    values (gen_random_uuid(), 'hospitality_european_elegance', '/hospitality/european-elegance', 'Hospitality — European Elegance', 'hospitality_region', 'en', true)
    returning id into new_page_id;

    insert into public.page_sections (id, page_id, key, component_key, sort_order, enabled, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'hero', 'hospitality_region_hero', 0, true,
      '{"eyebrow":"The Mediterranean","title":"European","accentTitle":"Elegance","subtitle":"The Italian Collection. A strategic, commanding presence in Europe''s most elite destinations.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/italy-hero.jpg","alt":"European Elegance"},"introHeading":"Hospitality That Knows No Borders","introBody":"Our curated collection of exclusive properties across Sardinia and Sicily proves our commitment to global excellence. We deliver the signature Flash Group luxury experience, perfectly tailored to the sophistication and charm of the Italian Mediterranean.","ctaHeading":"Partner With The Best.","ctaBody":"Secure the ultimate Mediterranean escapes for your elite clients. Connect with our corporate relations team today."}'::jsonb,
      '{"eyebrow":"The Mediterranean","title":"European","accentTitle":"Elegance","subtitle":"The Italian Collection. A strategic, commanding presence in Europe''s most elite destinations.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/italy-hero.jpg","alt":"European Elegance"},"introHeading":"Hospitality That Knows No Borders","introBody":"Our curated collection of exclusive properties across Sardinia and Sicily proves our commitment to global excellence. We deliver the signature Flash Group luxury experience, perfectly tailored to the sophistication and charm of the Italian Mediterranean.","ctaHeading":"Partner With The Best.","ctaBody":"Secure the ultimate Mediterranean escapes for your elite clients. Connect with our corporate relations team today."}'::jsonb,
      now());

    insert into public.seo_entries (id, page_id, locale, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'en',
      '{"title":"European Elegance | Flash Group Hospitality","description":"The Italian Collection. A strategic, commanding presence in Europe''s most elite destinations.","canonicalPath":"/hospitality/european-elegance","ogImage":"/images/italy-hero.jpg"}'::jsonb,
      '{"title":"European Elegance | Flash Group Hospitality","description":"The Italian Collection. A strategic, commanding presence in Europe''s most elite destinations.","canonicalPath":"/hospitality/european-elegance","ogImage":"/images/italy-hero.jpg"}'::jsonb,
      now());
  end if;

  if not exists (select 1 from public.pages where key = 'hospitality_urban_centers') then
    insert into public.pages (id, key, path, name, template_key, locale, enabled)
    values (gen_random_uuid(), 'hospitality_urban_centers', '/hospitality/urban-centers', 'Hospitality — Urban Centers', 'hospitality_region', 'en', true)
    returning id into new_page_id;

    insert into public.page_sections (id, page_id, key, component_key, sort_order, enabled, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'hero', 'hospitality_region_hero', 0, true,
      '{"eyebrow":"A Century of Elegance in Cairo","title":"Urban","accentTitle":"Centers","subtitle":"Heritage & Fine Dining. In the heart of the city, our hospitality takes a profound cultural form.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/1920s-hotel.jpg","alt":"Urban Centers"},"introHeading":"Preserving History, Elevating Taste","introBody":"We preserve history through meticulously restored 100-year-old boutique villas and elevate the culinary scene with our award-winning dining lounges. Discover a sophisticated urban retreat designed for travelers who appreciate heritage, art, and world-class gastronomy.","ctaHeading":"Partner With Heritage.","ctaBody":"Offer your elite clients an unforgettable journey through history and culinary mastery. Connect with our corporate relations team today."}'::jsonb,
      '{"eyebrow":"A Century of Elegance in Cairo","title":"Urban","accentTitle":"Centers","subtitle":"Heritage & Fine Dining. In the heart of the city, our hospitality takes a profound cultural form.","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/1920s-hotel.jpg","alt":"Urban Centers"},"introHeading":"Preserving History, Elevating Taste","introBody":"We preserve history through meticulously restored 100-year-old boutique villas and elevate the culinary scene with our award-winning dining lounges. Discover a sophisticated urban retreat designed for travelers who appreciate heritage, art, and world-class gastronomy.","ctaHeading":"Partner With Heritage.","ctaBody":"Offer your elite clients an unforgettable journey through history and culinary mastery. Connect with our corporate relations team today."}'::jsonb,
      now());

    insert into public.seo_entries (id, page_id, locale, draft_data, published_data, published_at)
    values (gen_random_uuid(), new_page_id, 'en',
      '{"title":"Urban Centers | Flash Group Hospitality","description":"Heritage & Fine Dining. In the heart of the city, our hospitality takes a profound cultural form.","canonicalPath":"/hospitality/urban-centers","ogImage":"/images/1920s-hotel.jpg"}'::jsonb,
      '{"title":"Urban Centers | Flash Group Hospitality","description":"Heritage & Fine Dining. In the heart of the city, our hospitality takes a profound cultural form.","canonicalPath":"/hospitality/urban-centers","ogImage":"/images/1920s-hotel.jpg"}'::jsonb,
      now());
  end if;
end $$;
