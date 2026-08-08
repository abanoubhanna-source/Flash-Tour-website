-- Correction to 20260807000100_add_about_hero_image.sql: that migration
-- targeted page_sections.key = 'hero', but the About page stores its hero
-- under the section key 'hero_intro' (About uses its own specialized
-- section system, not the generic Pages hero), so it silently matched zero
-- rows. Also, about/page.tsx was reading this image via the generic
-- getPublishedPageContent('/about') helper, which looks up the same
-- nonexistent 'hero' key and returns null for the whole page (hero AND
-- seo) — meaning About's dashboard SEO fields were silently never applied
-- either. Both are now fixed in the app code (about/page.tsx uses
-- getPublishedAboutContent(), and aboutHeroIntroSchema gained an `image`
-- field); this seeds that field on the correct 'hero_intro' key.

update public.page_sections
set draft_data = jsonb_set(
      draft_data,
      '{image}',
      '{"assetId": null, "url": "/images/egypt-bg.jpg", "alt": "Luxor Temple, Egypt"}'::jsonb
    ),
    published_data = jsonb_set(
      coalesce(published_data, draft_data),
      '{image}',
      '{"assetId": null, "url": "/images/egypt-bg.jpg", "alt": "Luxor Temple, Egypt"}'::jsonb
    )
where page_id = (select id from public.pages where key = 'about')
  and key = 'hero_intro';
