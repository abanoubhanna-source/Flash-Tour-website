-- The About page's H1 ("We Show You The Way Since 1985") was near-identical
-- to the Home page's H1 ("We Show The Way from 1985"), which weakens SEO
-- differentiation between the two pages. Swap in a distinct phrase for
-- About that keeps the same word count and ends on "1985" (the word the
-- template highlights in gold), so the visual shape is unchanged.

update page_sections
set draft_data = jsonb_set(draft_data, '{title}', '"Our Story Begins In 1985"')
where key = 'hero_intro'
  and page_id = (select id from pages where path = '/about')
  and draft_data->>'title' = 'We Show You The Way Since 1985';

update page_sections
set published_data = jsonb_set(published_data, '{title}', '"Our Story Begins In 1985"')
where key = 'hero_intro'
  and page_id = (select id from pages where path = '/about')
  and published_data->>'title' = 'We Show You The Way Since 1985';
