"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuthActionState } from "@/lib/auth/types";

const loginSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Enter your password."),
  next: z.string().optional(),
});

function getSafeDashboardPath(path?: string) {
  return path?.startsWith("/dashboard") && !path.startsWith("//") ? path : "/dashboard";
}

export async function login(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { status: "error", message: "The email address or password is incorrect." };
  }

  const { data: canViewCms } = await supabase.rpc("current_user_has_permission", {
    requested_permission: "cms.view",
  });

  if (!canViewCms) {
    await supabase.auth.signOut();
    return {
      status: "error",
      message: "This account does not have active CMS access.",
    };
  }

  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.nextLevel === "aal2" && assurance.currentLevel !== "aal2") {
    redirect(`/login/mfa?next=${encodeURIComponent(getSafeDashboardPath(parsed.data.next))}`);
  }

  redirect(getSafeDashboardPath(parsed.data.next));
}
