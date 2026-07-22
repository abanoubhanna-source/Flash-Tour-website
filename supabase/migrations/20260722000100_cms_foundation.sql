-- Flash Tour CMS Phase 1: core schema, authorization, published projections, and RLS.

create extension if not exists pgcrypto with schema extensions;

create type public.profile_status as enum ('active', 'suspended');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.content_type as enum (
  'service',
  'destination',
  'hospitality',
  'cruise',
  'brand',
  'office',
  'certification',
  'article',
  'navigation_item'
);
create type public.media_status as enum ('processing', 'ready', 'archived');
create type public.revision_event as enum (
  'draft_saved',
  'published',
  'unpublished',
  'archived',
  'restored'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  avatar_asset_id uuid,
  status public.profile_status not null default 'active',
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default extensions.gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z][a-z0-9_]*$'),
  name text not null,
  rank smallint not null unique check (rank between 1 and 100),
  is_system boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default extensions.gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z][a-z0-9_.]*$'),
  resource text not null,
  action text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  unique (resource, action)
);

create table public.role_permissions (
  role_id uuid not null references public.roles (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.user_roles (
  user_id uuid not null references public.profiles (id) on delete cascade,
  role_id uuid not null references public.roles (id) on delete restrict,
  assigned_by uuid references public.profiles (id) on delete set null,
  assigned_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table public.media_assets (
  id uuid primary key default extensions.gen_random_uuid(),
  bucket text not null default 'site-media',
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  byte_size bigint not null check (byte_size >= 0 and byte_size <= 15728640),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  checksum text not null,
  alt_text text not null default '',
  caption text,
  credit text,
  focal_x numeric(5, 4) not null default 0.5 check (focal_x between 0 and 1),
  focal_y numeric(5, 4) not null default 0.5 check (focal_y between 0 and 1),
  status public.media_status not null default 'processing',
  uploaded_by uuid references public.profiles (id) on delete set null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, storage_path),
  unique (checksum)
);

alter table public.profiles
  add constraint profiles_avatar_asset_id_fkey
  foreign key (avatar_asset_id) references public.media_assets (id) on delete set null;

create table public.pages (
  id uuid primary key default extensions.gen_random_uuid(),
  key text not null,
  path text not null,
  name text not null,
  template_key text not null,
  locale text not null default 'en',
  enabled boolean not null default false,
  lock_version integer not null default 1 check (lock_version > 0),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (key, locale),
  unique (path, locale),
  check (path like '/%')
);

create table public.page_sections (
  id uuid primary key default extensions.gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  key text not null,
  component_key text not null,
  sort_order integer not null default 0,
  enabled boolean not null default true,
  draft_data jsonb not null default '{}'::jsonb check (jsonb_typeof(draft_data) = 'object'),
  published_data jsonb check (published_data is null or jsonb_typeof(published_data) = 'object'),
  published_at timestamptz,
  lock_version integer not null default 1 check (lock_version > 0),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, key),
  unique (page_id, sort_order)
);

create table public.content_entries (
  id uuid primary key default extensions.gen_random_uuid(),
  content_type public.content_type not null,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  locale text not null default 'en',
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  draft_data jsonb not null default '{}'::jsonb check (jsonb_typeof(draft_data) = 'object'),
  published_data jsonb check (published_data is null or jsonb_typeof(published_data) = 'object'),
  published_at timestamptz,
  archived_at timestamptz,
  lock_version integer not null default 1 check (lock_version > 0),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_type, locale, slug)
);

create table public.content_relations (
  source_id uuid not null references public.content_entries (id) on delete cascade,
  target_id uuid not null references public.content_entries (id) on delete cascade,
  relation_type text not null check (relation_type ~ '^[a-z][a-z0-9_]*$'),
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (source_id, target_id, relation_type),
  check (source_id <> target_id)
);

create table public.seo_entries (
  id uuid primary key default extensions.gen_random_uuid(),
  page_id uuid references public.pages (id) on delete cascade,
  content_entry_id uuid references public.content_entries (id) on delete cascade,
  locale text not null default 'en',
  draft_data jsonb not null default '{}'::jsonb check (jsonb_typeof(draft_data) = 'object'),
  published_data jsonb check (published_data is null or jsonb_typeof(published_data) = 'object'),
  published_at timestamptz,
  lock_version integer not null default 1 check (lock_version > 0),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(page_id, content_entry_id) = 1)
);

