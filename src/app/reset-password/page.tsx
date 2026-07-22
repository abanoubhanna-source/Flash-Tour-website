import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/cms/auth-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Choose CMS Password | Flash Tour",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <AuthCard
      eyebrow="Secure your account"
      title="Choose a new password"
      description="Use at least 12 characters with uppercase, lowercase, numbers, and symbols."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
