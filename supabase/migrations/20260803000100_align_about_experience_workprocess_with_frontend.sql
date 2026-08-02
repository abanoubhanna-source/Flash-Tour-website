-- The About page's "experience" and "work_process" CMS sections held stale
-- generic seed copy that no longer matched what the live page actually
-- shows (the page hardcoded its own different title/body/bullets instead of
-- reading these sections at all). Now that the frontend reads from these
-- sections, replace their content with the real copy already published on
-- the live page (copied verbatim, not fabricated) and add the bullet lists
-- the page displays alongside each paragraph.

update public.page_sections
set draft_data = draft_data || jsonb_build_object(
      'title', 'We Don''t Just Plan Trips. We Own The Experience.',
      'body', 'What sets Flash Group apart is our massive infrastructure. We own and operate our fleet, our cruises, and our hotels. This absolute control over the supply chain guarantees uncompromised 5-star quality at every touchpoint.',
      'bullets', '["Luxury Nile Cruises", "5-Star Resorts & Hotels", "100+ VIP Fleet", "Award-Winning Dining"]'::jsonb
    ),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object(
      'title', 'We Don''t Just Plan Trips. We Own The Experience.',
      'body', 'What sets Flash Group apart is our massive infrastructure. We own and operate our fleet, our cruises, and our hotels. This absolute control over the supply chain guarantees uncompromised 5-star quality at every touchpoint.',
      'bullets', '["Luxury Nile Cruises", "5-Star Resorts & Hotels", "100+ VIP Fleet", "Award-Winning Dining"]'::jsonb
    )
where page_id = (select id from public.pages where key = 'about')
  and key = 'experience';

update public.page_sections
set draft_data = draft_data || jsonb_build_object(
      'title', 'Operational Command Centers',
      'body', 'To guarantee uncompromised quality, we do not rely on third-party agencies. Flash Group establishes its own physical strongholds in key international markets. From our nerve centers in the Middle East to our tropical outposts, these hubs ensure flawless 24/7 logistical execution.',
      'bullets', '[
        {"title":"Localized Excellence","desc":"Direct oversight of all ground operations, VIP fleets, and hospitality assets without intermediaries."},
        {"title":"24/7 Precision Control","desc":"Dedicated regional teams providing round-the-clock support for elite corporate events and high-net-worth clients."}
      ]'::jsonb
    ),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object(
      'title', 'Operational Command Centers',
      'body', 'To guarantee uncompromised quality, we do not rely on third-party agencies. Flash Group establishes its own physical strongholds in key international markets. From our nerve centers in the Middle East to our tropical outposts, these hubs ensure flawless 24/7 logistical execution.',
      'bullets', '[
        {"title":"Localized Excellence","desc":"Direct oversight of all ground operations, VIP fleets, and hospitality assets without intermediaries."},
        {"title":"24/7 Precision Control","desc":"Dedicated regional teams providing round-the-clock support for elite corporate events and high-net-worth clients."}
      ]'::jsonb
    )
where page_id = (select id from public.pages where key = 'about')
  and key = 'work_process';
