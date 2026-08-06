-- The About page dashboard's "Team" section has always had Title and Body
-- fields, but /api/about never mapped them and the public page hardcoded
-- both strings directly in JSX ("The Team Behind The Empire" + the
-- "With more than {stats} dedicated experts..." paragraph) — so editing
-- those two dashboard fields silently did nothing. Seed them here with the
-- exact copy that was already hardcoded on the page (no fabricated content)
-- now that the page/API have been wired to actually read them.

update public.page_sections
set draft_data = draft_data || jsonb_build_object(
      'title', 'The Team Behind The Empire',
      'body', 'With more than 5,000+ dedicated experts and consultants across four continents, our workforce is our greatest asset. Our bilingual teams speak Arabic, English, German, French, Russian, Italian, and Dutch, ensuring every guest feels understood. From the captains of our Nile cruises to the concierges at our 5-star resorts, every member of the Flash family is committed to delivering perfection.'
    ),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object(
      'title', 'The Team Behind The Empire',
      'body', 'With more than 5,000+ dedicated experts and consultants across four continents, our workforce is our greatest asset. Our bilingual teams speak Arabic, English, German, French, Russian, Italian, and Dutch, ensuring every guest feels understood. From the captains of our Nile cruises to the concierges at our 5-star resorts, every member of the Flash family is committed to delivering perfection.'
    )
where page_id = (select id from public.pages where key = 'about')
  and key = 'team';
