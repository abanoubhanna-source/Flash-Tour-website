-- Allow authorized user managers to activate/suspend profiles while protecting the last active Super Admin.
create or replace function public.protect_last_active_super_admin()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  super_admin_role_id uuid;
begin
  if old.status = 'active' and new.status = 'suspended' then
    select id into super_admin_role_id from public.roles where key = 'super_admin';
    if exists (select 1 from public.user_roles where user_id = old.id and role_id = super_admin_role_id)
      and (select count(*) from public.profiles p join public.user_roles ur on ur.user_id = p.id where p.status = 'active' and ur.role_id = super_admin_role_id) <= 1 then
      raise exception 'Cannot suspend the last active Super Admin.' using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_last_active_super_admin on public.profiles;
create trigger profiles_protect_last_active_super_admin
before update of status on public.profiles
for each row execute function public.protect_last_active_super_admin();

create policy "user managers can update profile status" on public.profiles
for update to authenticated
using (public.current_user_has_permission('users.manage'))
with check (public.current_user_has_permission('users.manage'));
