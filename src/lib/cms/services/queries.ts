import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseServiceContent, parseServiceSeo } from "./schema";
import type { CmsServiceEditorData, CmsServiceSummary } from "./types";

export async function getCmsServices(): Promise<CmsServiceSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("id,title,slug,locale,status,sort_order,updated_at")
    .eq("content_type", "service")
    .order("sort_order")
    .order("title");

  if (error) throw new Error(`Unable to load services: ${error.message}`);
  return data.map((service) => ({
    id: service.id,
    title: service.title,
    slug: service.slug,
    locale: service.locale,
    status: service.status,
    sortOrder: service.sort_order,
    updatedAt: service.updated_at,
  }));
}

export async function getCmsService(serviceId: string): Promise<CmsServiceEditorData | null> {
  const supabase = await createSupabaseServerClient();
  const [{ data: service, error }, { data: revisions, error: revisionsError }] = await Promise.all([
    supabase
      .from("content_entries")
      .select("id,title,slug,locale,status,sort_order,draft_data,published_data,lock_version,updated_at,seo_entries(draft_data,published_data)")
      .eq("content_type", "service")
      .eq("id", serviceId)
      .maybeSingle(),
    supabase
      .from("content_revisions")
      .select("id,version,event,snapshot,created_at,profiles(display_name)")
      .eq("resource_type", "service")
      .eq("resource_id", serviceId)
      .order("version", { ascending: false })
      .limit(20),
  ]);

  if (error) throw new Error(`Unable to load the service: ${error.message}`);
  if (revisionsError) throw new Error(`Unable to load service history: ${revisionsError.message}`);
  if (!service) return null;
  const seo = service.seo_entries[0];
  if (!seo) throw new Error("The service SEO structure is incomplete.");

  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    locale: service.locale,
    status: service.status,
    sortOrder: service.sort_order,
    updatedAt: service.updated_at,
    lockVersion: service.lock_version,
    content: parseServiceContent(service.draft_data),
    publishedContent: service.published_data ? parseServiceContent(service.published_data) : null,
    seo: parseServiceSeo(seo.draft_data),
    publishedSeo: seo.published_data ? parseServiceSeo(seo.published_data) : null,
    revisions: revisions.map((revision) => ({
      id: revision.id,
      version: revision.version,
      event: revision.event,
      snapshot: revision.snapshot,
      createdAt: revision.created_at,
      authorName: revision.profiles?.display_name ?? null,
    })),
  };
}
