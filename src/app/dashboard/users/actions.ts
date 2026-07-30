"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCmsPermission } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const assignmentSchema = z.object({ userId: z.uuid(), roleId: z.uuid() });
export async function assignCmsRole(input: unknown) {
  await requireCmsPermission("users.manage");
  const parsed = assignmentSchema.safeParse(input); if (!parsed.success) return { ok: false as const, message: "Invalid user or role." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("user_roles").upsert({ user_id: parsed.data.userId, role_id: parsed.data.roleId }, { onConflict: "user_id,role_id" });
  if (error) return { ok: false as const, message: error.message };
  revalidatePath("/dashboard/users"); return { ok: true as const, message: "Role assigned." };
}

export async function removeCmsRole(input: unknown) {
  await requireCmsPermission("users.manage");
  const parsed = assignmentSchema.safeParse(input); if (!parsed.success) return { ok: false as const, message: "Invalid user or role." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("user_roles").delete().eq("user_id", parsed.data.userId).eq("role_id", parsed.data.roleId);
  if (error) return { ok: false as const, message: error.code === "23514" ? "The last active Super Admin role cannot be removed." : error.message };
  revalidatePath("/dashboard/users"); return { ok: true as const, message: "Role removed." };
}

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  displayName: z.string().trim().max(120).default(""),
  roleId: z.uuid().nullable().default(null),
});
export async function inviteCmsUser(input: unknown) {
  await requireCmsPermission("users.manage");
  const parsed = inviteSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Enter a valid email address." };
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: { display_name: parsed.data.displayName },
  });
  if (error) return { ok: false as const, message: error.message.includes("already been registered") ? "This email is already a CMS user." : error.message };
  if (parsed.data.roleId && data.user) {
    const supabase = await createSupabaseServerClient();
    await supabase.from("user_roles").upsert({ user_id: data.user.id, role_id: parsed.data.roleId }, { onConflict: "user_id,role_id" });
  }
  revalidatePath("/dashboard/users");
  return { ok: true as const, message: `Invitation sent to ${parsed.data.email}.` };
}

const statusSchema = z.object({ userId: z.uuid(), status: z.enum(["active", "suspended"]) });
export async function updateCmsUserStatus(input: unknown) {
  await requireCmsPermission("users.manage");
  const parsed = statusSchema.safeParse(input); if (!parsed.success) return { ok: false as const, message: "Invalid user status request." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("profiles").update({ status: parsed.data.status }).eq("id", parsed.data.userId);
  if (error) return { ok: false as const, message: error.code === "23514" ? "The last active Super Admin cannot be suspended." : error.message };
  revalidatePath("/dashboard/users"); return { ok: true as const, message: `User ${parsed.data.status === "active" ? "activated" : "suspended"}.` };
}
