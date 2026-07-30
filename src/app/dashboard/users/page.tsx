import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UsersManager } from "@/components/cms/users-manager";

export const metadata: Metadata = { title: "Users & Roles" };
export default async function UsersModulePage() {
  const [user, supabase] = await Promise.all([requireCmsUser(), createSupabaseServerClient()]);
  const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] = await Promise.all([
    supabase.from("profiles").select("id,display_name,email,status,user_roles!user_roles_user_id_fkey(role_id,roles!user_roles_role_id_fkey(name,key,rank))").order("created_at"),
    supabase.from("roles").select("id,name,key,rank").order("rank", { ascending: false }),
  ]);
  if (profilesError || rolesError) throw new Error(profilesError?.message ?? rolesError?.message ?? "Unable to load users.");
  return <UsersManager profiles={profiles ?? []} roles={roles ?? []} canManage={user.permissions.includes("users.manage")} />;
}
