"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createCollectionItem } from "@/app/dashboard/content/actions";
import type { HospitalityListResult } from "@/lib/cms/collections/queries";

export function HospitalityListing({ data, canCreate }: { data: HospitalityListResult; canCreate: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [creating, setCreating] = useState(false);
  const { params, options } = data;
  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  }
  function setPage(page: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    router.push(`${pathname}?${next.toString()}`);
  }
  return <div className="space-y-5">
    <section className="rounded-[1.5rem] border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#157670]">Website CMS</p><h2 className="mt-1 text-2xl font-bold">Hospitality</h2></div>{canCreate && <button type="button" onClick={() => setCreating(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white"><Plus className="h-4 w-4" />Create hospitality</button>}</div>
      <div className="mt-5 grid gap-3 md:grid-cols-3"><input defaultValue={params.search} onKeyDown={(event) => { if (event.key === "Enter") setFilter("search", event.currentTarget.value); }} placeholder="Search title or slug…" className="h-10 rounded-xl border px-3 text-sm" /><Filter label="Category" value={params.category} options={options.categories.map((item) => [item.id, item.name])} onChange={(value) => setFilter("category", value)} /><Filter label="Country" value={params.country} options={options.countries.map((value) => [value, value])} onChange={(value) => setFilter("country", value)} /><Filter label="Region" value={params.region} options={options.regions.map((value) => [value, value])} onChange={(value) => setFilter("region", value)} /><Filter label="Status" value={params.status === "all" ? "" : params.status} options={[["draft", "Draft"], ["published", "Published"], ["archived", "Archived"]]} onChange={(value) => setFilter("status", value)} /><Filter label="Active" value={params.active === "all" ? "" : params.active} options={[["true", "Active"], ["false", "Inactive"]]} onChange={(value) => setFilter("active", value)} /><Filter label="Sort" value={params.sort} options={[["order", "Display order"], ["updated", "Recently updated"], ["title", "Title"]]} onChange={(value) => setFilter("sort", value)} /></div>
    </section>
    <section className="overflow-hidden rounded-[1.5rem] border bg-white shadow-sm"><div className="divide-y">{data.items.map((item) => <article key={item.id} className="flex items-center gap-3 p-4"><div className="min-w-0 flex-1"><p className="font-bold text-sm">{item.title}</p><p className="text-xs text-slate-500">{item.slug} · {item.country ?? "Unspecified"} · {item.region ?? "Unspecified"}</p></div><span className="text-[10px] uppercase">{item.status}</span><Link className="rounded-lg border px-3 py-2 text-xs font-bold" href={`/dashboard/hospitality/${item.id}`}>Edit</Link></article>)}{!data.items.length && <p className="p-12 text-center text-sm text-slate-500">No hospitality items match these filters.</p>}</div><div className="flex justify-between p-4 text-xs"><span>{data.total} results · page {params.page} of {data.pages}</span><div className="flex gap-2"><button type="button" aria-label="Previous page" disabled={params.page <= 1} onClick={() => setPage(params.page - 1)}><ChevronLeft /></button><button type="button" aria-label="Next page" disabled={params.page >= data.pages} onClick={() => setPage(params.page + 1)}><ChevronRight /></button></div></div></section>
    {creating && <CreateHospitalityDialog categories={options.categories} onClose={() => setCreating(false)} onCreated={(id) => router.push(`/dashboard/hospitality/${id}`)} />}
  </div>;
}

function CreateHospitalityDialog({ categories, onClose, onCreated }: { categories: { id: string; name: string }[]; onClose: () => void; onCreated: (id: string) => void }) {
  const [title, setTitle] = useState(""); const [slug, setSlug] = useState(""); const [categoryId, setCategoryId] = useState(""); const [country, setCountry] = useState(""); const [region, setRegion] = useState(""); const [message, setMessage] = useState<string | null>(null); const [pending, startTransition] = useTransition();
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setMessage(null); startTransition(async () => { const response = await createCollectionItem({ type: "hospitality", draft: { content: { title, slug, categoryId: categoryId || null, country: country || null, region: region || null, shortDescription: "", fullDescription: "", location: null, roomsOrCabins: null, facilities: [], diningOptions: [], accessibility: [], gallery: [], displayOrder: 0, isActive: true }, seo: { title: "", description: "", keywords: [], canonicalUrl: "", openGraph: { title: "", description: "", image: "" } }, parentId: null } }); if (response.ok && response.id) onCreated(response.id); else setMessage(response.message); }); };
  return <div role="dialog" aria-modal="true" aria-label="Create hospitality" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"><div className="flex items-center justify-between"><h3 className="text-lg font-bold">Create hospitality</h3><button type="button" onClick={onClose} className="text-sm text-slate-500">Close</button></div><div className="mt-4 space-y-3"><Input label="Title" value={title} onChange={(value) => { setTitle(value); setSlug(toSlug(value)); }} required /><Input label="Slug" value={slug} onChange={(value) => setSlug(toSlug(value))} required /><label className="block text-xs font-bold">Category <span className="text-red-600">*</span><select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm"><option value="">Choose category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><Input label="Country (optional)" value={country} onChange={setCountry} /><Input label="Region (optional)" value={region} onChange={setRegion} />{message && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{message}</p>}</div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl border px-4 py-2 text-xs font-bold">Cancel</button><button disabled={pending} className="rounded-xl bg-[#157670] px-4 py-2 text-xs font-bold text-white">{pending ? "Creating…" : "Create draft"}</button></div></form></div>;
}

function Input({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) { return <label className="block text-xs font-bold">{label}{required && <span className="text-red-600"> *</span>}<input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm font-normal" /></label>; }
function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[][]; onChange: (value: string) => void }) { return <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-xl border px-3 text-sm"><option value="">All {label}</option>{options.map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select>; }
function toSlug(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
