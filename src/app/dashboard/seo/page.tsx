import type { Metadata } from "next";
import Link from "next/link";
import { requireCmsPermission } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "SEO" };

export default async function SeoModulePage() {
  await requireCmsPermission("seo.view");
  const supabase = await createSupabaseServerClient();
  const [{ data: pages, error: pagesError }, { data: entries, error: entriesError }] = await Promise.all([
    supabase.from("pages").select("id,name,path,seo_entries(draft_data,published_data)").order("path"),
    supabase.from("content_entries").select("id,content_type,title,slug,status,seo_entries(draft_data,published_data)").order("content_type").order("title"),
  ]);
  if (pagesError || entriesError) throw new Error(pagesError?.message ?? entriesError?.message ?? "Unable to load SEO records.");
  return <div className="space-y-5"><section className="rounded-[1.5rem] border bg-white p-5 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#157670]">Search &amp; social metadata</p><h2 className="mt-1 text-2xl font-bold">SEO</h2><p className="mt-1 text-sm text-slate-500">Open an item to edit its title, description, canonical URL, keywords, and Open Graph image. Draft metadata is not public until that item is published.</p></section><SeoGroup title="Pages" rows={(pages ?? []).map((page) => ({ key: page.id, title: page.name, detail: page.path, href: `/dashboard/pages/${page.id}`, hasDraft: page.seo_entries.length > 0, published: page.seo_entries.some((entry) => entry.published_data !== null) }))} /><SeoGroup title="Content collections" rows={(entries ?? []).map((entry) => ({ key: entry.id, title: entry.title, detail: `${entry.content_type} · ${entry.slug} · ${entry.status}`, href: entry.content_type === "service" ? `/dashboard/services/${entry.id}` : entry.content_type === "hospitality" ? `/dashboard/hospitality/${entry.id}` : entry.content_type === "cruise" ? `/dashboard/cruises/${entry.id}` : entry.content_type === "brand" ? `/dashboard/brands/${entry.id}` : entry.content_type.startsWith("destination") ? `/dashboard/destinations/${entry.id}` : "#", hasDraft: entry.seo_entries.length > 0, published: entry.seo_entries.some((seo) => seo.published_data !== null) })).filter((row) => row.href !== "#")} /></div>;
}

function SeoGroup({ title, rows }: { title: string; rows: { key: string; title: string; detail: string; href: string; hasDraft: boolean; published: boolean }[] }) { return <section className="overflow-hidden rounded-[1.5rem] border bg-white shadow-sm"><div className="border-b p-4"><h3 className="font-bold">{title}</h3></div><div className="divide-y">{rows.map((row) => <article key={row.key} className="flex items-center gap-3 p-4"><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{row.title}</p><p className="truncate text-xs text-slate-500">{row.detail}</p></div><span className="text-[10px] uppercase text-slate-500">{row.published ? "Published" : row.hasDraft ? "Draft" : "Missing"}</span><Link href={row.href} className="rounded-lg border px-3 py-2 text-xs font-bold">Edit SEO</Link></article>)}{rows.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No SEO records found.</p>}</div></section>; }
