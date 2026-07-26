import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseContent, parseSeo, type ManagedContentType } from "./schema";
import type { CmsCollectionEditor, CmsCollectionSummary } from "./types";

const types: ManagedContentType[] = ["hospitality", "destination", "destination_place", "destination_attraction", "cruise", "brand"];
const asType = (value: string): ManagedContentType => types.includes(value as ManagedContentType) ? value as ManagedContentType : "hospitality";

export async function getCollectionSummaries(type?: ManagedContentType): Promise<CmsCollectionSummary[]> {
  const s = await createSupabaseServerClient(); const q = s.from("content_entries").select("id,content_type,title,slug,status,is_active,sort_order,updated_at,lock_version,draft_data").in("content_type", type ? [type] : types).order("sort_order"); const { data, error } = await q; if (error) throw new Error(error.message);
  const ids = data.map((row) => row.id); const { data: relations, error: relationError } = ids.length ? await s.from("content_relations").select("source_id,target_id,relation_type").or(`source_id.in.(${ids.join(",")}),target_id.in.(${ids.join(",")})`) : { data: [], error: null }; if (relationError) throw new Error(relationError.message);
  const relatedIds = [...new Set((relations ?? []).flatMap((r) => [r.source_id, r.target_id]))]; const { data: related } = relatedIds.length ? await s.from("content_entries").select("id,title,content_type").in("id", relatedIds) : { data: [] }; const titleById = new Map((related ?? []).map((row) => [row.id, row]));
  return data.map((row) => { const parent = (relations ?? []).find((r) => r.target_id === row.id && (r.relation_type === "contains_place" || r.relation_type === "contains_attraction")); const content = parseContent(row.draft_data, { title: row.title, slug: row.slug, sortOrder: row.sort_order, isActive: row.is_active }); return { id: row.id, type: asType(row.content_type), title: row.title, slug: row.slug, status: row.status, active: row.is_active, sortOrder: row.sort_order, updatedAt: row.updated_at, lockVersion: row.lock_version, parentId: parent?.source_id ?? null, parentTitle: parent ? titleById.get(parent.source_id)?.title ?? null : null, childCount: (relations ?? []).filter((r) => r.source_id === row.id).length, country: content.country, region: content.region, categoryId: content.categoryId }; });
}

export async function getHospitalityCategories(): Promise<{ id: string; name: string }[]> {
  const s = await createSupabaseServerClient();
  const { data, error } = await s.from("hospitality_categories").select("id,name").eq("is_active", true).order("sort_order");
  if (error) throw new Error(error.message);
  return data;
}

export type HospitalityListParams = { search: string; category: string; country: string; region: string; status: "all" | "draft" | "published" | "archived"; active: "all" | "true" | "false"; sort: "order" | "updated" | "title"; page: number; pageSize: number };
export type HospitalityListResult = { items: Array<Omit<CmsCollectionSummary, "type"> & { type: "hospitality" }>; total: number; pages: number; options: { categories: { id: string; name: string }[]; countries: string[]; regions: string[] }; params: HospitalityListParams };
export function parseHospitalityListParams(value: Record<string, string | string[] | undefined>): HospitalityListParams { const text=(key:string,max=120)=>typeof value[key]==="string"?value[key].trim().slice(0,max):""; const status=text("status"); const active=text("active"); const sort=text("sort"); const int=(key:string,fallback:number,max:number)=>{const n=Number(text(key,10));return Number.isInteger(n)&&n>0&&n<=max?n:fallback}; return {search:text("search",120),category:text("category",80),country:text("country"),region:text("region"),status:["draft","published","archived"].includes(status)?status as HospitalityListParams["status"]:"all",active:active==="true"||active==="false"?active:"all",sort:["order","updated","title"].includes(sort)?sort as HospitalityListParams["sort"]:"order",page:int("page",1,100000),pageSize:[10,20,50].includes(int("pageSize",10,50))?int("pageSize",10,50):10}; }
export async function getHospitalityList(params: HospitalityListParams): Promise<HospitalityListResult> {
  const s = await createSupabaseServerClient();
  const search = params.search.replace(/[%_,()]/g, "");
  let countQuery = s.from("content_entries").select("id", { count: "exact", head: true }).eq("content_type", "hospitality");
  if (search) countQuery = countQuery.or(`title.ilike.%${search}%,slug.ilike.%${search}%`);
  if (params.category) countQuery = countQuery.filter("draft_data->>categoryId", "eq", params.category);
  if (params.country) countQuery = countQuery.filter("draft_data->>country", "eq", params.country);
  if (params.region) countQuery = countQuery.filter("draft_data->>region", "eq", params.region);
  if (params.status !== "all") countQuery = countQuery.eq("status", params.status);
  if (params.active !== "all") countQuery = countQuery.eq("is_active", params.active === "true");
  const countResult = await countQuery;
  if (countResult.error) throw new Error(countResult.error.message);
  const total = countResult.count ?? 0;
  const pages = Math.max(1, Math.ceil(total / params.pageSize));
  const page = Math.min(params.page, pages);
  let dataQuery = s.from("content_entries").select("id,content_type,title,slug,status,is_active,sort_order,updated_at,lock_version,draft_data").eq("content_type", "hospitality");
  if (search) dataQuery = dataQuery.or(`title.ilike.%${search}%,slug.ilike.%${search}%`);
  if (params.category) dataQuery = dataQuery.filter("draft_data->>categoryId", "eq", params.category);
  if (params.country) dataQuery = dataQuery.filter("draft_data->>country", "eq", params.country);
  if (params.region) dataQuery = dataQuery.filter("draft_data->>region", "eq", params.region);
  if (params.status !== "all") dataQuery = dataQuery.eq("status", params.status);
  if (params.active !== "all") dataQuery = dataQuery.eq("is_active", params.active === "true");
  dataQuery = params.sort === "updated" ? dataQuery.order("updated_at", { ascending: false }) : params.sort === "title" ? dataQuery.order("title") : dataQuery.order("sort_order");
  const [{ data, error }, { data: categories }, { data: all }] = await Promise.all([
    dataQuery.range((page - 1) * params.pageSize, page * params.pageSize - 1),
    s.from("hospitality_categories").select("id,name").eq("is_active", true).order("sort_order"),
    s.from("content_entries").select("draft_data").eq("content_type", "hospitality"),
  ]);
  if (error) throw new Error(error.message);
  const values = (key: "country" | "region") => [...new Set((all ?? []).map((row) => {
    const draft = row.draft_data as Record<string, unknown>;
    return typeof draft[key] === "string" ? draft[key].trim() : "";
  }).filter(Boolean))].sort();
  const items = (data ?? []).map((row) => {
    const content = parseContent(row.draft_data, { title: row.title, slug: row.slug, sortOrder: row.sort_order, isActive: row.is_active });
    return { id: row.id, type: "hospitality" as const, title: row.title, slug: row.slug, status: row.status, active: row.is_active, sortOrder: row.sort_order, updatedAt: row.updated_at, lockVersion: row.lock_version, parentId: null, parentTitle: null, childCount: 0, country: content.country, region: content.region, categoryId: content.categoryId };
  });
  return { items, total, pages, options: { categories: categories ?? [], countries: values("country"), regions: values("region") }, params: { ...params, page } };
}

