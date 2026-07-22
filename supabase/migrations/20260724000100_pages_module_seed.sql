-- Flash Tour CMS Phase 3: seed the existing home page without changing public output.

insert into public.pages (
  id,
  key,
  path,
  name,
  template_key,
  locale,
  enabled
) values (
  '31000000-0000-0000-0000-000000000001',
  'home',
  '/',
  'Home',
  'home',
  'en',
  true
)
on conflict (key, locale) do nothing;

insert into public.page_sections (
  id,
  page_id,
  key,
  component_key,
  sort_order,
  enabled,
  draft_data,
  published_data,
  published_at
) values (
  '31000000-0000-0000-0000-000000000002',
  '31000000-0000-0000-0000-000000000001',
  'hero',
  'home_hero',
  0,
  true,
  '{
    "eyebrow": "A 40-Year Hospitality Legacy",
    "title": "Crafting Hospitality Since 1985",
    "subtitle": "An Egyptian-born tourism and hospitality group owning Nile cruises, resorts, restaurants, yachts, and premium mobility assets across strategic destinations.",
    "primaryCta": {"label": "Partner With Flash Group", "href": "/contact"},
    "secondaryCta": {"label": "Explore Portfolio", "href": "/brands"},
    "image": {"assetId": null, "url": "/images/egypt-bg.jpg", "alt": "FLASH GROUP"}
  }'::jsonb,
  '{
    "eyebrow": "A 40-Year Hospitality Legacy",
    "title": "Crafting Hospitality Since 1985",
    "subtitle": "An Egyptian-born tourism and hospitality group owning Nile cruises, resorts, restaurants, yachts, and premium mobility assets across strategic destinations.",
    "primaryCta": {"label": "Partner With Flash Group", "href": "/contact"},
    "secondaryCta": {"label": "Explore Portfolio", "href": "/brands"},
    "image": {"assetId": null, "url": "/images/egypt-bg.jpg", "alt": "FLASH GROUP"}
  }'::jsonb,
  now()
)
on conflict (page_id, key) do nothing;

insert into public.seo_entries (
  id,
  page_id,
  locale,
  draft_data,
  published_data,
  published_at
) values (
  '31000000-0000-0000-0000-000000000003',
  '31000000-0000-0000-0000-000000000001',
  'en',
  '{
    "title": "Flash Group | Crafting Hospitality Since 1985",
    "description": "An Egyptian International company offering full-fledged services in tourism and hospitality.",
    "canonicalPath": "/",
    "ogImage": "/images/egypt-bg.jpg"
  }'::jsonb,
  '{
    "title": "Flash Group | Crafting Hospitality Since 1985",
    "description": "An Egyptian International company offering full-fledged services in tourism and hospitality.",
    "canonicalPath": "/",
    "ogImage": "/images/egypt-bg.jpg"
  }'::jsonb,
  now()
)
on conflict (page_id, locale) where page_id is not null do nothing;

insert into public.content_revisions (
  resource_type,
  resource_id,
  version,
  snapshot,
  event
) values (
  'page',
  '31000000-0000-0000-0000-000000000001',
  1,
  jsonb_build_object(
    'page', jsonb_build_object('name', 'Home', 'path', '/', 'key', 'home', 'locale', 'en'),
    'hero', '{
      "eyebrow": "A 40-Year Hospitality Legacy",
      "title": "Crafting Hospitality Since 1985",
      "subtitle": "An Egyptian-born tourism and hospitality group owning Nile cruises, resorts, restaurants, yachts, and premium mobility assets across strategic destinations.",
      "primaryCta": {"label": "Partner With Flash Group", "href": "/contact"},
      "secondaryCta": {"label": "Explore Portfolio", "href": "/brands"},
      "image": {"assetId": null, "url": "/images/egypt-bg.jpg", "alt": "FLASH GROUP"}
    }'::jsonb,
    'seo', '{
      "title": "Flash Group | Crafting Hospitality Since 1985",
      "description": "An Egyptian International company offering full-fledged services in tourism and hospitality.",
      "canonicalPath": "/",
      "ogImage": "/images/egypt-bg.jpg"
    }'::jsonb
  ),
  'published'
)
on conflict (resource_type, resource_id, version) do nothing;

