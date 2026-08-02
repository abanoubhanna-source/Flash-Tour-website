begin;

create extension if not exists pgtap with schema extensions;
select plan(69);

select is((select count(*)::integer from public.roles), 4, 'four system roles are seeded');
select is((select count(*)::integer from public.permissions), 22, 'the permission catalog is seeded');

insert into auth.users (id, email, raw_user_meta_data) values
  ('10000000-0000-0000-0000-000000000001', 'viewer@example.test', '{"display_name":"Viewer"}'),
  ('10000000-0000-0000-0000-000000000002', 'editor@example.test', '{"display_name":"Editor"}'),
  ('10000000-0000-0000-0000-000000000003', 'admin@example.test', '{"display_name":"Administrator"}'),
  ('10000000-0000-0000-0000-000000000004', 'super@example.test', '{"display_name":"Super Admin"}');

insert into public.user_roles (user_id, role_id)
select '10000000-0000-0000-0000-000000000001'::uuid, id from public.roles where key = 'viewer'
union all
select '10000000-0000-0000-0000-000000000002'::uuid, id from public.roles where key = 'editor'
union all
select '10000000-0000-0000-0000-000000000003'::uuid, id from public.roles where key = 'administrator'
union all
select '10000000-0000-0000-0000-000000000004'::uuid, id from public.roles where key = 'super_admin';

insert into public.content_entries (
  id, content_type, slug, title, status, draft_data, published_data, published_at
) values (
  '20000000-0000-0000-0000-000000000001',
  'service',
  'published-service',
  'Published Service',
  'published',
  '{"description":"private draft"}',
  '{"description":"public copy"}',
  now()
), (
  '20000000-0000-0000-0000-000000000002',
  'service',
  'draft-service',
  'Draft Service',
  'draft',
  '{"description":"draft only"}',
  null,
  null
);

select is(
  (
    select count(*)::integer from public.content_entries
    where content_type = 'service'
      and id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  ),
  13,
  'the pre-seeded services use RFC-4122-valid ids (correct version/variant nibbles), as required by z.uuid() in actions.ts'
);

-- Computed while still superuser: anon can only read the published_* views,
-- not the raw content_entries table, so the expected count must be captured
-- before switching roles. A session-level GUC (rather than a temp table)
-- sidesteps any question of whether anon would have SELECT on the table
-- that captured it.
select set_config(
  'test.expected_published_count',
  (select count(*)::text from public.content_entries
     where status = 'published' and is_active and published_data is not null),
  false
);

