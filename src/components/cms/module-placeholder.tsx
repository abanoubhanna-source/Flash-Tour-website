import Link from "next/link";
import { ArrowLeft, CheckCircle2, Construction } from "lucide-react";
import { requireCmsPermission } from "@/lib/auth/session";

type ModulePlaceholderProps = {
  title: string;
  description: string;
  permission?: string;
};

export async function ModulePlaceholder({
  title,
  description,
  permission = "cms.view",
}: ModulePlaceholderProps) {
  await requireCmsPermission(permission);

  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-9">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#157670]/10 text-[#157670]">
        <Construction className="h-6 w-6" />
      </div>
      <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#157670]">Module shell</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a]">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-7 flex max-w-2xl items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p>
          Authentication, route protection, and role visibility are active. Editing controls are
          intentionally not included in Phase 2.
        </p>
      </div>
      <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#157670] hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
    </section>
  );
}
