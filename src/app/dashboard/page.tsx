import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  FileText,
  Globe2,
  Images,
  SearchCheck,
  Settings,
  ShieldCheck,
  Ship,
  Sparkles,
  Users,
} from "lucide-react";
import { requireCmsUser } from "@/lib/auth/session";
import { getNavigationForUser } from "@/lib/auth/navigation";

export const metadata: Metadata = { title: "Dashboard" };

const modules = [
  { label: "Pages", href: "/dashboard/pages", icon: FileText, color: "bg-blue-50 text-blue-700" },
  { label: "Services", href: "/dashboard/services", icon: Sparkles, color: "bg-violet-50 text-violet-700" },
  { label: "Destinations", href: "/dashboard/destinations", icon: Globe2, color: "bg-teal-50 text-teal-700" },
  { label: "Hospitality", href: "/dashboard/hospitality", icon: Building2, color: "bg-amber-50 text-amber-700" },
  { label: "Cruises", href: "/dashboard/cruises", icon: Ship, color: "bg-cyan-50 text-cyan-700" },
  { label: "Brands", href: "/dashboard/brands", icon: Building2, color: "bg-rose-50 text-rose-700" },
  { label: "Media Library", href: "/dashboard/media", icon: Images, color: "bg-emerald-50 text-emerald-700" },
  { label: "SEO", href: "/dashboard/seo", icon: SearchCheck, color: "bg-indigo-50 text-indigo-700" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, color: "bg-slate-100 text-slate-700" },
];

export default async function DashboardPage() {
  const user = await requireCmsUser();
  const allowedLinks = new Set(getNavigationForUser(user).flatMap((group) => group.items.map((item) => item.href)));
  const visibleModules = modules.filter((module) => allowedLinks.has(module.href));

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#0f172a] px-6 py-8 text-white shadow-xl shadow-slate-900/8 sm:px-9 sm:py-10">
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#157670]/30 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#65c3bb]">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure CMS Workspace
            </div>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Welcome back, {user.displayName.split(" ")[0]}.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              The dashboard foundation is ready. Content modules are visible according to your role;
              editing and publishing controls will be activated incrementally in later phases.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#157670] text-sm font-black">
              {user.initials}
            </div>
            <div>
              <p className="text-xs text-slate-400">Current access</p>
              <p className="text-sm font-bold text-white">{user.primaryRole.name}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600">Operational</span>
          </div>
          <p className="mt-5 text-xs font-semibold text-slate-500">Authentication</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-[#0f172a]">Session protected</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">Role based</span>
          </div>
          <p className="mt-5 text-xs font-semibold text-slate-500">Permissions</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-[#0f172a]">
            {user.permissions.length} capabilities
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Active</span>
          </div>
          <p className="mt-5 text-xs font-semibold text-slate-500">Assigned roles</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-[#0f172a]">
            {user.roles.map((role) => role.name).join(", ")}
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#157670]">CMS navigation</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#0f172a]">Website modules</h2>
          </div>
          <p className="text-xs text-slate-500">Only modules allowed by your role are shown.</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleModules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 p-4 transition hover:-translate-y-0.5 hover:border-[#157670]/30 hover:shadow-lg hover:shadow-[#157670]/5"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${module.color}`}>
                <module.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#0f172a]">{module.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">Module shell ready</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-[#157670]" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
