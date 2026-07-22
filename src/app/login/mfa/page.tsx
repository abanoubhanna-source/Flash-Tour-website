import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/cms/auth-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MfaForm } from "./mfa-form";

export const metadata: Metadata = {
  title: "Verify CMS Login | Flash Tour",
  robots: { index: false, follow: false },
};

type MfaPageProps = { searchParams: Promise<{ next?: string }> };

export default async function MfaPage({ searchParams }: MfaPageProps) {
  const supabase = await createSupabaseServerClient();
  const [params, assuranceResult, factorsResult] = await Promise.all([
    searchParams,
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    supabase.auth.mfa.listFactors(),
  ]);

  if (assuranceResult.error || factorsResult.error) redirect("/login");
  if (assuranceResult.data.currentLevel === "aal2") redirect("/dashboard");

  const factor = factorsResult.data.totp[0];
  if (!factor) redirect("/dashboard");

  return (
    <AuthCard
      eyebrow="Second factor"
      title="Verify your identity"
      description="Enter the six-digit code from your authenticator app to complete this secure CMS login."
    >
      <MfaForm factorId={factor.id} nextPath={params.next} />
    </AuthCard>
  );
}
