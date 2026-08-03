-- Two cleanups to the About page's CMS sections, per the site owner's review:
--
-- 1. "The Flawless Process" (Visa Processing / Hotel Booking / Airport Meet &
--    Transfer / VIP Transfer / Guided Excursions / Safe Journey Home) was
--    fully hardcoded in the frontend with no dashboard control at all. Insert
--    a new page_sections row for it (draft_data and published_data) with the
--    real copy already live on the page — this key didn't exist before, so
--    it needs an insert rather than an update.
--
-- 2. expansion_journey's top-level title/subtitle/body fields were never
--    read by the frontend (only its milestones array is) and the site owner
--    doesn't want them cluttering the editor. Strip them down to just the
--    milestones the page actually uses.

insert into public.page_sections (page_id, key, component_key, sort_order, enabled, draft_data, published_data)
select
  p.id,
  'flawless_process',
  'about_list',
  1105,
  true,
  '{"title": "The Flawless Process", "items": ["Visa Processing", "Hotel Booking", "Airport Meet & Transfer", "VIP Transfer", "Guided Excursions", "Safe Journey Home"]}'::jsonb,
  '{"title": "The Flawless Process", "items": ["Visa Processing", "Hotel Booking", "Airport Meet & Transfer", "VIP Transfer", "Guided Excursions", "Safe Journey Home"]}'::jsonb
from public.pages p
where p.key = 'about'
on conflict (page_id, key) do nothing;

update public.page_sections
set draft_data = draft_data - 'title' - 'subtitle' - 'body',
    published_data = case when published_data is not null then published_data - 'title' - 'subtitle' - 'body' else published_data end
where page_id = (select id from public.pages where key = 'about')
  and key = 'expansion_journey';
