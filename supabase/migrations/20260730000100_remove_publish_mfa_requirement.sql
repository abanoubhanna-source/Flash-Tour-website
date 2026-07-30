-- Remove the aal2 (MFA-verified session) requirement for publish/purge-class
-- permissions. The dashboard has no self-service MFA enrollment flow, so any
-- account without an out-of-band-enrolled TOTP factor could never satisfy
-- this check and every publish action failed with "This action needs
-- additional permission or an MFA-verified session." Access to these actions
-- is still fully gated by role/permission grants (content.publish,
-- seo.publish, settings.publish, users.manage, content.purge, etc.) via
-- role_permissions — only the extra AAL2 requirement on top of that is
-- removed.

create or replace function public.current_user_has_permission(requested_permission text)
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
  );
$$;
