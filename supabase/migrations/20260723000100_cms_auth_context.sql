-- Flash Tour CMS Phase 2: authenticated CMS identity context for server rendering.

create function public.current_cms_context()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'display_name', profile.display_name,
    'status', profile.status,
    'roles', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'key', role.key,
          'name', role.name,
          'rank', role.rank
        )
        order by role.rank desc
      )
      from public.user_roles user_role
      join public.roles role on role.id = user_role.role_id
      where user_role.user_id = profile.id
    ), '[]'::jsonb),
    'permissions', coalesce((
      select jsonb_agg(permission_key order by permission_key)
      from (
        select distinct permission.key as permission_key
        from public.user_roles user_role
        join public.role_permissions role_permission
          on role_permission.role_id = user_role.role_id
        join public.permissions permission
          on permission.id = role_permission.permission_id
        where user_role.user_id = profile.id
      ) granted_permissions
    ), '[]'::jsonb)
  )
  from public.profiles profile
  where profile.id = (select auth.uid())
    and profile.status = 'active';
$$;

revoke all on function public.current_cms_context() from public;
grant execute on function public.current_cms_context() to authenticated;

comment on function public.current_cms_context() is
  'Returns the active user profile, ordered roles, and effective CMS permissions for server authorization.';