set local role anon;
select is(
  (select count(*)::integer from public.published_content_entries),
  current_setting('test.expected_published_count')::integer,
  'anonymous visitors see all and only published entries'
);
select is(
  (select data ->> 'description' from public.published_content_entries where slug = 'published-service'),
  'public copy',
  'the public projection exposes published data'
);
select is(
  (select count(*)::integer from public.published_content_entries where id::text like '32000000-%'),
  13,
  'the existing public services are migrated without omissions'
);
select is((select count(*)::integer from public.published_content_entries where content_type='destination'),5,'five JSON destinations are migrated as published content');
select throws_ok(
  $$ select draft_data from public.content_entries $$,
  '42501',
  'permission denied for table content_entries',
  'anonymous visitors cannot read the draft table'
);
select is(
  (select count(*)::integer from public.published_pages where path = '/'),
  1,
  'the seeded home page is publicly visible'
);
select is(
  (
    select data ->> 'title'
    from public.published_page_sections
    where page_id = (select id from public.published_pages where key = 'home' and locale = 'en') and key = 'hero'
  ),
  'Crafting Hospitality Since 1985',
  'the seeded public hero matches the frozen website copy'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated","aal":"aal1"}',
  true
);
select ok(public.current_user_has_permission('cms.view'), 'viewer can access the CMS');
select ok(not public.current_user_has_permission('content.edit'), 'viewer cannot edit content');
select is(
  public.current_cms_context() ->> 'display_name',
  'Viewer',
  'CMS context returns the active profile'
);
select ok(
  public.current_cms_context() -> 'permissions' @> '["cms.view"]'::jsonb,
  'CMS context returns effective navigation permissions'
);
select throws_ok(
  $$ insert into public.content_entries (content_type, slug, title) values ('service', 'viewer-write', 'Denied') $$,
  '42501',
  null,
  'viewer cannot create content'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000002","role":"authenticated","aal":"aal1"}',
  true
);
select ok(public.current_user_has_permission('content.edit'), 'editor can edit drafts');
select ok(not public.current_user_has_permission('content.publish'), 'editor cannot publish');
select lives_ok(
  $$ insert into public.content_entries (content_type, slug, title, created_by) values ('service', 'editor-draft', 'Allowed', '10000000-0000-0000-0000-000000000002') $$,
  'editor can create a draft'
);
select lives_ok(
  $$
    select public.cms_create_service(
      'CMS Test Service', 'cms-test-service', 'en',
      '{"title":"CMS Test Service","slug":"cms-test-service","description":"Draft copy","image":{"assetId":null,"url":"/images/services-hero.jpg","alt":"CMS Test Service"},"eyebrow":"Service","iconKey":"globe","sortOrder":0}',
      '{"title":"CMS Test Service | Flash Group","description":"Draft copy","canonicalPath":"/services","ogImage":"/images/services-hero.jpg"}'
    )
  $$,
  'editor can create a complete service draft'
);
select is(
  (select status from public.content_entries where slug = 'cms-test-service'),
  'draft'::public.content_status,
  'new CMS services start as drafts'
);
select lives_ok(
  $$
    select public.cms_save_service_draft(
      (select id from public.content_entries where slug = 'cms-test-service'), 1,
      '{"title":"CMS Test Service","slug":"cms-test-service","description":"Updated draft copy","image":{"assetId":null,"url":"/images/services-hero.jpg","alt":"CMS Test Service"},"eyebrow":"Service","iconKey":"globe","sortOrder":140}',
      '{"title":"CMS Test Service | Flash Group","description":"Updated draft copy","canonicalPath":"/services","ogImage":"/images/services-hero.jpg"}',
      true
    )
  $$,
  'editor can autosave service content and SEO atomically'
);
select is(
  (select draft_data ->> 'description' from public.content_entries where slug = 'cms-test-service'),
  'Updated draft copy',
  'service autosave changes only the draft content'
);
select lives_ok(
  $$
    select public.cms_save_service_draft(
      (select id from public.content_entries where slug = 'airport-services'), 1,
      (select draft_data || '{"description":"Updated airport services copy."}'::jsonb from public.content_entries where slug = 'airport-services'),
      (select draft_data from public.seo_entries where content_entry_id = (select id from public.content_entries where slug = 'airport-services')),
      false
    )
  $$,
  'editor can autosave a pre-seeded, JSON-migrated service (regression: seed ids must be valid RFC-4122 UUIDs, not just freshly-created ones)'
);
select is(
  (select draft_data ->> 'description' from public.content_entries where slug = 'airport-services'),
  'Updated airport services copy.',
  'autosave on the pre-seeded, JSON-migrated service updates draft content'
);
select throws_ok(
  $$
    select public.cms_publish_service(
      (select id from public.content_entries where slug = 'cms-test-service'), 2,
      (select draft_data from public.content_entries where slug = 'cms-test-service'),
      (select draft_data from public.seo_entries where content_entry_id = (select id from public.content_entries where slug = 'cms-test-service'))
    )
  $$,
  '42501',
  'Publishing requires an authorized MFA session.',
  'editor cannot publish a service'
);
select lives_ok(
  $$
    select public.cms_create_page(
      'Test Page',
      '/test-page',
      'test_page',
      'en',
      '{"title":"Test Page","subtitle":"Draft","eyebrow":"","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/egypt-bg.jpg","alt":""}}',
      '{"title":"Test Page","description":"Draft","canonicalPath":"/test-page","ogImage":""}'
    )
  $$,
  'editor can create a complete page draft'
);
select is(
  (select enabled from public.pages where key = 'test_page'),
  false,
  'new CMS pages start as drafts'
);
select lives_ok(
  $$
    select public.cms_save_page_draft(
      (select id from public.pages where key = 'test_page'),
      1,
      '{"title":"Updated Draft","subtitle":"Draft","eyebrow":"","primaryCta":{"label":"","href":""},"secondaryCta":{"label":"","href":""},"image":{"assetId":null,"url":"/images/egypt-bg.jpg","alt":""}}',
      '{"title":"Updated Draft","description":"Draft","canonicalPath":"/test-page","ogImage":""}',
      true
    )
  $$,
  'editor can autosave page and SEO drafts atomically'
);
select is(
  (select draft_data ->> 'title' from public.page_sections where page_id = (select id from public.pages where key = 'test_page') and key = 'hero'),
  'Updated Draft',
  'autosave updates only the page draft'
);
select throws_ok(
  $$
    select public.cms_publish_page(
      (select id from public.pages where key = 'test_page'),
      2,
      (select draft_data from public.page_sections where page_id = (select id from public.pages where key = 'test_page') and key = 'hero'),
      (select draft_data from public.seo_entries where page_id = (select id from public.pages where key = 'test_page'))
    )
  $$,
  '42501',
  'Publishing requires an authorized MFA session.',
  'editor cannot publish a page'
);
select throws_ok(
  $$ update public.content_entries set published_data = '{"description":"unauthorized"}' where id = '20000000-0000-0000-0000-000000000001' $$,
  '42501',
  'Publishing permission is required to change published content.',
  'editor cannot change published content'
);
select lives_ok($$select public.cms_create_destination('Test Destination','test-destination','en','{"name":"Test Destination","slug":"test-destination","subtitle":"Draft","description":"Draft destination","iconKey":"Compass","sortOrder":0,"hero":{"eyebrow":"Test","title":"Test","accentTitle":"Destination","subtitle":"Draft hero","image":{"assetId":null,"url":"/images/egypt-bg.jpg","alt":"Test"}},"country":{"code":"TT","region":"Test","officeLabel":"Test office"},"highlights":[],"gallery":[]}','{"title":"Test Destination","description":"Draft","keywords":["test"],"canonicalUrl":"/destinations/test-destination","openGraph":{"title":"Test","description":"Draft","image":""}}')$$,'editor can create a destination draft');
select is((select status from public.content_entries where slug='test-destination'),'draft'::public.content_status,'new destinations start as drafts');
select lives_ok($$select public.cms_save_destination_draft((select id from public.content_entries where slug='test-destination'),1,(select draft_data||'{"description":"Updated destination draft"}'::jsonb from public.content_entries where slug='test-destination'),(select draft_data from public.seo_entries where content_entry_id=(select id from public.content_entries where slug='test-destination')),true)$$,'editor can autosave destination and SEO');
select is((select draft_data->>'description' from public.content_entries where slug='test-destination'),'Updated destination draft','destination autosave updates draft only');
select throws_ok($$select public.cms_publish_destination((select id from public.content_entries where slug='test-destination'),2,(select draft_data from public.content_entries where slug='test-destination'),(select draft_data from public.seo_entries where content_entry_id=(select id from public.content_entries where slug='test-destination')))$$,'42501','Publishing requires an authorized MFA session.','editor cannot publish a destination');
select throws_ok(
  $$ insert into public.content_entries (content_type, slug, title, status, published_data) values ('service', 'editor-published', 'Denied', 'published', '{}') $$,
  '42501',
  'Publishing permission is required to create published content.',
  'editor cannot bypass publishing through an insert'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000003","role":"authenticated","aal":"aal1"}',
  true
);
select ok(public.current_user_has_permission('content.publish'), 'administrator can publish without an MFA-verified session');

