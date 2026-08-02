import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parsePageHero, parsePageSeo } from "./schema";
import { parseAboutSections } from "./about-schema";
import type { CmsAboutPageEditorData, CmsPageEditorData, CmsPageSummary } from "./types";

export async function getCmsPages(): Promise<CmsPageSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pages")
    .select("id,name,path,key,locale,enabled,updated_at")
    .order("path");

  if (error) throw new Error(`Unable to load pages: ${error.message}`);

  return data.map((page) => ({
    id: page.id,
    name: page.name,
    path: page.path,
    key: page.key,
    locale: page.locale,
    enabled: page.enabled,
    updatedAt: page.updated_at,
  }));
}

export async function getCmsPage(pageId: string): Promise<CmsPageEditorData | null> {
  const supabase = await createSupabaseServerClient();
  const [{ data: page, error: pageError }, { data: revisions, error: revisionsError }] =
    await Promise.all([
      supabase
        .from("pages")
        .select("id,name,path,key,locale,enabled,template_key,lock_version,updated_at,page_sections(id,key,draft_data,published_data),seo_entries(id,draft_data,published_data)")
        .eq("id", pageId)
        .maybeSingle(),
      supabase
        .from("content_revisions")
        .select("id,version,event,snapshot,created_at,profiles(display_name)")
        .eq("resource_type", "page")
        .eq("resource_id", pageId)
        .order("version", { ascending: false })
        .limit(20),
    ]);

  if (pageError) throw new Error(`Unable to load the page: ${pageError.message}`);
  if (revisionsError) throw new Error(`Unable to load page history: ${revisionsError.message}`);
  if (!page) return null;

  const heroSection = page.page_sections.find((section) => section.key === "hero");
  const seoEntry = page.seo_entries[0];
  if (!heroSection || !seoEntry) throw new Error("The page content structure is incomplete.");

  return {
    id: page.id,
    name: page.name,
    path: page.path,
    key: page.key,
    locale: page.locale,
    enabled: page.enabled,
    templateKey: page.template_key,
    lockVersion: page.lock_version,
    updatedAt: page.updated_at,
    heroSectionId: heroSection.id,
    hero: parsePageHero(heroSection.draft_data),
    publishedHero: heroSection.published_data ? parsePageHero(heroSection.published_data) : null,
    seoEntryId: seoEntry.id,
    seo: parsePageSeo(seoEntry.draft_data),
    publishedSeo: seoEntry.published_data ? parsePageSeo(seoEntry.published_data) : null,
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

export async function getPageKey(pageId: string): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("pages").select("key").eq("id", pageId).maybeSingle();
  if (error) throw new Error(`Unable to load the page: ${error.message}`);
  return data?.key ?? null;
}

export async function getAboutPage(pageId: string): Promise<CmsAboutPageEditorData | null> {
  const supabase = await createSupabaseServerClient();
  const [{ data: page, error: pageError }, { data: revisions, error: revisionsError }] =
    await Promise.all([
      supabase
        .from("pages")
        .select("id,name,path,key,locale,enabled,template_key,lock_version,updated_at,page_sections(id,key,draft_data,published_data),seo_entries(id,draft_data,published_data)")
        .eq("id", pageId)
        .maybeSingle(),
      supabase
        .from("content_revisions")
        .select("id,version,event,snapshot,created_at,profiles(display_name)")
        .eq("resource_type", "page")
        .eq("resource_id", pageId)
        .order("version", { ascending: false })
        .limit(20),
    ]);

  if (pageError) throw new Error(`Unable to load the page: ${pageError.message}`);
  if (revisionsError) throw new Error(`Unable to load page history: ${revisionsError.message}`);
  if (!page) return null;

  const seoEntry = page.seo_entries[0];
  if (!seoEntry) throw new Error("The page content structure is incomplete.");

  const draftBySectionKey: Record<string, unknown> = {};
  const publishedBySectionKey: Record<string, unknown> = {};
  let hasPublishedSection = false;
  for (const section of page.page_sections) {
    draftBySectionKey[section.key] = section.draft_data;
    if (section.published_data) {
      publishedBySectionKey[section.key] = section.published_data;
      hasPublishedSection = true;
    }
  }

  return {
    id: page.id,
    name: page.name,
    path: page.path,
    key: page.key,
    locale: page.locale,
    enabled: page.enabled,
    templateKey: page.template_key,
    lockVersion: page.lock_version,
    updatedAt: page.updated_at,
    sections: parseAboutSections(draftBySectionKey),
    publishedSections: hasPublishedSection ? parseAboutSections(publishedBySectionKey) : null,
    seoEntryId: seoEntry.id,
    seo: parsePageSeo(seoEntry.draft_data),
    publishedSeo: seoEntry.published_data ? parsePageSeo(seoEntry.published_data) : null,
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
