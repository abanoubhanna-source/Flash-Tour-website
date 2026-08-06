-- Per the site owner's review: the "Our Services" / "Languages" cards on
-- the About page duplicated content already covered by the dedicated
-- /services page, so the section is dropped entirely (schema, editor UI,
-- and page render already removed in the app code). The public page order
-- also moves "The Evolution" (company timeline) up to right after Vision &
-- Mission, ahead of Flawless Process/Experience/Work Process, so the page
-- reads chronologically (who we are -> our history -> what we do now)
-- instead of history being sandwiched in the middle.

delete from public.page_sections
where page_id = (select id from public.pages where key = 'about')
  and key in ('services_summary', 'languages');