select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000003","role":"authenticated","aal":"aal2"}',
  true
);
select ok(public.current_user_has_permission('content.publish'), 'administrator can also publish under an aal2 session');
select ok(public.current_user_has_permission('users.manage'), 'AAL2 administrator can manage ordinary users');
select lives_ok(
  $$ update public.content_entries set published_data = '{"description":"authorized update"}' where id = '20000000-0000-0000-0000-000000000001' $$,
  'AAL2 administrator can update published content'
);
select lives_ok(
  $$
    select public.cms_publish_page(
      (select id from public.pages where key = 'test_page'),
      2,
      (select draft_data from public.page_sections where page_id = (select id from public.pages where key = 'test_page') and key = 'hero'),
      (select draft_data from public.seo_entries where page_id = (select id from public.pages where key = 'test_page'))
    )
  $$,
  'AAL2 administrator can publish a page draft'
);
select lives_ok(
  $$
    select public.cms_publish_service(
      (select id from public.content_entries where slug = 'cms-test-service'), 2,
      (select draft_data from public.content_entries where slug = 'cms-test-service'),
      (select draft_data from public.seo_entries where content_entry_id = (select id from public.content_entries where slug = 'cms-test-service'))
    )
  $$,
  'AAL2 administrator can publish a service draft'
);
select is(
  (select data ->> 'description' from public.published_content_entries where slug = 'cms-test-service'),
  'Updated draft copy',
  'service publishing exposes the validated draft projection'
);
select lives_ok($$select public.cms_publish_destination((select id from public.content_entries where slug='test-destination'),2,(select draft_data from public.content_entries where slug='test-destination'),(select draft_data from public.seo_entries where content_entry_id=(select id from public.content_entries where slug='test-destination')))$$,'AAL2 administrator can publish a destination');
select is((select data->>'description' from public.published_content_entries where slug='test-destination'),'Updated destination draft','published destination projection exposes validated data');
select lives_ok($$select public.cms_archive_destination((select id from public.content_entries where slug='test-destination'),3)$$,'authorized editor can soft delete a destination');
select is((select count(*)::integer from public.published_content_entries where slug='test-destination'),0,'soft-deleted destinations disappear publicly');
select is((select count(*)::integer from public.content_entries where slug='test-destination' and status='archived'),1,'soft delete preserves the destination record');
select lives_ok(
  $$
    select public.cms_restore_service_revision(
      (select id from public.content_entries where slug = 'cms-test-service'),
      (select id from public.content_revisions where resource_type = 'service' and resource_id = (select id from public.content_entries where slug = 'cms-test-service') and version = 1),
      3
    )
  $$,
  'an authorized editor can restore a previous service version to draft'
);
select is(
  (select draft_data ->> 'description' from public.content_entries where slug = 'cms-test-service'),
  'Draft copy',
  'restoring service history changes the draft content'
);
select is(
  (select data ->> 'description' from public.published_content_entries where slug = 'cms-test-service'),
  'Updated draft copy',
  'restoring a service draft does not change the live projection'
);
select is(
  (
    select data ->> 'title'
    from public.published_page_sections
    where page_id = (select id from public.pages where key = 'test_page') and key = 'hero'
  ),
  'Updated Draft',
  'publishing copies the draft into the public projection'
);
select is(
  (
    select count(*)::integer
    from public.content_revisions
    where resource_type = 'page' and resource_id = (select id from public.pages where key = 'test_page')
  ),
  3,
  'create, manual save, and publish produce basic version history'
);
select lives_ok(
  $$
    select public.cms_restore_page_revision(
      (select id from public.pages where key = 'test_page'),
      (
        select id from public.content_revisions
        where resource_type = 'page'
          and resource_id = (select id from public.pages where key = 'test_page')
          and version = 1
      ),
      3
    )
  $$,
  'an authorized editor can restore a previous page version to draft'
);
select is(
  (select draft_data ->> 'title' from public.page_sections where page_id = (select id from public.pages where key = 'test_page') and key = 'hero'),
  'Test Page',
  'restoring history changes the draft without republishing'
);

