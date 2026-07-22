begin;

create extension if not exists pgtap with schema extensions;
select plan(25);

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

set local role anon;
select is(
  (select count(*)::integer from public.published_content_entries),
  1,
  'anonymous visitors see only published entries'
);
select is(
  (select data ->> 'description' from public.published_content_entries limit 1),
  'public copy',
  'the public projection exposes published data'
);
select throws_ok(
  $$ select draft_data from public.content_entries $$,
  '42501',
  'permission denied for table content_entries',
  'anonymous visitors cannot read the draft table'
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
select throws_ok(
  $$ update public.content_entries set published_data = '{"description":"unauthorized"}' where id = '20000000-0000-0000-0000-000000000001' $$,
  '42501',
  'Publishing permission is required to change published content.',
  'editor cannot change published content'
);
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
select ok(not public.current_user_has_permission('content.publish'), 'administrator publishing requires AAL2');

select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000003","role":"authenticated","aal":"aal2"}',
  true
);
select ok(public.current_user_has_permission('content.publish'), 'AAL2 administrator can publish');
select ok(public.current_user_has_permission('users.manage'), 'AAL2 administrator can manage ordinary users');
select lives_ok(
  $$ update public.content_entries set published_data = '{"description":"authorized update"}' where id = '20000000-0000-0000-0000-000000000001' $$,
  'AAL2 administrator can update published content'
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
