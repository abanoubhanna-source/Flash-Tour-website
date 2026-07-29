-- Public, read-only view of the destination hierarchy (country -> place ->
-- attraction). content_relations itself has no anon grant, so the deep-dive
-- destination pages (/destinations/egypt, etc.) have no way to read which
-- places/attractions belong to which parent. This view only ever exposes
-- already-published, active rows, and only the two relation types used by
-- the destination hierarchy.

create or replace view public.published_destination_hierarchy
with (security_barrier = true) as
select
  parent.slug as parent_slug,
  parent.content_type as parent_type,
  child.id as id,
  child.slug as slug,
  child.content_type as content_type,
  child.title as title,
  r.sort_order as sort_order,
  child.published_data as data
from public.content_relations r
join public.content_entries parent on parent.id = r.source_id
join public.content_entries child on child.id = r.target_id
where r.relation_type in ('contains_place', 'contains_attraction')
  and child.status = 'published'
  and child.is_active
  and child.published_data is not null;

grant select on public.published_destination_hierarchy to anon, authenticated;
