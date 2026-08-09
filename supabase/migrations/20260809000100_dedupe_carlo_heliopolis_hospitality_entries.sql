-- The Urban Centers (Heritage & Fine Dining) showcase was showing two
-- separate cards for the same restaurant: "Carlos Heliopolis" (the entry
-- the site owner has actually been editing, with a real uploaded photo and
-- a full real description) and "Carlo's Restaurant" (an earlier thin
-- auto-seeded duplicate with a generic description, still tagged for the
-- same showcaseRegion). Per the site owner's request, carries the location
-- and card-display fields (icon/facilities/diningOptions) from the
-- duplicate onto the real entry so nothing visually regresses, then
-- archives the duplicate so only one "Carlos" card remains.

update public.content_entries
set draft_data = draft_data || jsonb_build_object(
      'location', 'Heliopolis',
      'region', 'Cairo',
      'country', 'Egypt',
      'showcaseIcon', 'UtensilsCrossed',
      'facilities', jsonb_build_array('Outdoor ambiance'),
      'diningOptions', jsonb_build_array('Dining')
    ),
    published_data = published_data || jsonb_build_object(
      'location', 'Heliopolis',
      'region', 'Cairo',
      'country', 'Egypt',
      'showcaseIcon', 'UtensilsCrossed',
      'facilities', jsonb_build_array('Outdoor ambiance'),
      'diningOptions', jsonb_build_array('Dining')
    )
where slug = 'carlos-heliopolis'
  and content_type = 'hospitality';

update public.content_entries
set status = 'archived'
where slug = 'carlo-heliopolis'
  and content_type = 'hospitality';