select lives_ok(
  $$
    select public.cms_save_about_draft(
      (select id from public.pages where key = 'about'),
      (select lock_version from public.pages where key = 'about'),
      jsonb_build_object(
        'hero_intro',
        (select draft_data from public.page_sections where page_id = (select id from public.pages where key = 'about') and key = 'hero_intro') || '{"title":"Updated About Title"}'::jsonb
      ),
      (select draft_data from public.seo_entries where page_id = (select id from public.pages where key = 'about')),
      true
    )
  $$,
  'an authorized editor can autosave a subset of About page sections'
);
select is(
  (select draft_data ->> 'title' from public.page_sections where page_id = (select id from public.pages where key = 'about') and key = 'hero_intro'),
  'Updated About Title',
  'About draft save updates only the section keys provided'
);
select is(
  (select draft_data ->> 'title' from public.page_sections where page_id = (select id from public.pages where key = 'about') and key = 'experience'),
  '40 Years of Experience',
  'About draft save leaves sections outside the payload untouched'
);
select lives_ok(
  $$
    select public.cms_publish_about_page(
      (select id from public.pages where key = 'about'),
      (select lock_version from public.pages where key = 'about'),
      jsonb_build_object(
        'hero_intro',
        (select draft_data from public.page_sections where page_id = (select id from public.pages where key = 'about') and key = 'hero_intro')
      ),
      (select draft_data from public.seo_entries where page_id = (select id from public.pages where key = 'about'))
    )
  $$,
  'an authorized editor can publish a subset of About page sections'
);
select is(
  (select published_data ->> 'title' from public.page_sections where page_id = (select id from public.pages where key = 'about') and key = 'hero_intro'),
  'Updated About Title',
  'publishing About copies the given section drafts into the published projection'
);
select lives_ok(
  $$
    select public.cms_restore_about_revision(
      (select id from public.pages where key = 'about'),
      (
        select id from public.content_revisions
        where resource_type = 'page'
          and resource_id = (select id from public.pages where key = 'about')
        order by version desc
        limit 1
      ),
      (select lock_version from public.pages where key = 'about')
    )
  $$,
  'an authorized editor can restore a previous About page version to draft'
);

