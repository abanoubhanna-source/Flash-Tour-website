-- Enrich the About page's ceo_message/team/expansion_journey sections with
-- the fields the public /about page actually needs (director name/title/
-- signature, team stats, and full year+title+desc timeline milestones), so
-- /api/about can read real content from the CMS instead of the static
-- about.json fallback. All values are copied verbatim from that same
-- about.json — no fabricated content.
--
-- expansion_journey.milestones previously had 4 entries (1985/2011/2014/2024)
-- with only year/brand/country; about.json's timeline has a 5th 2026 entry
-- and real title/desc copy for all five, so the milestones array is fully
-- replaced here rather than merged.

update public.page_sections
set draft_data = draft_data || jsonb_build_object(
      'directorName', 'Amgad Hassoun',
      'directorTitle', 'Chairman',
      'signatureImageUrl', '/images/Signuter.png'
    ),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object(
      'directorName', 'Amgad Hassoun',
      'directorTitle', 'Chairman',
      'signatureImageUrl', '/images/Signuter.png'
    )
where page_id = (select id from public.pages where key = 'about')
  and key = 'ceo_message';

update public.page_sections
set draft_data = draft_data || jsonb_build_object('stats', '5,000+'),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('stats', '5,000+')
where page_id = (select id from public.pages where key = 'about')
  and key = 'team';

update public.page_sections
set draft_data = draft_data || jsonb_build_object(
      'milestones', '[
        {"year":1985,"brand":"Flash Tour","country":"Egypt","title":"THE FOUNDATION","desc":"Flash Tour was established in Cairo, Egypt. What started as an ambitious inbound travel agency rapidly set the foundation for redefining regional tourism standards through uncompromised dedication to quality and client satisfaction."},
        {"year":2011,"brand":"Flash Zanzibar","country":"Zanzibar","title":"EXPANSION TO ZANZIBAR","desc":"Flash Zanzibar launched in Tanzania, quickly establishing itself as one of the leading Destination Management Companies in the archipelago and marking our first step beyond Egypt''s borders."},
        {"year":2014,"brand":"Flash Horizon","country":"United Arab Emirates","title":"GROWTH IN THE UAE","desc":"Flash Horizon launched in the United Arab Emirates, bringing the group''s heritage of quality service to one of the region''s most dynamic markets through destination management, MICE, and tailor-made travel experiences."},
        {"year":2024,"brand":"Flash Horizon Morocco","country":"Morocco","title":"GROWTH INTO NORTH AFRICA","desc":"Flash Horizon Morocco was established, extending the group''s presence into North Africa and strengthening our ability to offer diverse cultural, leisure, and business travel experiences."},
        {"year":2026,"brand":"Flash Group","country":"Global","title":"GLOBAL LEADERSHIP","desc":"Celebrating over 40 years of unparalleled expertise. Today, Flash Group operates across multiple continents as a premier Destination Management Company, offering elite MICE solutions, exclusive hospitality, and a massive global network."}
      ]'::jsonb
    ),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object(
      'milestones', '[
        {"year":1985,"brand":"Flash Tour","country":"Egypt","title":"THE FOUNDATION","desc":"Flash Tour was established in Cairo, Egypt. What started as an ambitious inbound travel agency rapidly set the foundation for redefining regional tourism standards through uncompromised dedication to quality and client satisfaction."},
        {"year":2011,"brand":"Flash Zanzibar","country":"Zanzibar","title":"EXPANSION TO ZANZIBAR","desc":"Flash Zanzibar launched in Tanzania, quickly establishing itself as one of the leading Destination Management Companies in the archipelago and marking our first step beyond Egypt''s borders."},
        {"year":2014,"brand":"Flash Horizon","country":"United Arab Emirates","title":"GROWTH IN THE UAE","desc":"Flash Horizon launched in the United Arab Emirates, bringing the group''s heritage of quality service to one of the region''s most dynamic markets through destination management, MICE, and tailor-made travel experiences."},
        {"year":2024,"brand":"Flash Horizon Morocco","country":"Morocco","title":"GROWTH INTO NORTH AFRICA","desc":"Flash Horizon Morocco was established, extending the group''s presence into North Africa and strengthening our ability to offer diverse cultural, leisure, and business travel experiences."},
        {"year":2026,"brand":"Flash Group","country":"Global","title":"GLOBAL LEADERSHIP","desc":"Celebrating over 40 years of unparalleled expertise. Today, Flash Group operates across multiple continents as a premier Destination Management Company, offering elite MICE solutions, exclusive hospitality, and a massive global network."}
      ]'::jsonb
    )
where page_id = (select id from public.pages where key = 'about')
  and key = 'expansion_journey';
