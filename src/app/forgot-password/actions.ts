"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuthActionState } from "@/lib/auth/types";

const resetRequestSchema = z.object({ email: z.email().trim().toLowerCase() });

export async function requestPasswordReset(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetRequestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { status: "error", message: "Enter a valid email address." };

  const requestHeaders = await headers();
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const requestOrigin = requestHeaders.get("origin");
  const siteUrl = configuredSiteUrl ?? requestOrigin;

  if (!siteUrl) {
    return { status: "error", message: "Password recovery is not configured for this environment." };
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl.replace(/\/$/, "")}/auth/callback?next=/reset-password`,
  });

  return {
    status: "success",
    message: "If this email belongs to an active CMS account, a recovery link is on its way.",
  };
}