select is(
  (select lock_version from public.content_entries where id = '20000000-0000-0000-0000-000000000001'),
  2,
  'content updates increment the optimistic lock version'
);
select ok(
  not public.current_user_can_assign_role((select id from public.roles where key = 'administrator')),
  'administrator cannot assign administrator roles'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000004","role":"authenticated","aal":"aal2"}',
  true
);
select ok(public.current_user_has_permission('content.purge'), 'AAL2 super admin can purge content');
select ok(
  public.current_user_can_assign_role((select id from public.roles where key = 'super_admin')),
  'super admin can assign super admin roles'
);
select lives_ok(
  $$
    insert into public.user_roles (user_id, role_id)
    values ('10000000-0000-0000-0000-000000000001', (select id from public.roles where key = 'viewer'))
    on conflict (user_id, role_id) do update set user_id = excluded.user_id
  $$,
  'assigning a role the user already has (upsert conflict path) does not require extra grants'
);

reset role;
select throws_ok(
  $$ delete from public.user_roles where user_id = '10000000-0000-0000-0000-000000000004' $$,
  '23514',
  'The last Super Admin role assignment cannot be removed.',
  'the final Super Admin assignment is protected'
);

update public.profiles
set status = 'suspended'
where id = '10000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated","aal":"aal1"}',
  true
);
select is(public.current_cms_context(), null::jsonb, 'suspended users receive no CMS context');

select * from finish();
rollback;
