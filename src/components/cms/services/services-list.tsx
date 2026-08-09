"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { ArrowRight, BriefcaseBusiness, Plus, Search, Trash2, X } from "lucide-react";
import { createService, deleteService, type CreateServiceState } from "@/app/dashboard/services/actions";
import type { CmsServiceSummary } from "@/lib/cms/services/types";
import { EmptyState, StatusBadge, TypeAvatar } from "@/components/cms/collections/list-ui";
import { useConfirm } from "@/components/cms/confirm-dialog";

const initialState: CreateServiceState = { status: "idle" };
type Props = { services: CmsServiceSummary[]; canCreate: boolean; canEdit: boolean; canDelete: boolean };

export function ServicesList({ services, canCreate, canEdit, canDelete }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [state, action, createPending] = useActionState(createService, initialState);
  const { confirm, dialog } = useConfirm();
  useEffect(() => { if (state.serviceId) router.push(`/dashboard/services/${state.serviceId}`); }, [router, state.serviceId]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? services.filter((item) => item.title.toLowerCase().includes(term) || item.slug.includes(term)) : services;
  }, [query, services]);

  async function handleDelete(service: CmsServiceSummary) {
    if (!(await confirm(`Permanently delete "${service.title}"?`))) return;
    setDeletingId(service.id);
    startTransition(async () => {
      const result = await deleteService(service.id);
      setNotice(result.message); setDeletingId(null);
      if (result.ok) router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px]! font-bold uppercase tracking-[0.16em] text-[#157670]">Website collection</p>
            <h2 className="mt-1 text-2xl! font-bold text-slate-900">Services</h2>
            <p className="mt-1 text-sm! text-slate-500">Manage the services shown on the public website.</p>
          </div>
          {canCreate && <button type="button" onClick={() => setCreateOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white hover:bg-[#105f5a]"><Plus className="h-4 w-4" /> New service</button>}
        </div>
        <div className="relative mt-5 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services…" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
        </div>
        {notice && <p role="status" className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-700">{notice}</p>}
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <EmptyState icon={BriefcaseBusiness} label="No services found" />
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((service) => (
              <article key={service.id} className="flex flex-col gap-4 p-4 hover:bg-slate-50/70 sm:flex-row sm:items-center sm:p-5">
                <TypeAvatar icon={BriefcaseBusiness} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm! font-bold text-slate-900">{service.title}</h3><StatusBadge status={service.status} /></div>
                  <p className="mt-1 font-mono text-[10px]! text-slate-500">{service.slug} · order {service.sortOrder}</p>
                </div>
                <div className="flex items-center gap-2">
                  {canDelete && <button type="button" disabled={pending && deletingId === service.id} onClick={() => handleDelete(service)} aria-label={`Delete ${service.title}`} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>}
                  <Link href={`/dashboard/services/${service.id}`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-700 hover:border-[#157670]/30 hover:text-[#157670]">{canEdit ? "Edit" : "View"}<ArrowRight className="h-4 w-4" /></Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="new-service-title">
          <form action={action} className="w-full max-w-lg rounded-t-[1.75rem] bg-white p-6 shadow-2xl sm:rounded-[1.75rem]">
            <div className="flex items-center justify-between"><h2 id="new-service-title" className="text-xl! font-bold text-slate-900">New service</h2><button type="button" onClick={() => setCreateOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500"><X className="h-4 w-4" /></button></div>
            <div className="mt-5 space-y-4">
              <label className="block text-xs font-bold text-slate-700">Title<input name="title" required maxLength={120} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-normal outline-none focus:border-[#157670]" /></label>
              <label className="block text-xs font-bold text-slate-700">Slug<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="private-transfers" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 font-mono text-sm font-normal outline-none focus:border-[#157670]" /></label>
              <input type="hidden" name="locale" value="en" />
              {state.message && <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700">{state.message}</p>}
            </div>
            <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setCreateOpen(false)} className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-600">Cancel</button><button disabled={createPending} className="h-10 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white disabled:opacity-50">{createPending ? "Creating…" : "Create draft"}</button></div>
          </form>
        </div>
      )}
      {dialog}
    </div>
  );
}
