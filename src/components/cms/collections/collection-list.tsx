"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Archive, ArrowRight, Building2, ChevronDown, ChevronLeft, ChevronRight, Globe2, MapPin, Plus, Search, Ship, Sparkles, X } from "lucide-react";
import { archiveCollectionItem, createCollectionItem } from "@/app/dashboard/content/actions";
import type { ManagedContentType } from "@/lib/cms/collections/schema";
import type { CmsCollectionSummary } from "@/lib/cms/collections/types";
import { EmptyState, StatusBadge, TypeAvatar } from "./list-ui";
import { useConfirm } from "@/components/cms/confirm-dialog";

type CollectionMode = "hospitality" | "destinations" | "cruises" | "brands";

type Props = {
  mode: CollectionMode;
  items: CmsCollectionSummary[];
  parents: { id: string; title: string; type: ManagedContentType }[];
  categories: { id: string; name: string }[];
  canCreate: boolean;
  canArchive: boolean;
};

const label: Record<ManagedContentType, string> = {
  hospitality: "Hospitality",
  destination: "Countries",
  destination_place: "Places",
  destination_attraction: "Attractions",
  cruise: "Cruises",
  brand: "Brands",
};

const singularLabel: Record<ManagedContentType, string> = {
  hospitality: "Hospitality",
  destination: "Country",
  destination_place: "Place",
  destination_attraction: "Attraction",
  cruise: "Cruise",
  brand: "Brand",
};

const heading: Record<CollectionMode, string> = {
  hospitality: "Hospitality",
  destinations: "Destination hierarchy",
  cruises: "Cruises",
  brands: "Brands",
};

const subtitle: Record<CollectionMode, string> = {
  hospitality: "Manage hotel and resort listings shown on the public website.",
  destinations: "Manage the country, place, and attraction hierarchy.",
  cruises: "Manage the Nile cruise collection.",
  brands: "Manage the brand portfolio shown on the public website.",
};

const typeIcon: Record<ManagedContentType, typeof Globe2> = {
  hospitality: Building2,
  destination: Globe2,
  destination_place: MapPin,
  destination_attraction: MapPin,
  cruise: Ship,
  brand: Sparkles,
};

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const PAGE_SIZE = 10;

