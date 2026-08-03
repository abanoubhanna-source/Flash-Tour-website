-- The dashboard's "Countries" tab under /dashboard/destinations was wrongly
-- routing top-level "destination" entries through the generic collection
-- editor (built for hospitality/cruise/brand/destination_place/
-- destination_attraction), which has no concept of the nested
-- hero{eyebrow,title,accentTitle,subtitle,image} object that
-- destinationContentSchema actually uses. Opening Morocco's entry there
-- triggered an autosave that overwrote draft_data with the generic editor's
-- flat shape, dropping hero/highlights/country entirely. published_data
-- (what the live site reads) was never touched, so it's still the correct,
-- last-known-good shape — restore draft_data from it so the dashboard
-- editor (now fixed to use the correct destination editor) shows accurate
-- data instead of the stripped-down version.
update public.content_entries
set draft_data = published_data
where content_type = 'destination'
  and slug = 'morocco'
  and published_data is not null;
