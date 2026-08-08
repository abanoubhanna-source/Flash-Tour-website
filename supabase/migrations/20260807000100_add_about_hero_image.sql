-- The About page's hero never had a photo (the dashboard's "Hero image"
-- field existed but was always empty), so the hero rendered as a bare dark
-- gradient. Per the site owner's request, seed it with the same Luxor
-- temple photo already used on the Home page hero — a real, already-live
-- asset that fits the page's "Since 1985" heritage framing. The site owner
-- can replace it from the dashboard at any time.

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
  and key = 'hero';
