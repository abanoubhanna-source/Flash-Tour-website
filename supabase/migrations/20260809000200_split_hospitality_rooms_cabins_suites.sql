-- The hospitality collection used a single "roomsOrCabins" number field,
-- which forced every property to show the same "N Rooms" label on the
-- public site even when the property was a Nile cruise ship (cabins, not
-- rooms) or had no lodging units at all (e.g. a day-trip boat). Split it
-- into three independent optional fields: rooms, cabins, suites. Existing
-- data is backfilled by showcase region: Nile cruise ships -> cabins,
-- everything else -> rooms. The old key is dropped from both draft and
-- published data once migrated.

update content_entries
set draft_data = (draft_data - 'roomsOrCabins') || jsonb_build_object(
  'cabins', case when draft_data->>'showcaseRegion' = 'nile-cruises' then draft_data->'roomsOrCabins' else 'null'::jsonb end,
  'rooms', case when draft_data->>'showcaseRegion' != 'nile-cruises' or draft_data->>'showcaseRegion' is null then draft_data->'roomsOrCabins' else 'null'::jsonb end
)
where content_type = 'hospitality' and draft_data ? 'roomsOrCabins';

update content_entries
set published_data = (published_data - 'roomsOrCabins') || jsonb_build_object(
  'cabins', case when published_data->>'showcaseRegion' = 'nile-cruises' then published_data->'roomsOrCabins' else 'null'::jsonb end,
  'rooms', case when published_data->>'showcaseRegion' != 'nile-cruises' or published_data->>'showcaseRegion' is null then published_data->'roomsOrCabins' else 'null'::jsonb end
)
where content_type = 'hospitality' and published_data is not null and published_data ? 'roomsOrCabins';
