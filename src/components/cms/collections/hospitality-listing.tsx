"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { ArrowRight, Building2, ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createCollectionItem } from "@/app/dashboard/content/actions";
import type { HospitalityListResult } from "@/lib/cms/collections/queries";
import { EmptyState, StatusBadge, TypeAvatar } from "./list-ui";

export function HospitalityListing({ data, canCreate }: { data: HospitalityListResult; canCreate: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [creating, setCreating] = useState(false);
  const { params, options } = data;

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  }

  function setPage(page: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#157670]">Website collection</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Hospitality</h2>
            <p className="mt-1 text-sm text-slate-500">Manage hotel and resort listings shown on the public website.</p>
          </div>
          {canCreate && (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white hover:bg-[#105f5a]"
            >
              <Plus className="h-4 w-4" /> Create hospitality
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <label className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              defaultValue={params.search}
              onKeyDown={(event) => {
                if (event.key === "Enter") setFilter("search", event.currentTarget.value);
              }}
              placeholder="Search title or slug…"
              className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8"
            />
          </label>
          <Filter label="Category" value={params.category} options={options.categories.map((item) => [item.id, item.name])} onChange={(value) => setFilter("category", value)} />
          <Filter label="Country" value={params.country} options={options.countries.map((value) => [value, value])} onChange={(value) => setFilter("country", value)} />
          <Filter label="Region" value={params.region} options={options.regions.map((value) => [value, value])} onChange={(value) => setFilter("region", value)} />
          <Filter
            label="Status"
            value={params.status === "all" ? "" : params.status}
            options={[["draft", "Draft"], ["published", "Published"], ["archived", "Archived"]]}
            onChange={(value) => setFilter("status", value)}
          />
          <Filter
            label="Active"
            value={params.active === "all" ? "" : params.active}
            options={[["true", "Active"], ["false", "Inactive"]]}
            onChange={(value) => setFilter("active", value)}
          />
          <Filter
            label="Sort"
            value={params.sort}
            options={[["order", "Display order"], ["updated", "Recently updated"], ["title", "Title"]]}
            onChange={(value) => setFilter("sort", value)}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
        {data.items.length === 0 ? (
          <EmptyState icon={Building2} label="No hospitality items match these filters" />
        ) : (
          <div className="divide-y divide-slate-100">
            {data.items.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 p-4 hover:bg-slate-50/70 sm:flex-row sm:items-center sm:p-5">
                <TypeAvatar icon={Building2} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-slate-900">{item.title}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-slate-500">
                    {item.slug} · {item.country ?? "Unspecified"} · {item.region ?? "Unspecified"}
                  </p>
                </div>
                <Link
                  href={`/dashboard/hospitality/${item.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-700 hover:border-[#157670]/30 hover:text-[#157670]"
                >
                  Edit <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 p-4 text-xs text-slate-500">
          <span>{data.total} results · page {params.page} of {data.pages}</span>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={params.page <= 1}
              onClick={() => setPage(params.page - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next page"
              disabled={params.page >= data.pages}
              onClick={() => setPage(params.page + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {creating && (
        <CreateHospitalityDialog
          categories={options.categories}
          onClose={() => setCreating(false)}
          onCreated={(id) => router.push(`/dashboard/hospitality/${id}`)}
        />
      )}
    </div>
  );
}

function CreateHospitalityDialog({
  categories,
  onClose,
  onCreated,
}: {
  categories: { id: string; name: string }[];
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const response = await createCollectionItem({
        type: "hospitality",
        draft: {
          content: {
            title,
            slug,
            categoryId: categoryId || null,
            country: country || null,
            region: region || null,
            shortDescription: "",
            fullDescription: "",
            location: null,
            roomsOrCabins: null,
            facilities: [],
            diningOptions: [],
            accessibility: [],
            gallery: [],
            displayOrder: 0,
            isActive: true,
          },
          seo: { title: "", description: "", keywords: [], canonicalUrl: "", openGraph: { title: "", description: "", image: "" } },
          parentId: null,
        },
      });
      if (response.ok && response.id) onCreated(response.id);
      else setMessage(response.message);
    });
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Create hospitality" className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 backdrop-blur-sm sm:items-center sm:p-6">
      <form onSubmit={submit} className="w-full max-w-lg rounded-t-[1.75rem] bg-white p-6 shadow-2xl sm:rounded-[1.75rem]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Create hospitality</h3>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 space-y-3">
          <Input
            label="Title"
            value={title}
            onChange={(value) => {
              setTitle(value);
              setSlug(toSlug(value));
            }}
            required
          />
          <Input label="Slug" value={slug} onChange={(value) => setSlug(toSlug(value))} required />
          <label className="block text-xs font-bold text-slate-700">
            Category <span className="text-red-600">*</span>
            <select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm">
              <option value="">Choose category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <Input label="Country (optional)" value={country} onChange={setCountry} />
          <Input label="Region (optional)" value={region} onChange={setRegion} />
          {message && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700">{message}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-600">
            Cancel
          </button>
          <button disabled={pending} className="h-10 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white disabled:opacity-50">
            {pending ? "Creating…" : "Create draft"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="block text-xs font-bold text-slate-700">
      {label}
      {required && <span className="text-red-600"> *</span>}
      <input
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#157670]"
      />
    </label>
  );
}

function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return (
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm">
      <option value="">All {label}</option>
      {options.map(([key, name]) => (
        <option key={key} value={key}>
          {name}
        </option>
      ))}
    </select>
  );
}

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
