import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/cms/auth-card";
import { ForgotPasswordForm } from "./reset-request-form";

export const metadata: Metadata = {
  title: "Reset CMS Password | Flash Tour",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter your CMS email address. If an active account exists, Supabase will send a secure recovery link."
      footer={
        <Link href="/login" className="font-semibold text-[#157670] hover:underline">
          Return to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
