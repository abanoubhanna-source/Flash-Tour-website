-- assignCmsRole() upserts into user_roles (insert ... on conflict (user_id,
-- role_id) do update) so that re-assigning a role a user already has is a
-- harmless no-op instead of a duplicate-key error. Postgres requires UPDATE
-- privilege for the ON CONFLICT DO UPDATE clause even when no conflict ends
-- up occurring, but only insert/delete were ever granted on this table —
-- every upsert failed with "permission denied for table user_roles".

grant update on public.user_roles to authenticated;

create policy "user managers can update assignments" on public.user_roles for update to authenticated
using (public.current_user_can_assign_role(role_id))
with check (public.current_user_can_assign_role(role_id));
