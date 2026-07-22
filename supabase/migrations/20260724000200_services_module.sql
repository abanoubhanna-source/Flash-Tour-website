-- Flash Group CMS Phase 3: migrate the existing services JSON into managed content.

with source as (
  select * from jsonb_to_recordset($services$
  [
    {"ord":1,"slug":"inbound-outbound-tourism","title":"Inbound & Outbound Tourism","description":"With many years of experience in the industry, we have diversified our portfolio in hospitality. Flash Tour has expanded its location around the world, offering hotels in many countries ranging from Nile cruises, Boutique hotels, Resorts and Boats. Our hospitality style is diverse, whether you wake up to the sound of the waves of the Indian ocean or find yourself sailing on one of the largest rivers in the world, departing from a city to wake up in another one."},
    {"ord":2,"slug":"flight-reservations","title":"Flight Reservations","description":"Our team will handle all ticketing procedures as we have partnered up with IATA. Via the Amadeus system, we are able to view and reserve airline tickets for our clients after analyzing the best options available."},
    {"ord":3,"slug":"hotel-reservations","title":"Hotel Reservations","description":"We have contracted most of the hotels in the region across all categories, both in terms of luxury and range of facilities as well as the location. Our partners will be spoiled for choice when selecting the hotels for their clients and our competitive prices combined with exclusive offers will delight you."},
    {"ord":4,"slug":"tour-guiding-services","title":"Tour Guiding Services","description":"We have a professional team that offers full guidance in several languages. All our team members are bilingual and certified."},
    {"ord":5,"slug":"transportation","title":"Transportation","description":"We offer a variety of Private VIP cars, limousines, coasters, shuttles, up to 50 seater buses. With a fleet of more than 100 vehicles, we guarantee our clients a wide variety of transports that exceed international standards."},
    {"ord":6,"slug":"leisure-individuals-groups","title":"Leisure: Individuals & Groups","description":"We provide high quality tailor-made solutions for niche-markets and customized services for mass-markets in the FIT and Leisure Group segments."},
    {"ord":7,"slug":"premium-fit-family-travel","title":"Premium FIT & Family Travel","description":"Our experts are happy to handcraft packages for your FIT clients as well as families. We organize every aspect of the trip, from transfers to excursions and hotel stays which are tailored to the specific needs of the clients."},
    {"ord":8,"slug":"fully-escorted-group-tours","title":"Fully Escorted Group Tours","description":"For those who love to travel with company, we offer an exceptional solution with our Small Group Tours with just 12 to 24 guests. From imaginative trips to off-the-beaten."},
    {"ord":9,"slug":"hajj-and-umrah","title":"Hajj and Umrah","description":"For our Egyptian clients we plan and handle Hajj and Umrah services for those seeking to perform their holy pilgrimages. Our team will arrange everything: transportation, flight, and hotel reservations; furthermore, assist our clients with any special requests."},
    {"ord":10,"slug":"airport-services","title":"Airport Services","description":"As we provide outstanding products and services that, together, deliver a premium value to our clients, we are providing all Airport services to our clients like Marhaba services and lounge access; moreover, our team is available 24/7 at the airport to meet and assist our valued clients, and provide shuttle services."},
    {"ord":11,"slug":"mice-management","title":"MICE Management","description":"In the UAE we manage large-scale business trips and corporate travels as a different ball game altogether. Therefore we have a specialized in-house team for all MICE industry segments. Meetings, incentives, conferences, or events."},
    {"ord":12,"slug":"visa-services","title":"Visa Services","description":"Entry visa to the UAE is one of our services offered at very attractive rates to our valued clients for both vacations or business purposes."},
    {"ord":13,"slug":"golf","title":"Golf","description":"Since The UAE is a very popular destination for golf enthusiasts, our Flash Horizon Golf team has limitless experience and a wealth of contacts to make sure that any package, green fee or tournament is perfection “to a tee”"}
  ]$services$::jsonb) as item(ord integer, slug text, title text, description text)
)
insert into public.content_entries (
  id, content_type, slug, title, locale, status, sort_order,
  draft_data, published_data, published_at
)
select
  ('32000000-0000-0000-0000-' || lpad(source.ord::text, 12, '0'))::uuid,
  'service', source.slug, source.title, 'en', 'published', source.ord * 10,
  jsonb_build_object(
    'title', source.title, 'slug', source.slug, 'description', source.description,
    'image', jsonb_build_object('assetId', null, 'url', '/images/services-hero.jpg', 'alt', source.title),
    'eyebrow', 'Service', 'iconKey', source.slug, 'sortOrder', source.ord * 10
  ),
  jsonb_build_object(
    'title', source.title, 'slug', source.slug, 'description', source.description,
    'image', jsonb_build_object('assetId', null, 'url', '/images/services-hero.jpg', 'alt', source.title),
    'eyebrow', 'Service', 'iconKey', source.slug, 'sortOrder', source.ord * 10
  ),
  now()
