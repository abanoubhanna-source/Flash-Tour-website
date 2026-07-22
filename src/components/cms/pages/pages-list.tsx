"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { ArrowRight, FileText, Globe2, MoreHorizontal, Plus, Search, Trash2, X } from "lucide-react";
import { createPage, deletePage, type CreatePageState } from "@/app/dashboard/pages/actions";
import type { CmsPageSummary } from "@/lib/cms/pages/types";

const initialCreateState: CreatePageState = { status: "idle" };

type PagesListProps = {
  pages: CmsPageSummary[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PagesList({ pages, canCreate, canEdit, canDelete }: PagesListProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [menuPageId, setMenuPageId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();
  const [createState, createAction, createPending] = useActionState(createPage, initialCreateState);

  useEffect(() => {
    if (createState.pageId) router.push(`/dashboard/pages/${createState.pageId}`);
  }, [createState.pageId, router]);

  const filteredPages = pages.filter((page) =>
    `${page.name} ${page.path} ${page.key}`.toLowerCase().includes(query.toLowerCase()),
  );

  function handleDelete(page: CmsPageSummary) {
    if (!window.confirm(`Permanently delete “${page.name}”? This cannot be undone.`)) return;
    startDelete(async () => {
      const result = await deletePage(page.id);
      setMessage(result.message);
      setMenuPageId(null);
      if (result.ok) router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#157670]/8 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#157670]">
            <Globe2 className="h-3.5 w-3.5" /> Website structure
          </div>
          <h2 className="text-3xl! leading-tight! font-semibold tracking-[-0.035em] text-[#0f172a]">Pages</h2>
          <p className="mt-2 text-sm! leading-6! text-slate-500">
            Manage page hero content, calls to action, SEO, publishing, and revisions.
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-5 text-sm font-bold text-white transition hover:bg-[#157670]"
          >
            <Plus className="h-4 w-4" /> New page
          </button>
        )}
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pages"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#157670] focus:bg-white focus:ring-4 focus:ring-[#157670]/8"
            />
          </div>
          <span className="text-xs text-slate-500">{filteredPages.length} page{filteredPages.length === 1 ? "" : "s"}</span>
        </div>

        {message && (
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-700" role="status">
            {message}
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {filteredPages.map((page) => (
            <article key={page.id} className="group flex items-center gap-4 p-4 transition hover:bg-slate-50/70 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base! leading-6! font-bold text-[#0f172a]">{page.name}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${page.enabled ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {page.enabled ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="font-mono">{page.path}</span>
                  <span className="hidden sm:inline">Updated {formatDate(page.updatedAt)}</span>
                </div>
              </div>

              {canEdit ? (
                <Link
                  href={`/dashboard/pages/${page.id}`}
                  className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-700 transition hover:border-[#157670]/40 hover:text-[#157670] sm:inline-flex"
                >
                  Edit <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <Link href={`/dashboard/pages/${page.id}`} className="text-xs font-bold text-[#157670]">View</Link>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuPageId(menuPageId === page.id ? null : page.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:text-slate-700 hover:shadow-sm"
                  aria-label={`Page actions for ${page.name}`}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {menuPageId === page.id && (
                  <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                    <Link href={`/dashboard/pages/${page.id}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      <FileText className="h-4 w-4" /> {canEdit ? "Edit page" : "View page"}
                    </Link>
                    {canDelete && (
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(page)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" /> Delete permanently
                      </button>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}

          {filteredPages.length === 0 && (
            <div className="px-5 py-16 text-center">
              <FileText className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-4 text-sm! font-semibold text-slate-700">No pages found</p>
              <p className="mt-1 text-xs! text-slate-500">Try another search or create a new page.</p>
            </div>
          )}
        </div>
      </section>

      {createOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <button type="button" className="absolute inset-0" onClick={() => setCreateOpen(false)} aria-label="Close new page dialog" />
          <div role="dialog" aria-modal="true" aria-labelledby="new-page-title" className="relative z-10 w-full max-w-lg rounded-t-[1.75rem] bg-white p-6 shadow-2xl sm:rounded-[1.75rem] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px]! font-bold uppercase tracking-[0.16em] text-[#157670]">Website page</p>
                <h2 id="new-page-title" className="mt-2 text-2xl! leading-tight! font-semibold text-[#0f172a]">Create a new page</h2>
              </div>
              <button type="button" onClick={() => setCreateOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100" aria-label="Close dialog">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={createAction} className="mt-6 space-y-4">
              {createState.message && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{createState.message}</div>}
              <label className="block text-xs font-bold text-slate-700">
                Internal page name
                <input name="name" required maxLength={80} placeholder="Corporate overview" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-normal outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                {createState.fieldErrors?.name?.[0] && <span className="mt-1 block text-xs font-normal text-red-600">{createState.fieldErrors.name[0]}</span>}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold text-slate-700">
                  Website path
                  <input name="path" required placeholder="/corporate" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 font-mono text-sm font-normal outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                  {createState.fieldErrors?.path?.[0] && <span className="mt-1 block text-xs font-normal text-red-600">{createState.fieldErrors.path[0]}</span>}
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  System key
                  <input name="key" required placeholder="corporate" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 font-mono text-sm font-normal outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                  {createState.fieldErrors?.key?.[0] && <span className="mt-1 block text-xs font-normal text-red-600">{createState.fieldErrors.key[0]}</span>}
                </label>
              </div>
              <input type="hidden" name="locale" value="en" />
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setCreateOpen(false)} className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={createPending} className="h-11 rounded-xl bg-[#0f172a] px-5 text-sm font-bold text-white hover:bg-[#157670] disabled:opacity-50">
                  {createPending ? "Creating…" : "Create page"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