function ItemRow({ item, mode, canArchive, onArchive, href }: { item: CmsCollectionSummary; mode: CollectionMode; canArchive: boolean; onArchive: (item: CmsCollectionSummary) => void; href: string }) {
  return (
    <article className="flex flex-col gap-4 p-4 hover:bg-slate-50/70 sm:flex-row sm:items-center sm:p-5">
      <TypeAvatar icon={typeIcon[item.type]} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-bold text-slate-900">{item.title}</h3>
          <StatusBadge status={item.status} />
          {!item.active && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">Inactive</span>}
        </div>
        <p className="mt-1 font-mono text-[10px] text-slate-500">
          {item.slug} · order {item.sortOrder}
          {item.parentTitle && ` · ${item.parentTitle}`}
          {mode === "destinations" && ` · ${item.childCount} ${item.childCount === 1 ? "child" : "children"}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {canArchive && item.status !== "archived" && (
          <button
            type="button"
            aria-label={`Archive ${item.title}`}
            onClick={() => onArchive(item)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Archive className="h-4 w-4" />
          </button>
        )}
        <Link
          href={href}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-700 hover:border-[#157670]/30 hover:text-[#157670]"
        >
          Edit <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export function CollectionList({ mode, items, parents, categories, canCreate, canArchive }: Props) {
  const [type, setType] = useState<ManagedContentType>(
    mode === "hospitality" ? "hospitality" : mode === "cruises" ? "cruise" : mode === "brands" ? "brand" : "destination",
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [active, setActive] = useState("all");
  const [parent, setParent] = useState("all");
  const [sort, setSort] = useState("order");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const { confirm, dialog } = useConfirm();
  const [pending, startTransition] = useTransition();

  const rows = useMemo(
    () =>
      items
        .filter(
          (item) =>
            item.type === type &&
            (status === "all" || item.status === status) &&
            (active === "all" || String(item.active) === active) &&
            (parent === "all" || item.parentId === parent) &&
            `${item.title} ${item.slug}`.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => (sort === "updated" ? b.updatedAt.localeCompare(a.updatedAt) : a.sortOrder - b.sortOrder)),
    [items, type, status, active, parent, query, sort],
  );

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const relevantParents = parents.filter((item) =>
    type === "destination_place" ? item.type === "destination" : type === "destination_attraction" ? item.type === "destination_place" : false,
  );

  const isHierarchical = type === "destination_place" || type === "destination_attraction";
  const groups = useMemo(() => {
    if (!isHierarchical) return null;
    const byParent = new Map<string, CmsCollectionSummary[]>();
    for (const row of rows) {
      const key = row.parentId ?? "unassigned";
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(row);
    }
    const ordered = [...relevantParents.map((item) => item.id), "unassigned"].filter((id) => byParent.has(id));
    return ordered.map((id) => ({
      id,
      title: id === "unassigned" ? "No parent assigned" : relevantParents.find((item) => item.id === id)?.title ?? "Unknown",
      items: byParent.get(id)!,
    }));
  }, [isHierarchical, rows, relevantParents]);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const toggleGroup = (id: string) => setCollapsedGroups((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const href = (id: string) => `/dashboard/${mode}/${id}`;

  function create() {
    startTransition(async () => {
      const result = await createCollectionItem({
        type,
        draft: {
          content: {
            title,
            slug: slug || slugify(title),
            shortDescription: "",
            fullDescription: "",
            country: null,
            region: null,
            location: null,
            categoryId: null,
            rooms: null,
            cabins: null,
            suites: null,
            facilities: [],
            diningOptions: [],
            accessibility: [],
            gallery: [],
            displayOrder: 0,
            isActive: true,
          },
          seo: { title: "", description: "", keywords: [], canonicalUrl: "", openGraph: { title: "", description: "", image: "" } },
          parentId: parentId || null,
        },
      });
      setNotice(result.message);
      if (result.ok) {
        setOpen(false);
        location.assign(href(result.id!));
      }
    });
  }

  async function archive(item: CmsCollectionSummary) {
    if (!(await confirm(`Archive "${item.title}"?`))) return;
    startTransition(async () => {
      const result = await archiveCollectionItem(item.id, item.type, item.lockVersion);
      setNotice(result.message);
      if (result.ok) location.reload();
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#157670]">Website collection</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{heading[mode]}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle[mode]}</p>
          </div>
          {canCreate && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white hover:bg-[#105f5a]"
            >
              <Plus className="h-4 w-4" /> New {singularLabel[type]}
            </button>
          )}
        </div>

        {mode === "destinations" && (
          <div className="mt-5 flex flex-wrap gap-2">
            {(["destination", "destination_place", "destination_attraction"] as ManagedContentType[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setType(option);
                  setPage(1);
                  setParent("all");
                }}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  type === option ? "bg-[#157670] text-white shadow-sm shadow-[#157670]/20" : "border border-slate-200 text-slate-600 hover:border-[#157670]/30"
                }`}
              >
                {label[option]}
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 grid gap-3 lg:grid-cols-5">
          <label className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or slug…"
              className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8"
            />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm">
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select value={active} onChange={(event) => setActive(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm">
            <option value="all">Active + inactive</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm">
            <option value="order">Display order</option>
            <option value="updated">Recently updated</option>
          </select>
        </div>

        {(type === "destination_place" || type === "destination_attraction") && (
          <select
            value={parent}
            onChange={(event) => setParent(event.target.value)}
            className="mt-3 h-10 w-full max-w-sm rounded-xl border border-slate-200 px-3 text-sm"
          >
            <option value="all">All parents</option>
            {relevantParents.map((item) => (
              <option value={item.id} key={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        )}

        {notice && <p role="status" className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-700">{notice}</p>}
      </section>

      {isHierarchical && groups ? (
        <section className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
          {groups.length === 0 ? (
            <EmptyState icon={typeIcon[type]} label="No items match these filters" />
          ) : (
            <div className="divide-y divide-slate-100">
              {groups.map((group) => {
                const collapsed = collapsedGroups.has(group.id);
                return (
                  <div key={group.id}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className="flex w-full items-center justify-between gap-3 bg-slate-50/60 px-4 py-3 text-left hover:bg-slate-100/70 sm:px-5"
                      aria-expanded={!collapsed}
                    >
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700">
                        <Globe2 className="h-4 w-4 text-[#157670]" /> {group.title}
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">{group.items.length}</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${collapsed ? "" : "rotate-180"}`} />
                    </button>
                    {!collapsed && (
                      <div className="divide-y divide-slate-100">
                        {group.items.map((item) => (
                          <ItemRow key={item.id} item={item} mode={mode} canArchive={canArchive} onArchive={archive} href={href(item.id)} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="border-t border-slate-100 p-4 text-xs text-slate-500">{rows.length} results across {groups.length} {groups.length === 1 ? "group" : "groups"}</div>
        </section>
      ) : (
        <section className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
          {visible.length === 0 ? (
            <EmptyState icon={typeIcon[type]} label="No items match these filters" />
          ) : (
            <div className="divide-y divide-slate-100">
              {visible.map((item) => (
                <ItemRow key={item.id} item={item} mode={mode} canArchive={canArchive} onArchive={archive} href={href(item.id)} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 p-4 text-xs text-slate-500">
            <span>{rows.length} results · page {page} of {pages}</span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={page >= pages}
                onClick={() => setPage((value) => value + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-t-[1.75rem] bg-white p-6 shadow-2xl sm:rounded-[1.75rem]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">New {singularLabel[type]}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="mt-5 block text-xs font-bold text-slate-700">
              Title
              <input
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setSlug(slugify(event.target.value));
                }}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#157670]"
              />
            </label>

            <label className="mt-3 block text-xs font-bold text-slate-700">
              Slug
              <input
                value={slug}
                onChange={(event) => setSlug(slugify(event.target.value))}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-mono text-sm font-normal outline-none focus:border-[#157670]"
              />
            </label>

            {relevantParents.length > 0 && (
              <label className="mt-3 block text-xs font-bold text-slate-700">
                Parent
                <select
                  value={parentId}
                  onChange={(event) => setParentId(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"
                >
                  <option value="">Choose parent</option>
                  {relevantParents.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {type === "hospitality" && (
              <label className="mt-3 block text-xs font-bold text-slate-700">
                Category
                <select disabled className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-400">
                  <option>Select category in editor ({categories.length} available)</option>
                </select>
              </label>
            )}

            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setOpen(false)} className="h-10 flex-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                Cancel
              </button>
              <button
                type="button"
                disabled={pending || !title || !slug || (relevantParents.length > 0 && !parentId)}
                onClick={create}
                className="h-10 flex-1 rounded-xl bg-[#157670] text-xs font-bold text-white disabled:opacity-50"
              >
                Create draft
              </button>
            </div>
          </div>
        </div>
      )}
      {dialog}
    </div>
  );
}