from source
on conflict (content_type, locale, slug) do nothing;

insert into public.seo_entries (content_entry_id, locale, draft_data, published_data, published_at)
select
  entry.id,
  entry.locale,
  jsonb_build_object(
    'title', entry.title || ' | Flash Group',
    'description', left(entry.draft_data ->> 'description', 170),
    'canonicalPath', '/services',
    'ogImage', entry.draft_data #>> '{image,url}'
  ),
  jsonb_build_object(
    'title', entry.title || ' | Flash Group',
    'description', left(entry.draft_data ->> 'description', 170),
    'canonicalPath', '/services',
    'ogImage', entry.draft_data #>> '{image,url}'
  ),
  now()
from public.content_entries entry
where entry.content_type = 'service'
on conflict (content_entry_id, locale) where content_entry_id is not null do nothing;

insert into public.content_revisions (resource_type, resource_id, version, snapshot, event)
select 'service', entry.id, 1,
  jsonb_build_object('content', entry.draft_data, 'seo', seo.draft_data),
  'published'
from public.content_entries entry
join public.seo_entries seo on seo.content_entry_id = entry.id and seo.locale = entry.locale
where entry.content_type = 'service'
on conflict (resource_type, resource_id, version) do nothing;

create function public.cms_create_service(
  requested_title text,
  requested_slug text,
  requested_locale text,
  content_data jsonb,
  seo_data jsonb
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  created_id uuid;
  next_order integer;
begin
  if not public.current_user_has_permission('content.create')
     or not public.current_user_has_permission('seo.edit') then
    raise exception 'You do not have permission to create services.' using errcode = '42501';
  end if;

  select coalesce(max(sort_order), 0) + 10 into next_order
  from public.content_entries where content_type = 'service' and locale = requested_locale;

  content_data := content_data || jsonb_build_object(
    'title', requested_title, 'slug', requested_slug, 'sortOrder', next_order
  );

  insert into public.content_entries (
    content_type, slug, title, locale, sort_order, draft_data
  ) values (
    'service', requested_slug, requested_title, requested_locale, next_order, content_data
  ) returning id into created_id;

  insert into public.seo_entries (content_entry_id, locale, draft_data)
  values (created_id, requested_locale, seo_data);

  insert into public.content_revisions (
    resource_type, resource_id, version, snapshot, event, created_by
  ) values (
    'service', created_id, 1,
    jsonb_build_object('content', content_data, 'seo', seo_data),
    'draft_saved', (select auth.uid())
  );

  return created_id;
end;
$$;

create function public.cms_save_service_draft(
  requested_service_id uuid,
  expected_lock_version integer,
  content_data jsonb,
  seo_data jsonb,
  create_revision boolean default false
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  saved public.content_entries;
  next_version integer;
begin
  if not public.current_user_has_permission('content.edit')
     or not public.current_user_has_permission('seo.edit') then
    raise exception 'You do not have permission to edit services.' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.content_entries candidate
    where candidate.content_type = 'service'
      and candidate.locale = (select locale from public.content_entries where id = requested_service_id)
      and candidate.id <> requested_service_id
      and (candidate.slug = content_data ->> 'slug' or candidate.draft_data ->> 'slug' = content_data ->> 'slug')
  ) then
    raise exception 'A service already uses this slug.' using errcode = '23505';
  end if;

  update public.content_entries
  set draft_data = content_data,
      title = case when status = 'draft' then content_data ->> 'title' else title end,
      slug = case when status = 'draft' then content_data ->> 'slug' else slug end,
      sort_order = case when status = 'draft' then (content_data ->> 'sortOrder')::integer else sort_order end,
      updated_by = (select auth.uid())
  where id = requested_service_id
    and content_type = 'service'
    and lock_version = expected_lock_version
  returning * into saved;

  if saved.id is null then
    raise exception 'This service was changed in another session.' using errcode = '40001';
  end if;

  update public.seo_entries set draft_data = seo_data
  where content_entry_id = requested_service_id and locale = saved.locale;

  delete from public.media_usages
  where content_entry_id = requested_service_id and field_key = 'service.image';
  if nullif(content_data #>> '{image,assetId}', '') is not null then
    insert into public.media_usages (asset_id, content_entry_id, field_key)
    values ((content_data #>> '{image,assetId}')::uuid, requested_service_id, 'service.image');
  end if;

  if create_revision then
    select coalesce(max(version), 0) + 1 into next_version
    from public.content_revisions where resource_type = 'service' and resource_id = requested_service_id;
    insert into public.content_revisions (resource_type, resource_id, version, snapshot, event, created_by)
    values ('service', requested_service_id, next_version,
      jsonb_build_object('content', content_data, 'seo', seo_data),
      'draft_saved', (select auth.uid()));
  end if;

  return jsonb_build_object('lockVersion', saved.lock_version, 'updatedAt', saved.updated_at);
end;
$$;

create function public.cms_publish_service(
  requested_service_id uuid,
  expected_lock_version integer,
  content_data jsonb,
  seo_data jsonb
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  saved public.content_entries;
  next_version integer;
begin
  if not public.current_user_has_permission('content.edit')
     or not public.current_user_has_permission('content.publish')
     or not public.current_user_has_permission('seo.edit')
     or not public.current_user_has_permission('seo.publish') then
    raise exception 'Publishing requires an authorized MFA session.' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.content_entries candidate
    where candidate.content_type = 'service'
      and candidate.locale = (select locale from public.content_entries where id = requested_service_id)
      and candidate.id <> requested_service_id
      and candidate.slug = content_data ->> 'slug'
  ) then
    raise exception 'A service already uses this slug.' using errcode = '23505';
  end if;

  update public.content_entries
  set title = content_data ->> 'title', slug = content_data ->> 'slug',
      sort_order = (content_data ->> 'sortOrder')::integer,
      draft_data = content_data, published_data = content_data,
      status = 'published', published_at = now(), updated_by = (select auth.uid())
  where id = requested_service_id and content_type = 'service' and lock_version = expected_lock_version
  returning * into saved;
  if saved.id is null then
    raise exception 'This service was changed in another session.' using errcode = '40001';
  end if;

  update public.seo_entries
  set draft_data = seo_data, published_data = seo_data, published_at = now()
  where content_entry_id = requested_service_id and locale = saved.locale;

  delete from public.media_usages
  where content_entry_id = requested_service_id and field_key = 'service.image';
  if nullif(content_data #>> '{image,assetId}', '') is not null then
    insert into public.media_usages (asset_id, content_entry_id, field_key)
    values ((content_data #>> '{image,assetId}')::uuid, requested_service_id, 'service.image');
  end if;

  select coalesce(max(version), 0) + 1 into next_version
  from public.content_revisions where resource_type = 'service' and resource_id = requested_service_id;
  insert into public.content_revisions (resource_type, resource_id, version, snapshot, event, created_by)
  values ('service', requested_service_id, next_version,
    jsonb_build_object('content', content_data, 'seo', seo_data),
    'published', (select auth.uid()));

  return jsonb_build_object('lockVersion', saved.lock_version, 'updatedAt', saved.updated_at);
end;
$$;

create function public.cms_unpublish_service(requested_service_id uuid, expected_lock_version integer)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  saved public.content_entries;
  seo_data jsonb;
  next_version integer;
begin
  if not public.current_user_has_permission('content.publish')
     or not public.current_user_has_permission('seo.publish') then
    raise exception 'Unpublishing requires an authorized MFA session.' using errcode = '42501';
  end if;
  update public.content_entries
  set status = 'draft', published_data = null, published_at = null, updated_by = (select auth.uid())
  where id = requested_service_id and content_type = 'service' and lock_version = expected_lock_version
  returning * into saved;
  if saved.id is null then
    raise exception 'This service was changed in another session.' using errcode = '40001';
  end if;
  update public.seo_entries set published_data = null, published_at = null
  where content_entry_id = requested_service_id returning draft_data into seo_data;
  select coalesce(max(version), 0) + 1 into next_version
  from public.content_revisions where resource_type = 'service' and resource_id = requested_service_id;
  insert into public.content_revisions (resource_type, resource_id, version, snapshot, event, created_by)
  values ('service', requested_service_id, next_version,
    jsonb_build_object('content', saved.draft_data, 'seo', seo_data),
    'unpublished', (select auth.uid()));
  return jsonb_build_object('lockVersion', saved.lock_version, 'updatedAt', saved.updated_at);
end;
$$;

create function public.cms_restore_service_revision(
  requested_service_id uuid,
  requested_revision_id uuid,
  expected_lock_version integer
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  restored public.content_entries;
  restored_snapshot jsonb;
  next_version integer;
begin
  if not public.current_user_has_permission('content.edit')
     or not public.current_user_has_permission('seo.edit') then
    raise exception 'You do not have permission to restore service versions.' using errcode = '42501';
  end if;
  select snapshot into restored_snapshot from public.content_revisions
  where id = requested_revision_id and resource_type = 'service' and resource_id = requested_service_id;
  if restored_snapshot is null then
    raise exception 'The selected service version does not exist.' using errcode = 'P0002';
  end if;
  update public.content_entries
  set draft_data = restored_snapshot -> 'content',
      title = case when status = 'draft' then restored_snapshot #>> '{content,title}' else title end,
      slug = case when status = 'draft' then restored_snapshot #>> '{content,slug}' else slug end,
      sort_order = case when status = 'draft' then (restored_snapshot #>> '{content,sortOrder}')::integer else sort_order end,
      updated_by = (select auth.uid())
  where id = requested_service_id and content_type = 'service' and lock_version = expected_lock_version
  returning * into restored;
  if restored.id is null then
    raise exception 'This service was changed in another session.' using errcode = '40001';
  end if;
  update public.seo_entries set draft_data = restored_snapshot -> 'seo'
  where content_entry_id = requested_service_id;
  delete from public.media_usages
  where content_entry_id = requested_service_id and field_key = 'service.image';
  if nullif(restored_snapshot #>> '{content,image,assetId}', '') is not null then
    insert into public.media_usages (asset_id, content_entry_id, field_key)
    values ((restored_snapshot #>> '{content,image,assetId}')::uuid, requested_service_id, 'service.image');
  end if;
  select coalesce(max(version), 0) + 1 into next_version
  from public.content_revisions where resource_type = 'service' and resource_id = requested_service_id;
  insert into public.content_revisions (resource_type, resource_id, version, snapshot, event, created_by)
  values ('service', requested_service_id, next_version, restored_snapshot, 'restored', (select auth.uid()));
  return jsonb_build_object(
    'lockVersion', restored.lock_version, 'updatedAt', restored.updated_at,
    'content', restored_snapshot -> 'content', 'seo', restored_snapshot -> 'seo'
  );
end;
$$;

revoke all on function public.cms_create_service(text, text, text, jsonb, jsonb) from public;
revoke all on function public.cms_save_service_draft(uuid, integer, jsonb, jsonb, boolean) from public;
revoke all on function public.cms_publish_service(uuid, integer, jsonb, jsonb) from public;
revoke all on function public.cms_unpublish_service(uuid, integer) from public;
revoke all on function public.cms_restore_service_revision(uuid, uuid, integer) from public;
grant execute on function public.cms_create_service(text, text, text, jsonb, jsonb) to authenticated;
grant execute on function public.cms_save_service_draft(uuid, integer, jsonb, jsonb, boolean) to authenticated;
grant execute on function public.cms_publish_service(uuid, integer, jsonb, jsonb) to authenticated;
grant execute on function public.cms_unpublish_service(uuid, integer) to authenticated;
grant execute on function public.cms_restore_service_revision(uuid, uuid, integer) to authenticated;
