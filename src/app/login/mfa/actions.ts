"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuthActionState } from "@/lib/auth/types";

const mfaSchema = z.object({
  factorId: z.uuid(),
  code: z.string().regex(/^\d{6}$/),
  next: z.string().optional(),
});

function getSafeDashboardPath(path?: string) {
  return path?.startsWith("/dashboard") && !path.startsWith("//") ? path : "/dashboard";
}

export async function verifyMfa(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = mfaSchema.safeParse({
    factorId: formData.get("factorId"),
    code: formData.get("code"),
    next: formData.get("next"),
  });
  if (!parsed.success) return { status: "error", message: "Enter a valid six-digit code." };

  const supabase = await createSupabaseServerClient();
  const { data: factors, error: factorError } = await supabase.auth.mfa.listFactors();
  const factorBelongsToUser = factors?.totp.some((factor) => factor.id === parsed.data.factorId);

  if (factorError || !factorBelongsToUser) {
    return { status: "error", message: "The authentication factor is not available." };
  }

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: parsed.data.factorId,
    code: parsed.data.code,
  });

  if (error) return { status: "error", message: "The authentication code is incorrect or expired." };
  redirect(getSafeDashboardPath(parsed.data.next));
}
