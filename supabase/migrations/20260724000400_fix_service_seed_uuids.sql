-- 20260724000200_services_module.sql seeded the 13 JSON-migrated services with hand-crafted
-- ids like '32000000-0000-0000-0000-000000000010'. These are not valid RFC-4122 UUIDs: the
-- version nibble (13th hex digit) and variant nibble (17th) are both '0', which Zod's z.uuid()
-- rejects (Postgres's uuid type is lenient and accepted them, masking the bug). Every mutation
-- on these 13 rows therefore fails validation in src/app/dashboard/services/actions.ts with
-- "Some service fields are invalid." The same bug was found and fixed the same way for
-- destinations in 20260724000300_destinations_module.sql (ids now use a '...-4000-8000-...'
-- template). That migration could edit the seed in place because it was not yet applied
-- anywhere; this one is already committed and may already be applied to a shared/staging
-- project, so the fix here is an UPDATE rather than an edit to the historical seed file.
--
-- content_entries.id has no ON UPDATE CASCADE to seo_entries/media_usages, so a plain
-- `update ... set id = ...` would fail with a foreign key violation. Instead we snapshot the
-- affected rows (content_entries plus any dependent seo_entries/media_usages), delete the
-- originals (cascading away the dependents), and reinsert everything under the new, valid id.
-- content_revisions/audit_log reference resource_id polymorphically (not a real foreign key)
-- so those are just updated in place.

create temporary table _service_id_fix (
  old_id uuid primary key,
  new_id uuid not null unique
);

insert into _service_id_fix (old_id, new_id)
select
  ('32000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
  ('32000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid
from generate_series(1, 13) as n;

create temporary table _service_entries_snapshot as
select e.*, fix.new_id as _new_id
from public.content_entries e
join _service_id_fix fix on fix.old_id = e.id;

create temporary table _service_seo_snapshot as
select s.*, fix.new_id as _new_id
from public.seo_entries s
join _service_id_fix fix on fix.old_id = s.content_entry_id;

create temporary table _service_media_snapshot as
select mu.*, fix.new_id as _new_id
from public.media_usages mu
join _service_id_fix fix on fix.old_id = mu.content_entry_id;

update public.content_revisions cr
set resource_id = fix.new_id
from _service_id_fix fix
where cr.resource_type = 'service' and cr.resource_id = fix.old_id;

update public.audit_log al
set resource_id = fix.new_id
from _service_id_fix fix
where al.resource_type = 'service' and al.resource_id = fix.old_id;

delete from public.content_entries
where id in (select old_id from _service_id_fix);

insert into public.content_entries (
  id, content_type, slug, title, locale, status, sort_order,
  draft_data, published_data, published_at, archived_at, lock_version,
  created_by, updated_by, created_at, updated_at
)
select
  _new_id, content_type, slug, title, locale, status, sort_order,
  draft_data, published_data, published_at, archived_at, lock_version,
  created_by, updated_by, created_at, updated_at
from _service_entries_snapshot;

insert into public.seo_entries (
  id, page_id, content_entry_id, locale, draft_data, published_data,
  published_at, lock_version, created_by, updated_by, created_at, updated_at
)
select
  id, page_id, _new_id, locale, draft_data, published_data,
  published_at, lock_version, created_by, updated_by, created_at, updated_at
from _service_seo_snapshot;

insert into public.media_usages (
  id, asset_id, page_section_id, content_entry_id, site_setting_key, field_key, created_at
)
select
  id, asset_id, page_section_id, _new_id, site_setting_key, field_key, created_at
from _service_media_snapshot;

drop table _service_media_snapshot;
drop table _service_seo_snapshot;
drop table _service_entries_snapshot;
drop table _service_id_fix;
