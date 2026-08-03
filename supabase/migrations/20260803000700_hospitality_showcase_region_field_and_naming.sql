-- Two small cleanups to the Hospitality list, per the site owner's review:
--
-- 1. The list shows "slug · country · region", falling back to "Unspecified"
--    when region is blank. Several entries (mostly the Nile-cruise-derived
--    ones, plus the batch just seeded for the region showcase pages) never
--    had a region set, so they all showed "Unspecified" — set it to the
--    same real area already used by sibling entries on the same page
--    (e.g. true-beach-resort already says region "Marsa Alam").
--
-- 2. carlo-heliopolis and hotel-club-eloro were titled "Carlo Heliopolis"
--    and "Hotel Club Eloro" in the dashboard, while every page and the
--    site owner's own copy calls them "Carlo's Restaurant" and "Hotel
--    Eloro" — same real places, just an inconsistent title. Align the
--    title column and the JSON title/name fields.

update public.content_entries
set draft_data = draft_data || jsonb_build_object('region', region_value, 'country', coalesce(nullif(draft_data->>'country', ''), country_value)),
    published_data = case when published_data is not null then published_data || jsonb_build_object('region', region_value, 'country', coalesce(nullif(published_data->>'country', ''), country_value)) else published_data end
from (values
  ('exquisite-private-beaches', 'Marsa Alam', 'Egypt'),
  ('world-class-spa-kitesurfing-hub', 'Marsa Alam', 'Egypt'),
  ('exclusive-white-sand-beaches', 'Zanzibar', 'Tanzania'),
  ('premium-safari-integrations', 'Zanzibar', 'Tanzania'),
  ('tropical-corporate-retreats', 'Zanzibar', 'Tanzania'),
  ('personalized-vip-concierge', 'Cairo', 'Egypt'),
  ('nile-serenity', 'Luxor and Aswan', 'Egypt'),
  ('nile-excellence', 'Luxor and Aswan', 'Egypt'),
  ('lady-carol', 'Luxor and Aswan', 'Egypt'),
  ('lady-mary', 'Luxor and Aswan', 'Egypt'),
  ('magic-i', 'Luxor and Aswan', 'Egypt'),
  ('magic-ii', 'Luxor and Aswan', 'Egypt'),
  ('nile-divine', 'Luxor and Aswan', 'Egypt')
) as regions(slug, region_value, country_value)
where content_entries.content_type = 'hospitality'
  and content_entries.slug = regions.slug
  and coalesce(content_entries.draft_data->>'region', '') = '';

update public.content_entries
set title = 'Carlo''s Restaurant',
    draft_data = draft_data || '{"title": "Carlo''s Restaurant", "name": "Carlo''s Restaurant"}'::jsonb,
    published_data = case when published_data is not null then published_data || '{"title": "Carlo''s Restaurant", "name": "Carlo''s Restaurant"}'::jsonb else published_data end
where content_type = 'hospitality' and slug = 'carlo-heliopolis';

update public.content_entries
set title = 'Hotel Eloro',
    draft_data = draft_data || '{"title": "Hotel Eloro", "name": "Hotel Eloro"}'::jsonb,
    published_data = case when published_data is not null then published_data || '{"title": "Hotel Eloro", "name": "Hotel Eloro"}'::jsonb else published_data end
where content_type = 'hospitality' and slug = 'hotel-club-eloro';
