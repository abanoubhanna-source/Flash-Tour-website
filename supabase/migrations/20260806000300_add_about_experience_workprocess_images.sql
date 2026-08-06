-- The About dashboard's "Experience" and "Work process" sections had text
-- fields (title/body/bullets) but no way to edit the photos shown beside
-- them on the public page — those were hardcoded directly in the page's
-- JSX (/images/vip-bus.jpg, /images/office-1.jpg, /images/office-2.jpg).
-- Seeds the new image/secondaryImage fields with that same real, already-
-- live imagery so nothing changes visually until an editor replaces them.

update public.page_sections
set draft_data = draft_data || jsonb_build_object(
      'image', jsonb_build_object('assetId', null, 'url', '/images/vip-bus.jpg', 'alt', 'Flash Group Infrastructure')
    ),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object(
      'image', jsonb_build_object('assetId', null, 'url', '/images/vip-bus.jpg', 'alt', 'Flash Group Infrastructure')
    )
where page_id = (select id from public.pages where key = 'about')
  and key = 'experience';

update public.page_sections
set draft_data = draft_data || jsonb_build_object(
      'image', jsonb_build_object('assetId', null, 'url', '/images/office-1.jpg', 'alt', 'Flash Group Operations Hub'),
      'secondaryImage', jsonb_build_object('assetId', null, 'url', '/images/office-2.jpg', 'alt', 'Regional Operations Center')
    ),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object(
      'image', jsonb_build_object('assetId', null, 'url', '/images/office-1.jpg', 'alt', 'Flash Group Operations Hub'),
      'secondaryImage', jsonb_build_object('assetId', null, 'url', '/images/office-2.jpg', 'alt', 'Regional Operations Center')
    )
where page_id = (select id from public.pages where key = 'about')
  and key = 'work_process';
