-- Flash Tour CMS expansion: normalized destination hierarchy and shared website configuration.
-- This migration only adds schema. Existing content and published projections remain intact.

alter type public.content_type add value if not exists 'destination_place';
alter type public.content_type add value if not exists 'destination_attraction';

alter table public.content_entries
  add column if not exists is_active boolean not null default true;

create table if not exists public.hospitality_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z][a-z0-9_]*$'),
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.navigation_items (
  id uuid primary key default extensions.gen_random_uuid(),
  location text not null check (location in ('header', 'footer')),
  label text not null,
  href text not null check (href like '/%' or href ~ '^https://'),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  open_in_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (location, sort_order)
);

create index if not exists content_entries_public_active_idx
  on public.content_entries (content_type, sort_order)
  where status = 'published' and is_active and published_data is not null;
create index if not exists hospitality_categories_active_order_idx
  on public.hospitality_categories (is_active, sort_order);
create index if not exists navigation_items_location_order_idx
  on public.navigation_items (location, is_active, sort_order);

create or replace view public.published_content_entries
with (security_barrier = true) as
select id, content_type, slug, title, locale, sort_order, published_data as data, published_at, updated_at
from public.content_entries
where status = 'published' and is_active and published_data is not null;

create or replace function public.prevent_content_parent_delete()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.content_relations
    where source_id = old.id
      and relation_type in ('contains_place', 'contains_attraction')
  ) then
    raise exception 'Cannot delete content that still contains child content.' using errcode = '23503';
  end if;
  return old;
end;
$$;

drop trigger if exists prevent_content_parent_delete on public.content_entries;
create trigger prevent_content_parent_delete
before delete on public.content_entries
for each row execute function public.prevent_content_parent_delete();

alter table public.hospitality_categories enable row level security;
alter table public.navigation_items enable row level security;

create policy "cms users can view hospitality categories" on public.hospitality_categories
for select to authenticated using (public.current_user_has_permission('cms.view'));
create policy "content editors can manage hospitality categories" on public.hospitality_categories
for all to authenticated
using (public.current_user_has_permission('content.edit'))
with check (public.current_user_has_permission('content.edit'));

create policy "cms users can view navigation items" on public.navigation_items
for select to authenticated using (public.current_user_has_permission('settings.view'));
create policy "settings editors can manage navigation items" on public.navigation_items
for all to authenticated
using (public.current_user_has_permission('settings.edit'))
with check (public.current_user_has_permission('settings.edit'));

grant select on public.published_content_entries to anon, authenticated;
