"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  ChevronRight,
  FileText,
  Globe2,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  SearchCheck,
  Settings,
  Ship,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import type { CmsNavigationGroup, CmsNavigationIcon } from "@/lib/auth/navigation";
import type { CmsUser } from "@/lib/auth/types";
import { logout } from "@/app/dashboard/actions";

const routeTitles: Record<string, { title: string; description: string }> = {
  "/dashboard": { title: "Dashboard", description: "Website content workspace" },
  "/dashboard/pages": { title: "Pages", description: "Manage fixed website page content" },
  "/dashboard/services": { title: "Services", description: "Manage the services collection" },
  "/dashboard/destinations": { title: "Destinations", description: "Manage destination content" },
  "/dashboard/hospitality": { title: "Hospitality", description: "Manage hospitality content" },
  "/dashboard/cruises": { title: "Cruises", description: "Manage cruise content" },
  "/dashboard/brands": { title: "Brands", description: "Manage the brand collection" },
  "/dashboard/media": { title: "Media Library", description: "Manage website images and assets" },
  "/dashboard/seo": { title: "SEO", description: "Manage search and social metadata" },
  "/dashboard/settings": { title: "Website Settings", description: "Manage global website information" },
  "/dashboard/users": { title: "Users", description: "Manage CMS access and roles" },
};

const navigationIcons: Record<CmsNavigationIcon, typeof LayoutDashboard> = {
  building: Building2,
  dashboard: LayoutDashboard,
  file: FileText,
  globe: Globe2,
  images: Images,
  search: SearchCheck,
  settings: Settings,
  ship: Ship,
  sparkles: Sparkles,
  users: Users,
};

type DashboardShellProps = {
  user: CmsUser;
  navigation: CmsNavigationGroup[];
  children: React.ReactNode;
};

function isCurrentRoute(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

export function DashboardShell({ user, navigation, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pageDetails = routeTitles[pathname] ?? routeTitles["/dashboard"];

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className={`flex h-20 items-center border-b border-white/8 ${collapsed ? "justify-center px-3" : "justify-between px-6"}`}>
        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex min-w-0 items-center gap-3" aria-label="Flash Tour CMS dashboard">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#157670] text-xs font-black text-white shadow-lg shadow-[#157670]/20">
            FT
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-tight text-white">FLASH TOUR</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.23em] text-[#65c3bb]">Website CMS</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-white/8 hover:text-white lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="CMS navigation">
        <div className="space-y-7">
          {navigation.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isCurrentRoute(pathname, item.href);
                  const Icon = navigationIcons[item.icon];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`group flex h-11 items-center rounded-xl text-sm font-semibold transition ${
                        collapsed ? "justify-center px-2" : "gap-3 px-3"
                      } ${
                        active
                          ? "bg-[#157670] text-white shadow-md shadow-[#157670]/15"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/8 p-3">
        {!collapsed && (
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xs font-black text-white">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">{user.displayName}</p>
              <p className="truncate text-[10px] text-slate-400">{user.primaryRole.name}</p>
            </div>
          </div>
        )}
        <form action={logout}>
          <button
            type="submit"
            title={collapsed ? "Sign out" : undefined}
            className={`flex h-10 w-full items-center rounded-xl text-xs font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-300 ${collapsed ? "justify-center" : "gap-3 px-3"}`}
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!collapsed && "Sign out"}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#f2f5f4] text-slate-900">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[282px] bg-[#0f172a] shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[82px]" : "lg:w-[282px]"}`}
      >
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 lg:flex"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg! leading-tight! font-semibold tracking-[-0.02em] text-[#0f172a] sm:text-xl!">
                {pageDetails.title}
              </h1>
              <p className="hidden truncate text-xs text-slate-500 sm:block">{pageDetails.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> CMS Online
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
              <div className="hidden text-right md:block">
                <p className="max-w-48 truncate text-xs font-bold text-[#0f172a]">{user.displayName}</p>
                <p className="text-[10px] font-semibold text-[#157670]">{user.primaryRole.name}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f172a] text-xs font-black text-white">
                {user.initials}
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1540px] p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
