-- Morocco had no hero photo on the destination-portfolio listing or its own
-- country page, showing a bare navy fallback in both spots. Per the site
-- owner's explicit request, set a temporary Wikimedia Commons (CC-licensed)
-- photo of the Koutoubia Mosque as a stand-in until real Flash Group
-- photography is uploaded via the dashboard Media Library. See
-- public/images/destinations/morocco/CREDITS.md for attribution.
update public.content_entries
set draft_data = jsonb_set(
      draft_data,
      '{hero,image}',
      '{"assetId": null, "url": "/images/destinations/morocco/hero-koutoubia-mosque.jpg", "alt": "Koutoubia Mosque, Marrakech, Morocco"}'::jsonb
    ),
    published_data = jsonb_set(
      coalesce(published_data, draft_data),
      '{hero,image}',
      '{"assetId": null, "url": "/images/destinations/morocco/hero-koutoubia-mosque.jpg", "alt": "Koutoubia Mosque, Marrakech, Morocco"}'::jsonb
    )
where content_type = 'destination'
  and slug = 'morocco'
  and coalesce(draft_data #>> '{hero,image,url}', '') = '';
