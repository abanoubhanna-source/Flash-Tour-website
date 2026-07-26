-- 20260724000100_pages_module_seed.sql seeded the Home page and its hero section/SEO
-- with hand-crafted ids like '31000000-0000-0000-0000-000000000001'. These are not
-- valid RFC-4122 UUIDs: the version nibble (13th hex digit) and variant nibble (17th)
-- are both '0', which Zod's z.uuid() rejects (Postgres's uuid type is lenient and
-- accepted them, masking the bug). Every mutation on the Home page therefore fails
-- validation in src/app/dashboard/pages/actions.ts with "Some page fields are invalid."
--
-- Confirmed live: editing the Home page hero in the dashboard and autosaving returns
-- "Save failed" / "Some page fields are invalid." The same bug was found and fixed the
-- same way for destinations (in-place, migration not yet applied anywhere) and for
-- services (20260724000400_fix_service_seed_uuids.sql, applied via UPDATE because that
-- migration was already committed/applied). This migration is also already committed,
-- so the fix here is an UPDATE rather than an edit to the historical seed file.
--
-- pages.id has no ON UPDATE CASCADE to page_sections/seo_entries, so a plain
-- `update ... set id = ...` would fail with a foreign key violation. Instead we
-- snapshot the affected rows (the Home page plus its dependent page_sections,
-- seo_entries, and media_usages), delete the original page (cascading away the
-- dependents), and reinsert everything under the new, valid id.
-- content_revisions/audit_log reference resource_id polymorphically (not a real
-- foreign key) so those are just updated in place.

create temporary table _page_id_fix (
  old_id uuid primary key,
  new_id uuid not null unique
);

insert into _page_id_fix (old_id, new_id) values
  ('31000000-0000-0000-0000-000000000001', '31000000-0000-4000-8000-000000000001');

create temporary table _page_snapshot as
select p.*, fix.new_id as _new_id
from public.pages p
join _page_id_fix fix on fix.old_id = p.id;

create temporary table _page_section_snapshot as
select s.*, fix.new_id as _new_page_id
from public.page_sections s
join _page_id_fix fix on fix.old_id = s.page_id;

create temporary table _page_seo_snapshot as
select s.*, fix.new_id as _new_page_id
from public.seo_entries s
join _page_id_fix fix on fix.old_id = s.page_id;

create temporary table _page_media_snapshot as
select mu.*
from public.media_usages mu
join public.page_sections s on s.id = mu.page_section_id
join _page_id_fix fix on fix.old_id = s.page_id;

update public.content_revisions cr
set resource_id = fix.new_id
from _page_id_fix fix
where cr.resource_type = 'page' and cr.resource_id = fix.old_id;

update public.audit_log al
set resource_id = fix.new_id
from _page_id_fix fix
where al.resource_type = 'page' and al.resource_id = fix.old_id;

delete from public.pages
where id in (select old_id from _page_id_fix);

insert into public.pages (
  id, key, path, name, template_key, locale, enabled, lock_version,
  created_by, updated_by, created_at, updated_at
)
select
  _new_id, key, path, name, template_key, locale, enabled, lock_version,
  created_by, updated_by, created_at, updated_at
from _page_snapshot;

insert into public.page_sections (
  id, page_id, key, component_key, sort_order, enabled, draft_data, published_data,
  published_at, lock_version, created_by, updated_by, created_at, updated_at
)
select
  id, _new_page_id, key, component_key, sort_order, enabled, draft_data, published_data,
  published_at, lock_version, created_by, updated_by, created_at, updated_at
from _page_section_snapshot;

insert into public.seo_entries (
  id, page_id, content_entry_id, locale, draft_data, published_data,
  published_at, lock_version, created_by, updated_by, created_at, updated_at
)
select
  id, _new_page_id, content_entry_id, locale, draft_data, published_data,
  published_at, lock_version, created_by, updated_by, created_at, updated_at
from _page_seo_snapshot;

insert into public.media_usages (
  id, asset_id, page_section_id, content_entry_id, site_setting_key, field_key, created_at
)
select
  id, asset_id, page_section_id, content_entry_id, site_setting_key, field_key, created_at
from _page_media_snapshot;

drop table _page_media_snapshot;
drop table _page_seo_snapshot;
drop table _page_section_snapshot;
drop table _page_snapshot;
drop table _page_id_fix;
