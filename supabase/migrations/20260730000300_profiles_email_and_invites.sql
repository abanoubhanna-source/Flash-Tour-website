-- The Users & Roles dashboard page could only show `display_name`, which is
-- usually blank (nothing sets it except an optional signup field), making
-- every account read as "Unnamed CMS user" with no way to tell who's who.
-- Add `email` to profiles (backfilled from auth.users, kept in sync going
-- forward by the existing handle_new_auth_user trigger) so the dashboard can
-- show a real identifier for every account, including ones invited via
-- supabase.auth.admin.inviteUserByEmail().

alter table public.profiles add column if not exists email text;

update public.profiles profile
set email = auth_user.email
from auth.users auth_user
where auth_user.id = profile.id
  and profile.email is null;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''), new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;
