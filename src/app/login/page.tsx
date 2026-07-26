import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOptionalCmsUser } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "CMS Login | Flash Tour",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [user, params] = await Promise.all([getOptionalCmsUser(), searchParams]);
  if (user) redirect("/dashboard");

  const accessDenied = params.error === "access_denied";

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#f3f6f5] text-slate-900">
      <div className="grid min-h-full lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,0.95fr)]">
        <section className="relative hidden overflow-hidden bg-[#0f172a] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute -bottom-44 -right-36 h-[32rem] w-[32rem] rounded-full bg-[#157670]/25 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#157670] text-sm font-black tracking-tight">
              FT
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">FLASH TOUR</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                Website CMS
              </p>
            </div>
          </div>

          <div className="relative max-w-xl pb-8">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#65c3bb]">
              Authorized access only
            </p>
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-0.035em] xl:text-6xl">
              Your website content,
              <span className="block text-[#f1b820]">managed with care.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-slate-300">
              A focused publishing workspace for the Flash Tour website. Content management only—no
              bookings, operations, or ERP functions.
            </p>
          </div>

          <div className="relative flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px w-10 bg-slate-600" />
            Secure CMS access
          </div>
        </section>

        <section className="flex min-h-full items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f172a] text-sm font-black text-white">
                FT
              </div>
              <div>
                <p className="font-black tracking-tight text-[#0f172a]">FLASH TOUR</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#157670]">
                  Website CMS
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#157670]">Welcome back</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a]">
                  Sign in to the CMS
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Use the email address associated with your invited CMS account.
                </p>
              </div>

              {accessDenied && (
                <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                  This account does not have active CMS access. Contact a Super Admin if you believe
                  this is an error.
                </div>
              )}

              <LoginForm nextPath={params.next} />
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Access is monitored and limited to authorized Flash Tour team members.
            </p>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              Designed &amp; Developed by Flash Software Solutions
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