create unique index seo_entries_page_locale_key
  on public.seo_entries (page_id, locale) where page_id is not null;
create unique index seo_entries_content_locale_key
  on public.seo_entries (content_entry_id, locale) where content_entry_id is not null;

create table public.redirects (
  id uuid primary key default extensions.gen_random_uuid(),
  source_path text not null unique check (source_path like '/%'),
  destination_path text not null check (destination_path like '/%' or destination_path ~ '^https://'),
  status_code smallint not null default 308 check (status_code in (301, 302, 307, 308)),
  enabled boolean not null default true,
  lock_version integer not null default 1 check (lock_version > 0),
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_path <> destination_path)
);

create table public.site_settings (
  key text primary key check (key ~ '^[a-z][a-z0-9_.]*$'),
  group_key text not null check (group_key ~ '^[a-z][a-z0-9_]*$'),
  draft_value jsonb not null default '{}'::jsonb,
  published_value jsonb,
  is_public boolean not null default true,
  lock_version integer not null default 1 check (lock_version > 0),
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_usages (
  id uuid primary key default extensions.gen_random_uuid(),
  asset_id uuid not null references public.media_assets (id) on delete restrict,
  page_section_id uuid references public.page_sections (id) on delete cascade,
  content_entry_id uuid references public.content_entries (id) on delete cascade,
  site_setting_key text references public.site_settings (key) on delete cascade,
  field_key text not null,
  created_at timestamptz not null default now(),
  check (num_nonnulls(page_section_id, content_entry_id, site_setting_key) = 1)
);

create unique index media_usages_page_section_key
  on public.media_usages (asset_id, page_section_id, field_key)
  where page_section_id is not null;
create unique index media_usages_content_entry_key
  on public.media_usages (asset_id, content_entry_id, field_key)
  where content_entry_id is not null;
create unique index media_usages_site_setting_key
  on public.media_usages (asset_id, site_setting_key, field_key)
  where site_setting_key is not null;

create table public.content_revisions (
  id uuid primary key default extensions.gen_random_uuid(),
  resource_type text not null,
  resource_id uuid not null,
  version integer not null check (version > 0),
  snapshot jsonb not null,
  event public.revision_event not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (resource_type, resource_id, version)
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  before_data jsonb,
  after_data jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index user_roles_role_id_idx on public.user_roles (role_id);
create index page_sections_page_order_idx on public.page_sections (page_id, sort_order);
create index content_entries_type_status_order_idx
  on public.content_entries (content_type, status, sort_order);
create index content_entries_published_at_idx
  on public.content_entries (published_at desc) where status = 'published';
create index content_relations_target_idx on public.content_relations (target_id, relation_type);
create index media_assets_status_created_idx on public.media_assets (status, created_at desc);
create index media_usages_asset_idx on public.media_usages (asset_id);
create index content_revisions_resource_idx
  on public.content_revisions (resource_type, resource_id, version desc);
create index audit_log_resource_idx on public.audit_log (resource_type, resource_id, created_at desc);
create index audit_log_actor_idx on public.audit_log (actor_id, created_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.set_content_audit_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if (select auth.uid()) is not null then
      new.created_by = (select auth.uid());
      new.updated_by = (select auth.uid());
    end if;
  else
    new.created_by = old.created_by;
    new.created_at = old.created_at;
    new.lock_version = old.lock_version + 1;
    if (select auth.uid()) is not null then
      new.updated_by = (select auth.uid());
    end if;
  end if;

  return new;
end;
$$;

create function public.set_created_by()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null then
    new.created_by = (select auth.uid());
  end if;
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger roles_set_updated_at before update on public.roles
for each row execute function public.set_updated_at();
create trigger media_assets_set_updated_at before update on public.media_assets
for each row execute function public.set_updated_at();
create trigger pages_set_updated_at before update on public.pages
for each row execute function public.set_updated_at();
create trigger page_sections_set_updated_at before update on public.page_sections
for each row execute function public.set_updated_at();
create trigger content_entries_set_updated_at before update on public.content_entries
for each row execute function public.set_updated_at();
create trigger seo_entries_set_updated_at before update on public.seo_entries
for each row execute function public.set_updated_at();
create trigger redirects_set_updated_at before update on public.redirects
for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

create trigger pages_set_audit_fields before insert or update on public.pages
for each row execute function public.set_content_audit_fields();
create trigger page_sections_set_audit_fields before insert or update on public.page_sections
for each row execute function public.set_content_audit_fields();
create trigger content_entries_set_audit_fields before insert or update on public.content_entries
for each row execute function public.set_content_audit_fields();
create trigger seo_entries_set_audit_fields before insert or update on public.seo_entries
for each row execute function public.set_content_audit_fields();
create trigger site_settings_set_audit_fields before insert or update on public.site_settings
for each row execute function public.set_content_audit_fields();
create trigger redirects_set_audit_fields before insert or update on public.redirects
for each row execute function public.set_content_audit_fields();
create trigger content_relations_set_created_by before insert on public.content_relations
for each row execute function public.set_created_by();

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create function public.current_user_has_permission(requested_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles profile
    join public.user_roles user_role on user_role.user_id = profile.id
    join public.role_permissions role_permission on role_permission.role_id = user_role.role_id
    join public.permissions permission on permission.id = role_permission.permission_id
    where profile.id = (select auth.uid())
      and profile.status = 'active'
      and permission.key = requested_permission
      and (
        requested_permission <> all (array[
          'content.publish', 'content.purge', 'media.purge', 'seo.publish',
          'settings.publish', 'users.manage', 'users.assign_admin',
          'users.assign_super_admin'
        ])
        or coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
      )
  );
$$;

create function public.current_user_highest_role_rank()
returns smallint
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(max(role.rank), 0)::smallint
  from public.profiles profile
  join public.user_roles user_role on user_role.user_id = profile.id
  join public.roles role on role.id = user_role.role_id
  where profile.id = (select auth.uid())
    and profile.status = 'active';
$$;

create function public.current_user_can_assign_role(target_role_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    case
      when target.rank = 100 then public.current_user_has_permission('users.assign_super_admin')
      when target.rank >= 80 then public.current_user_has_permission('users.assign_admin')
      else public.current_user_has_permission('users.manage')
        and public.current_user_highest_role_rank() > target.rank
    end,
    false
  )
  from public.roles target
  where target.id = target_role_id;
$$;

create function public.enforce_publication_permissions()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Migrations and narrowly scoped service-role operations do not carry an end-user JWT.
  if (select auth.uid()) is null then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if tg_table_name = 'pages' and coalesce((to_jsonb(new) ->> 'enabled')::boolean, false)
       and not public.current_user_has_permission('content.publish') then
      raise exception 'Publishing permission is required to create an enabled page.'
        using errcode = '42501';
    elsif tg_table_name = 'page_sections' and to_jsonb(new) -> 'published_data' <> 'null'::jsonb
       and not public.current_user_has_permission('content.publish') then
      raise exception 'Publishing permission is required to create published page content.'
        using errcode = '42501';
    elsif tg_table_name = 'content_entries'
       and (
         to_jsonb(new) ->> 'status' = 'published'
         or to_jsonb(new) -> 'published_data' <> 'null'::jsonb
       )
       and not public.current_user_has_permission('content.publish') then
      raise exception 'Publishing permission is required to create published content.'
        using errcode = '42501';
    elsif tg_table_name = 'seo_entries' and to_jsonb(new) -> 'published_data' <> 'null'::jsonb
       and not public.current_user_has_permission('seo.publish') then
      raise exception 'SEO publishing permission is required.' using errcode = '42501';
    elsif tg_table_name = 'site_settings' and to_jsonb(new) -> 'published_value' <> 'null'::jsonb
       and not public.current_user_has_permission('settings.publish') then
      raise exception 'Settings publishing permission is required.' using errcode = '42501';
    end if;

    return new;
  end if;

  if tg_table_name = 'pages' then
    if new.enabled is distinct from old.enabled
       or (old.enabled and (
         new.key is distinct from old.key
         or new.path is distinct from old.path
         or new.name is distinct from old.name
         or new.template_key is distinct from old.template_key
         or new.locale is distinct from old.locale
       )) then
      if not public.current_user_has_permission('content.publish') then
        raise exception 'Publishing permission is required to change a public page.'
          using errcode = '42501';
      end if;
    end if;
  elsif tg_table_name = 'page_sections' then
    if new.published_data is distinct from old.published_data
       or new.published_at is distinct from old.published_at
       or (old.published_data is not null and (
         new.page_id is distinct from old.page_id
         or new.key is distinct from old.key
         or new.enabled is distinct from old.enabled
         or new.sort_order is distinct from old.sort_order
         or new.component_key is distinct from old.component_key
       )) then
      if not public.current_user_has_permission('content.publish') then
        raise exception 'Publishing permission is required to change published page content.'
          using errcode = '42501';
      end if;
    end if;
  elsif tg_table_name = 'content_entries' then
    if new.status = 'archived' and old.status is distinct from 'archived' then
      if not public.current_user_has_permission('content.archive') then
        raise exception 'Archive permission is required to archive content.'
          using errcode = '42501';
      end if;
    end if;

    if new.published_data is distinct from old.published_data
       or new.published_at is distinct from old.published_at
       or (old.status = 'published' and (
         new.status is distinct from old.status
         or new.content_type is distinct from old.content_type
         or new.slug is distinct from old.slug
         or new.title is distinct from old.title
         or new.locale is distinct from old.locale
         or new.sort_order is distinct from old.sort_order
       )) then
      if not public.current_user_has_permission('content.publish') then
        raise exception 'Publishing permission is required to change published content.'
          using errcode = '42501';
      end if;
    end if;
  elsif tg_table_name = 'seo_entries' then
    if new.published_data is distinct from old.published_data
       or new.published_at is distinct from old.published_at
       or (old.published_data is not null and (
         new.page_id is distinct from old.page_id
         or new.content_entry_id is distinct from old.content_entry_id
         or new.locale is distinct from old.locale
       )) then
      if not public.current_user_has_permission('seo.publish') then
        raise exception 'SEO publishing permission is required.' using errcode = '42501';
      end if;
    end if;
  elsif tg_table_name = 'site_settings' then
    if new.published_value is distinct from old.published_value
       or new.published_at is distinct from old.published_at
       or new.is_public is distinct from old.is_public
       or (old.published_value is not null and (
         new.key is distinct from old.key
         or new.group_key is distinct from old.group_key
       )) then
      if not public.current_user_has_permission('settings.publish') then
        raise exception 'Settings publishing permission is required.' using errcode = '42501';
      end if;
    end if;
  end if;

  return new;
end;
$$;

create function public.protect_last_super_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  super_admin_role_id uuid;
begin
  select id into super_admin_role_id from public.roles where key = 'super_admin';

  if old.role_id = super_admin_role_id
     and (select count(*) from public.user_roles where role_id = super_admin_role_id) <= 1 then
    raise exception 'The last Super Admin role assignment cannot be removed.'
      using errcode = '23514';
  end if;

  return old;
end;
$$;

revoke all on function public.current_user_has_permission(text) from public;
revoke all on function public.current_user_highest_role_rank() from public;
revoke all on function public.current_user_can_assign_role(uuid) from public;
grant execute on function public.current_user_has_permission(text) to authenticated;
grant execute on function public.current_user_highest_role_rank() to authenticated;
grant execute on function public.current_user_can_assign_role(uuid) to authenticated;

insert into public.roles (key, name, rank) values
  ('viewer', 'Viewer', 10),
  ('editor', 'Editor', 20),
  ('administrator', 'Administrator', 80),
  ('super_admin', 'Super Admin', 100)
on conflict (key) do update set name = excluded.name, rank = excluded.rank;

insert into public.permissions (key, resource, action, description) values
  ('cms.view', 'cms', 'view', 'Access the CMS and view drafts'),
  ('content.create', 'content', 'create', 'Create content drafts'),
  ('content.edit', 'content', 'edit', 'Edit content drafts'),
  ('content.archive', 'content', 'archive', 'Archive content'),
  ('content.publish', 'content', 'publish', 'Publish and unpublish content'),
  ('content.purge', 'content', 'purge', 'Permanently delete content'),
  ('media.view', 'media', 'view', 'View the media library'),
  ('media.create', 'media', 'create', 'Upload media'),
  ('media.edit', 'media', 'edit', 'Edit media metadata'),
  ('media.archive', 'media', 'archive', 'Archive media'),
  ('media.purge', 'media', 'purge', 'Permanently delete unused media'),
  ('seo.view', 'seo', 'view', 'View SEO content'),
  ('seo.edit', 'seo', 'edit', 'Edit SEO drafts'),
  ('seo.publish', 'seo', 'publish', 'Publish SEO changes'),
  ('settings.view', 'settings', 'view', 'View website settings'),
  ('settings.edit', 'settings', 'edit', 'Edit website settings drafts'),
  ('settings.publish', 'settings', 'publish', 'Publish website settings'),
  ('users.view', 'users', 'view', 'View CMS users'),
  ('users.manage', 'users', 'manage', 'Invite, suspend, and manage ordinary users'),
  ('users.assign_admin', 'users', 'assign_admin', 'Assign the Administrator role'),
  ('users.assign_super_admin', 'users', 'assign_super_admin', 'Assign the Super Admin role'),
  ('audit.view', 'audit', 'view', 'View immutable audit history')
on conflict (key) do update
set resource = excluded.resource,
    action = excluded.action,
    description = excluded.description;

insert into public.role_permissions (role_id, permission_id)
select role.id, permission.id
from public.roles role
cross join public.permissions permission
where role.key = 'super_admin'
on conflict do nothing;

create trigger pages_enforce_publication_permissions
before insert or update on public.pages
for each row execute function public.enforce_publication_permissions();
create trigger page_sections_enforce_publication_permissions
before insert or update on public.page_sections
for each row execute function public.enforce_publication_permissions();
create trigger content_entries_enforce_publication_permissions
before insert or update on public.content_entries
for each row execute function public.enforce_publication_permissions();
create trigger seo_entries_enforce_publication_permissions
before insert or update on public.seo_entries
for each row execute function public.enforce_publication_permissions();
create trigger site_settings_enforce_publication_permissions
before insert or update on public.site_settings
for each row execute function public.enforce_publication_permissions();
create trigger user_roles_protect_last_super_admin
before delete on public.user_roles
for each row execute function public.protect_last_super_admin();

insert into public.role_permissions (role_id, permission_id)
select role.id, permission.id
from public.roles role
join public.permissions permission on permission.key = any (array[
  'cms.view', 'content.create', 'content.edit', 'content.archive', 'content.publish',
  'media.view', 'media.create', 'media.edit', 'media.archive',
  'seo.view', 'seo.edit', 'seo.publish',
  'settings.view', 'settings.edit', 'settings.publish',
  'users.view', 'users.manage', 'audit.view'
])
where role.key = 'administrator'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select role.id, permission.id
from public.roles role
join public.permissions permission on permission.key = any (array[
  'cms.view', 'content.create', 'content.edit', 'content.archive',
  'media.view', 'media.create', 'media.edit', 'media.archive',
  'seo.view', 'seo.edit', 'settings.view'
])
where role.key = 'editor'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select role.id, permission.id
from public.roles role
join public.permissions permission on permission.key = any (array[
  'cms.view', 'media.view', 'seo.view', 'settings.view'
])
where role.key = 'viewer'
on conflict do nothing;

create view public.published_pages
with (security_barrier = true) as
select id, key, path, name, template_key, locale, updated_at
from public.pages
where enabled;

create view public.published_page_sections
with (security_barrier = true) as
select id, page_id, key, component_key, sort_order, published_data as data, published_at, updated_at
from public.page_sections
where enabled and published_data is not null;

create view public.published_content_entries
with (security_barrier = true) as
select id, content_type, slug, title, locale, sort_order, published_data as data, published_at, updated_at
from public.content_entries
where status = 'published' and published_data is not null;

create view public.published_seo_entries
with (security_barrier = true) as
select id, page_id, content_entry_id, locale, published_data as data, published_at, updated_at
from public.seo_entries
where published_data is not null;

create view public.published_site_settings
with (security_barrier = true) as
select key, group_key, published_value as value, published_at, updated_at
from public.site_settings
where is_public and published_value is not null;

comment on view public.published_pages is
  'Security-definer projection that exposes only public page fields; base tables remain staff-only.';
comment on view public.published_page_sections is
  'Security-definer projection that excludes draft page-section data.';
comment on view public.published_content_entries is
  'Security-definer projection that exposes only published collection content.';
comment on view public.published_seo_entries is
  'Security-definer projection that excludes draft SEO data.';
comment on view public.published_site_settings is
  'Security-definer projection that exposes only explicitly public settings.';

revoke all on all tables in schema public from anon, authenticated;
grant select on public.published_pages to anon, authenticated;
grant select on public.published_page_sections to anon, authenticated;
grant select on public.published_content_entries to anon, authenticated;
grant select on public.published_seo_entries to anon, authenticated;
grant select on public.published_site_settings to anon, authenticated;

grant select on public.profiles, public.roles, public.permissions, public.role_permissions,
  public.user_roles, public.pages, public.page_sections, public.content_entries,
  public.content_relations, public.media_assets, public.media_usages, public.seo_entries,
  public.redirects, public.site_settings, public.content_revisions, public.audit_log
to authenticated;

grant insert, update on public.pages, public.page_sections, public.content_entries,
  public.content_relations, public.seo_entries, public.redirects, public.site_settings
to authenticated;
grant delete on public.pages, public.page_sections, public.content_entries,
  public.content_relations, public.seo_entries, public.redirects, public.site_settings
to authenticated;
grant insert, update, delete on public.media_assets, public.media_usages to authenticated;
grant insert on public.content_revisions to authenticated;
grant update on public.profiles to authenticated;
grant insert, delete on public.user_roles to authenticated;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.content_entries enable row level security;
alter table public.content_relations enable row level security;
alter table public.media_assets enable row level security;
alter table public.media_usages enable row level security;
alter table public.seo_entries enable row level security;
alter table public.redirects enable row level security;
alter table public.site_settings enable row level security;
alter table public.content_revisions enable row level security;
alter table public.audit_log enable row level security;

create policy "staff can view profiles" on public.profiles for select to authenticated
using (public.current_user_has_permission('users.view') or id = (select auth.uid()));
create policy "users can update own profile" on public.profiles for update to authenticated
using (id = (select auth.uid()) and status = 'active')
with check (id = (select auth.uid()) and status = 'active');

create policy "staff can view roles" on public.roles for select to authenticated
using (public.current_user_has_permission('cms.view'));
create policy "staff can view permissions" on public.permissions for select to authenticated
using (public.current_user_has_permission('cms.view'));
create policy "staff can view role permissions" on public.role_permissions for select to authenticated
using (public.current_user_has_permission('cms.view'));
create policy "user managers can view assignments" on public.user_roles for select to authenticated
using (public.current_user_has_permission('users.view') or user_id = (select auth.uid()));
create policy "user managers can insert assignments" on public.user_roles for insert to authenticated
with check (public.current_user_can_assign_role(role_id));
create policy "user managers can delete assignments" on public.user_roles for delete to authenticated
using (public.current_user_can_assign_role(role_id));

create policy "cms users can view pages" on public.pages for select to authenticated
using (public.current_user_has_permission('cms.view'));
create policy "editors can insert pages" on public.pages for insert to authenticated
with check (public.current_user_has_permission('content.create'));
create policy "editors can update pages" on public.pages for update to authenticated
using (public.current_user_has_permission('content.edit'))
with check (public.current_user_has_permission('content.edit'));
create policy "super admins can delete pages" on public.pages for delete to authenticated
using (public.current_user_has_permission('content.purge'));

create policy "cms users can view page sections" on public.page_sections for select to authenticated
using (public.current_user_has_permission('cms.view'));
create policy "editors can insert page sections" on public.page_sections for insert to authenticated
with check (public.current_user_has_permission('content.create'));
create policy "editors can update page sections" on public.page_sections for update to authenticated
using (public.current_user_has_permission('content.edit'))
with check (public.current_user_has_permission('content.edit'));
create policy "super admins can delete page sections" on public.page_sections for delete to authenticated
using (public.current_user_has_permission('content.purge'));

create policy "cms users can view content" on public.content_entries for select to authenticated
using (public.current_user_has_permission('cms.view'));
create policy "editors can insert content" on public.content_entries for insert to authenticated
with check (public.current_user_has_permission('content.create'));
create policy "editors can update content" on public.content_entries for update to authenticated
using (public.current_user_has_permission('content.edit'))
with check (public.current_user_has_permission('content.edit'));
create policy "super admins can delete content" on public.content_entries for delete to authenticated
using (public.current_user_has_permission('content.purge'));

create policy "cms users can view content relations" on public.content_relations for select to authenticated
using (public.current_user_has_permission('cms.view'));
create policy "editors can insert content relations" on public.content_relations for insert to authenticated
with check (public.current_user_has_permission('content.edit'));
create policy "editors can update content relations" on public.content_relations for update to authenticated
using (public.current_user_has_permission('content.edit'))
with check (public.current_user_has_permission('content.edit'));
create policy "super admins can delete content relations" on public.content_relations for delete to authenticated
using (public.current_user_has_permission('content.purge'));

create policy "media users can view assets" on public.media_assets for select to authenticated
using (public.current_user_has_permission('media.view'));
create policy "media users can insert assets" on public.media_assets for insert to authenticated
with check (public.current_user_has_permission('media.create') and uploaded_by = (select auth.uid()));
create policy "media users can update assets" on public.media_assets for update to authenticated
using (public.current_user_has_permission('media.edit'))
with check (public.current_user_has_permission('media.edit'));
create policy "super admins can delete assets" on public.media_assets for delete to authenticated
using (public.current_user_has_permission('media.purge'));

create policy "media users can view usages" on public.media_usages for select to authenticated
using (public.current_user_has_permission('media.view'));
create policy "editors can insert usages" on public.media_usages for insert to authenticated
with check (public.current_user_has_permission('content.edit'));
create policy "editors can update usages" on public.media_usages for update to authenticated
using (public.current_user_has_permission('content.edit'))
with check (public.current_user_has_permission('content.edit'));
create policy "editors can delete usages" on public.media_usages for delete to authenticated
using (public.current_user_has_permission('content.edit'));

create policy "seo users can view entries" on public.seo_entries for select to authenticated
using (public.current_user_has_permission('seo.view'));
create policy "seo editors can insert entries" on public.seo_entries for insert to authenticated
with check (public.current_user_has_permission('seo.edit'));
create policy "seo editors can update entries" on public.seo_entries for update to authenticated
using (public.current_user_has_permission('seo.edit'))
with check (public.current_user_has_permission('seo.edit'));
create policy "super admins can delete seo entries" on public.seo_entries for delete to authenticated
using (public.current_user_has_permission('content.purge'));

create policy "cms users can view redirects" on public.redirects for select to authenticated
using (public.current_user_has_permission('seo.view'));
create policy "seo editors can insert redirects" on public.redirects for insert to authenticated
with check (public.current_user_has_permission('seo.publish'));
create policy "seo editors can update redirects" on public.redirects for update to authenticated
using (public.current_user_has_permission('seo.publish'))
with check (public.current_user_has_permission('seo.publish'));
create policy "super admins can delete redirects" on public.redirects for delete to authenticated
using (public.current_user_has_permission('content.purge'));

create policy "settings users can view settings" on public.site_settings for select to authenticated
using (public.current_user_has_permission('settings.view'));
create policy "settings editors can insert settings" on public.site_settings for insert to authenticated
with check (public.current_user_has_permission('settings.edit'));
create policy "settings editors can update settings" on public.site_settings for update to authenticated
using (public.current_user_has_permission('settings.edit'))
with check (public.current_user_has_permission('settings.edit'));
create policy "super admins can delete settings" on public.site_settings for delete to authenticated
using (public.current_user_has_permission('content.purge'));

create policy "cms users can view revisions" on public.content_revisions for select to authenticated
using (public.current_user_has_permission('cms.view'));
create policy "editors can create revisions" on public.content_revisions for insert to authenticated
with check (public.current_user_has_permission('content.edit') and created_by = (select auth.uid()));

create policy "administrators can view audit log" on public.audit_log for select to authenticated
using (public.current_user_has_permission('audit.view'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "public can read site media"
on storage.objects for select to anon, authenticated
using (bucket_id = 'site-media');

create policy "media users can upload site media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'site-media'
  and public.current_user_has_permission('media.create')
  and owner_id = (select auth.uid()::text)
);

create policy "media users can update own site media"
on storage.objects for update to authenticated
using (
  bucket_id = 'site-media'
  and public.current_user_has_permission('media.edit')
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'site-media'
  and public.current_user_has_permission('media.edit')
  and owner_id = (select auth.uid()::text)
);

create policy "super admins can delete site media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'site-media'
  and public.current_user_has_permission('media.purge')
);