create function public.cms_create_page(
  requested_name text,
  requested_path text,
  requested_key text,
  requested_locale text,
  hero_data jsonb,
  seo_data jsonb
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  created_page_id uuid;
begin
  if not public.current_user_has_permission('content.create')
     or not public.current_user_has_permission('seo.edit') then
    raise exception 'You do not have permission to create pages.' using errcode = '42501';
  end if;

  insert into public.pages (key, path, name, template_key, locale)
  values (requested_key, requested_path, requested_name, 'standard', requested_locale)
  returning id into created_page_id;

  insert into public.page_sections (page_id, key, component_key, sort_order, draft_data)
  values (created_page_id, 'hero', 'standard_hero', 0, hero_data);

  insert into public.seo_entries (page_id, locale, draft_data)
  values (created_page_id, requested_locale, seo_data);

  insert into public.content_revisions (
    resource_type,
    resource_id,
    version,
    snapshot,
    event,
    created_by
  ) values (
    'page',
    created_page_id,
    1,
    jsonb_build_object(
      'page', jsonb_build_object(
        'name', requested_name,
        'path', requested_path,
        'key', requested_key,
        'locale', requested_locale
      ),
      'hero', hero_data,
      'seo', seo_data
    ),
    'draft_saved',
    (select auth.uid())
  );

  return created_page_id;
end;
$$;

create function public.cms_save_page_draft(
  requested_page_id uuid,
  expected_lock_version integer,
  hero_data jsonb,
  seo_data jsonb,
  create_revision boolean default false
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  saved_page public.pages;
  saved_section_id uuid;
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

  update public.page_sections
  set draft_data = hero_data
  where page_id = requested_page_id and key = 'hero'
  returning id into saved_section_id;

  update public.seo_entries
  set draft_data = seo_data
  where page_id = requested_page_id and locale = saved_page.locale;

  delete from public.media_usages
  where page_section_id = saved_section_id and field_key = 'hero.image';

  if nullif(hero_data #>> '{image,assetId}', '') is not null then
    insert into public.media_usages (asset_id, page_section_id, field_key)
    values ((hero_data #>> '{image,assetId}')::uuid, saved_section_id, 'hero.image');
  end if;

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
        'hero', hero_data,
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

create function public.cms_publish_page(
  requested_page_id uuid,
  expected_lock_version integer,
  hero_data jsonb,
  seo_data jsonb
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  published_page public.pages;
  published_section_id uuid;
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

  update public.page_sections
  set draft_data = hero_data,
      published_data = hero_data,
      published_at = now()
  where page_id = requested_page_id and key = 'hero'
  returning id into published_section_id;

  update public.seo_entries
  set draft_data = seo_data,
      published_data = seo_data,
      published_at = now()
  where page_id = requested_page_id and locale = published_page.locale;

  delete from public.media_usages
  where page_section_id = published_section_id and field_key = 'hero.image';

  if nullif(hero_data #>> '{image,assetId}', '') is not null then
    insert into public.media_usages (asset_id, page_section_id, field_key)
    values ((hero_data #>> '{image,assetId}')::uuid, published_section_id, 'hero.image');
  end if;

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
      'hero', hero_data,
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

create function public.cms_unpublish_page(
  requested_page_id uuid,
  expected_lock_version integer
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  unpublished_page public.pages;
  hero_data jsonb;
  seo_data jsonb;
  next_version integer;
begin
  if not public.current_user_has_permission('content.publish')
     or not public.current_user_has_permission('seo.publish') then
    raise exception 'Unpublishing requires an authorized MFA session.' using errcode = '42501';
  end if;

  select draft_data into hero_data
  from public.page_sections
  where page_id = requested_page_id and key = 'hero';

  select draft_data into seo_data
  from public.seo_entries
  where page_id = requested_page_id;

  update public.pages
  set enabled = false, updated_by = (select auth.uid())
  where id = requested_page_id and lock_version = expected_lock_version
  returning * into unpublished_page;

  if unpublished_page.id is null then
    raise exception 'This page was changed in another session.' using errcode = '40001';
  end if;

  update public.page_sections
  set published_data = null, published_at = null
  where page_id = requested_page_id;

  update public.seo_entries
  set published_data = null, published_at = null
  where page_id = requested_page_id;

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
        'name', unpublished_page.name,
        'path', unpublished_page.path,
        'key', unpublished_page.key,
        'locale', unpublished_page.locale
      ),
      'hero', hero_data,
      'seo', seo_data
    ),
    'unpublished',
    (select auth.uid())
  );

  return jsonb_build_object(
    'lockVersion', unpublished_page.lock_version,
    'updatedAt', unpublished_page.updated_at
  );
end;
$$;

create function public.cms_restore_page_revision(
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
  restored_section_id uuid;
  restored_snapshot jsonb;
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

  update public.page_sections
  set draft_data = restored_snapshot -> 'hero'
  where page_id = requested_page_id and key = 'hero'
  returning id into restored_section_id;

  update public.seo_entries
  set draft_data = restored_snapshot -> 'seo'
  where page_id = requested_page_id and locale = restored_page.locale;

  delete from public.media_usages
  where page_section_id = restored_section_id and field_key = 'hero.image';

  if nullif(restored_snapshot #>> '{hero,image,assetId}', '') is not null then
    insert into public.media_usages (asset_id, page_section_id, field_key)
    values (
      (restored_snapshot #>> '{hero,image,assetId}')::uuid,
      restored_section_id,
      'hero.image'
    );
  end if;

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
    'hero', restored_snapshot -> 'hero',
    'seo', restored_snapshot -> 'seo'
  );
end;
$$;

revoke all on function public.cms_create_page(text, text, text, text, jsonb, jsonb) from public;
revoke all on function public.cms_save_page_draft(uuid, integer, jsonb, jsonb, boolean) from public;
revoke all on function public.cms_publish_page(uuid, integer, jsonb, jsonb) from public;
revoke all on function public.cms_unpublish_page(uuid, integer) from public;
revoke all on function public.cms_restore_page_revision(uuid, uuid, integer) from public;

grant execute on function public.cms_create_page(text, text, text, text, jsonb, jsonb) to authenticated;
grant execute on function public.cms_save_page_draft(uuid, integer, jsonb, jsonb, boolean) to authenticated;
grant execute on function public.cms_publish_page(uuid, integer, jsonb, jsonb) to authenticated;
grant execute on function public.cms_unpublish_page(uuid, integer) to authenticated;
grant execute on function public.cms_restore_page_revision(uuid, uuid, integer) to authenticated;
