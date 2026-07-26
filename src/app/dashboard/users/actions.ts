"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCmsPermission } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const assignmentSchema = z.object({ userId: z.uuid(), roleId: z.uuid() });
export async function assignCmsRole(input: unknown) {
  await requireCmsPermission("users.manage");
  const parsed = assignmentSchema.safeParse(input); if (!parsed.success) return { ok: false as const, message: "Invalid user or role." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("user_roles").upsert({ user_id: parsed.data.userId, role_id: parsed.data.roleId }, { onConflict: "user_id,role_id" });
  if (error) return { ok: false as const, message: error.message };
  revalidatePath("/dashboard/users"); return { ok: true as const, message: "Role assigned." };
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
