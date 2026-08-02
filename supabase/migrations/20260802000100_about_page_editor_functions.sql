-- The About page stores its content across 11 page_sections rows (hero_intro,
-- experience, highlights, vision, mission, services_summary, expansion_journey,
-- ceo_message, team, languages, work_process) instead of the single "hero"
-- section every other page uses. The existing cms_save_page_draft/
-- cms_publish_page/cms_restore_page_revision functions hardcode key = 'hero',
-- so opening About in the dashboard editor threw "The page content structure
-- is incomplete." These are the same functions, generalized to update every
-- key present in a sections_data jsonb map instead of a single hero blob.
--
-- cms_unpublish_page already updates page_sections by page_id without
-- filtering on key, so it works for About unmodified and is reused as-is.

create function public.cms_save_about_draft(
  requested_page_id uuid,
  expected_lock_version integer,
  sections_data jsonb,
  seo_data jsonb,
  create_revision boolean default false
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  saved_page public.pages;
  section_key text;
  next_version integer;
begin
  if not public.current_user_has_permission('content.edit')
     or not public.current_user_has_permission('seo.edit') then
    raise exception 'You do not have permission to edit pages.' using errcode = '42501';
  end if;

  update public.pages
  set updated_by = (select auth.uid())
  where id = requested_page_id and lock_version = expected_lock_version
  returning * into saved_page;

  if saved_page.id is null then
    raise exception 'This page was changed in another session.' using errcode = '40001';
  end if;

  for section_key in select jsonb_object_keys(sections_data) loop
    update public.page_sections
    set draft_data = sections_data -> section_key
    where page_id = requested_page_id and key = section_key;
  end loop;

  update public.seo_entries
  set draft_data = seo_data
  where page_id = requested_page_id and locale = saved_page.locale;

  if create_revision then
    select coalesce(max(version), 0) + 1 into next_version
    from public.content_revisions
    where resource_type = 'page' and resource_id = requested_page_id;

    insert into public.content_revisions (
      resource_type,
      resource_id,
      version,
      snapshot,
      event,
      created_by
    ) values (
      'page',
      requested_page_id,
      next_version,
      jsonb_build_object(
        'page', jsonb_build_object(
          'name', saved_page.name,
          'path', saved_page.path,
          'key', saved_page.key,
          'locale', saved_page.locale
        ),
        'sections', sections_data,
        'seo', seo_data
      ),
      'draft_saved',
      (select auth.uid())
    );
  end if;

  return jsonb_build_object(
    'lockVersion', saved_page.lock_version,
    'updatedAt', saved_page.updated_at
  );
end;
$$;

create function public.cms_publish_about_page(
  requested_page_id uuid,
  expected_lock_version integer,
  sections_data jsonb,
  seo_data jsonb
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  published_page public.pages;
  section_key text;
  next_version integer;
begin
  if not public.current_user_has_permission('content.edit')
     or not public.current_user_has_permission('content.publish')
     or not public.current_user_has_permission('seo.edit')
     or not public.current_user_has_permission('seo.publish') then
    raise exception 'Publishing requires an authorized MFA session.' using errcode = '42501';
  end if;

  update public.pages
  set enabled = true, updated_by = (select auth.uid())
  where id = requested_page_id and lock_version = expected_lock_version
  returning * into published_page;

  if published_page.id is null then
    raise exception 'This page was changed in another session.' using errcode = '40001';
  end if;

  for section_key in select jsonb_object_keys(sections_data) loop
    update public.page_sections
    set draft_data = sections_data -> section_key,
        published_data = sections_data -> section_key,
        published_at = now()
    where page_id = requested_page_id and key = section_key;
  end loop;

  update public.seo_entries
  set draft_data = seo_data,
      published_data = seo_data,
      published_at = now()
  where page_id = requested_page_id and locale = published_page.locale;

  select coalesce(max(version), 0) + 1 into next_version
  from public.content_revisions
  where resource_type = 'page' and resource_id = requested_page_id;

  insert into public.content_revisions (
    resource_type,
    resource_id,
    version,
    snapshot,
    event,
    created_by
  ) values (
    'page',
    requested_page_id,
    next_version,
    jsonb_build_object(
      'page', jsonb_build_object(
        'name', published_page.name,
        'path', published_page.path,
        'key', published_page.key,
        'locale', published_page.locale
      ),
      'sections', sections_data,
      'seo', seo_data
    ),
    'published',
    (select auth.uid())
  );

  return jsonb_build_object(
    'lockVersion', published_page.lock_version,
    'updatedAt', published_page.updated_at
  );
end;
$$;

create function public.cms_restore_about_revision(
  requested_page_id uuid,
  requested_revision_id uuid,
  expected_lock_version integer
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  restored_page public.pages;
  restored_snapshot jsonb;
  section_key text;
  next_version integer;
begin
  if not public.current_user_has_permission('content.edit')
     or not public.current_user_has_permission('seo.edit') then
    raise exception 'You do not have permission to restore page versions.' using errcode = '42501';
  end if;

  select snapshot into restored_snapshot
  from public.content_revisions
  where id = requested_revision_id
    and resource_type = 'page'
    and resource_id = requested_page_id;

  if restored_snapshot is null then
    raise exception 'The selected page version does not exist.' using errcode = 'P0002';
  end if;

  update public.pages
  set updated_by = (select auth.uid())
  where id = requested_page_id and lock_version = expected_lock_version
  returning * into restored_page;

  if restored_page.id is null then
    raise exception 'This page was changed in another session.' using errcode = '40001';
  end if;

  for section_key in select jsonb_object_keys(restored_snapshot -> 'sections') loop
    update public.page_sections
    set draft_data = restored_snapshot -> 'sections' -> section_key
    where page_id = requested_page_id and key = section_key;
  end loop;

  update public.seo_entries
  set draft_data = restored_snapshot -> 'seo'
  where page_id = requested_page_id and locale = restored_page.locale;

  select coalesce(max(version), 0) + 1 into next_version
  from public.content_revisions
  where resource_type = 'page' and resource_id = requested_page_id;

  insert into public.content_revisions (
    resource_type,
    resource_id,
    version,
    snapshot,
    event,
    created_by
  ) values (
    'page',
    requested_page_id,
    next_version,
    restored_snapshot,
    'restored',
    (select auth.uid())
  );

  return jsonb_build_object(
    'lockVersion', restored_page.lock_version,
    'updatedAt', restored_page.updated_at,
    'sections', restored_snapshot -> 'sections',
    'seo', restored_snapshot -> 'seo'
  );
end;
$$;

revoke all on function public.cms_save_about_draft(uuid, integer, jsonb, jsonb, boolean) from public;
revoke all on function public.cms_publish_about_page(uuid, integer, jsonb, jsonb) from public;
revoke all on function public.cms_restore_about_revision(uuid, uuid, integer) from public;

grant execute on function public.cms_save_about_draft(uuid, integer, jsonb, jsonb, boolean) to authenticated;
grant execute on function public.cms_publish_about_page(uuid, integer, jsonb, jsonb) to authenticated;
grant execute on function public.cms_restore_about_revision(uuid, uuid, integer) to authenticated;
