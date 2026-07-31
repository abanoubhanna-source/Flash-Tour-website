"use client";

import type { LucideIcon } from "lucide-react";

const statusStyles: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-amber-50 text-amber-700",
  archived: "bg-slate-100 text-slate-500",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusStyles[status] ?? statusStyles.draft}`}>
      {status}
    </span>
  );
}

export function TypeAvatar({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#157670]/8 text-[#157670]">
      <Icon className="h-5 w-5" />
    </div>
  );
}

export function EmptyState({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
      <Icon className="h-8 w-8 text-slate-300" />
      <p className="mt-3 text-sm font-bold text-slate-700">{label}</p>
    </div>
  );
}
