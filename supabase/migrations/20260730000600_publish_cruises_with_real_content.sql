-- The 9 "cruise" content_type entries (Magic I, Magic II, Lady Carol, Lady
-- Mary, Nile Excellence, Nile Majestic, Nile Divine, Flash Boats, Luxury
-- Speed Boat) were created as blank scaffolding — empty description,
-- facilities, cabin count — and left in draft forever, which is why the
-- dashboard's Cruises module looked permanently broken/empty. The real
-- content for every one of these ships already exists as a *published*
-- "hospitality" entry with the same slug (categorized under the Nile
-- Cruise/Dahabiya/Boat/Speed Boat hospitality categories, which power the
-- /hospitality/nile-cruises-style detail pages). Both systems are
-- intentional (Cruises is the public overview page, Hospitality holds the
-- per-property detail data) — only the Cruises side was never finished.
--
-- Copy the real description/facilities/cabin-count/region/country from
-- each hospitality twin into its cruise entry, then publish. Leaves the
-- hospitality entries untouched.

update public.content_entries cruise
set draft_data = cruise.draft_data || jsonb_build_object(
    'shortDescription', coalesce(hospitality.draft_data->>'shortDescription', ''),
    'fullDescription', coalesce(hospitality.draft_data->>'fullDescription', ''),
    'facilities', coalesce(hospitality.draft_data->'facilities', '[]'::jsonb),
    'roomsOrCabins', hospitality.draft_data->'roomsOrCabins',
    'region', hospitality.draft_data->'region',
    'country', hospitality.draft_data->'country'
  ),
  published_data = cruise.draft_data || jsonb_build_object(
    'shortDescription', coalesce(hospitality.draft_data->>'shortDescription', ''),
    'fullDescription', coalesce(hospitality.draft_data->>'fullDescription', ''),
    'facilities', coalesce(hospitality.draft_data->'facilities', '[]'::jsonb),
    'roomsOrCabins', hospitality.draft_data->'roomsOrCabins',
    'region', hospitality.draft_data->'region',
    'country', hospitality.draft_data->'country'
  ),
  status = 'published',
  published_at = now()
from public.content_entries hospitality
where cruise.content_type = 'cruise'
  and hospitality.content_type = 'hospitality'
  and hospitality.slug = cruise.slug
  and cruise.status = 'draft';

insert into public.content_revisions (resource_type, resource_id, version, snapshot, event)
select
  'cruise',
  cruise.id,
  coalesce((select max(version) from public.content_revisions r where r.resource_type = 'cruise' and r.resource_id = cruise.id), 0) + 1,
  jsonb_build_object('seedKey', 'cruise_publish_from_hospitality_v1', 'content', cruise.published_data),
  'published'
from public.content_entries cruise
where cruise.content_type = 'cruise'
  and cruise.status = 'published'
  and not exists (
    select 1 from public.content_revisions r
    where r.resource_type = 'cruise' and r.resource_id = cruise.id
      and r.snapshot->>'seedKey' = 'cruise_publish_from_hospitality_v1'
  );