export async function getCollectionEditor(id: string, expectedType?: ManagedContentType): Promise<CmsCollectionEditor | null> {
  const s = await createSupabaseServerClient(); const { data: entry, error } = await s.from("content_entries").select("id,content_type,title,slug,status,is_active,sort_order,updated_at,lock_version,draft_data,seo_entries(draft_data)").eq("id", id).maybeSingle(); if (error) throw new Error(error.message); if (!entry || !types.includes(entry.content_type as ManagedContentType) || (expectedType && entry.content_type !== expectedType)) return null;
  const parentTypes: ManagedContentType[] = entry.content_type === "destination_place" ? ["destination"] : entry.content_type === "destination_attraction" ? ["destination_place"] : [];
  const parentRequest = parentTypes.length ? s.from("content_entries").select("id,title,content_type").in("content_type", parentTypes).neq("status", "archived").order("title") : Promise.resolve({ data: [] as { id: string; title: string; content_type: string }[] });
  const [{ data: relations }, { data: revisions }, { data: categories }, { data: possibleParents }] = await Promise.all([s.from("content_relations").select("source_id,target_id,relation_type").eq("target_id", id), s.from("content_revisions").select("id,version,event,snapshot,created_at,profiles(display_name)").eq("resource_id", id).eq("resource_type", entry.content_type).order("version", { ascending: false }).limit(30), s.from("hospitality_categories").select("id,key,name").eq("is_active", true).order("sort_order"), parentRequest]);
  const parent = relations?.find((r) => r.relation_type === "contains_place" || r.relation_type === "contains_attraction"); const content = parseContent(entry.draft_data, { title: entry.title, slug: entry.slug, sortOrder: entry.sort_order, isActive: entry.is_active }); const seo = parseSeo(entry.seo_entries[0]?.draft_data);
  return { id: entry.id, type: asType(entry.content_type), title: entry.title, slug: entry.slug, status: entry.status, active: entry.is_active, sortOrder: entry.sort_order, updatedAt: entry.updated_at, lockVersion: entry.lock_version, parentId: parent?.source_id ?? null, parentTitle: null, childCount: 0, country: content.country, region: content.region, categoryId: content.categoryId, content, seo, revisions: (revisions ?? []).map((r) => ({ id: r.id, version: r.version, event: r.event, snapshot: r.snapshot, createdAt: r.created_at, authorName: r.profiles?.display_name ?? null })), categories: (categories ?? []).map((x) => ({ id: x.id, key: x.key, name: x.name })), parents: (possibleParents ?? []).map((x) => ({ id: x.id, title: x.title, type: asType(x.content_type) })) };
}
