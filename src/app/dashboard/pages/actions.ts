"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCmsPermission } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.generated";
import {
  createPageSchema,
  defaultPageHero,
  defaultPageSeo,
  pageDraftSchema,
  pageSeoSchema,
  parsePageHero,
  parsePageSeo,
} from "@/lib/cms/pages/schema";
import type { PageDraftData, PageSeoData } from "@/lib/cms/pages/schema";
import { aboutSectionsSchema, parseAboutSections } from "@/lib/cms/pages/about-schema";
import type { AboutSectionsData } from "@/lib/cms/pages/about-schema";
import type { PageMutationResult } from "@/lib/cms/pages/types";

const mutationInputSchema = z.object({
  pageId: z.uuid(),
  lockVersion: z.number().int().positive(),
  draft: pageDraftSchema,
});

const rpcResultSchema = z.object({
  lockVersion: z.number().int().positive(),
  updatedAt: z.string(),
});

const restoredResultSchema = rpcResultSchema.extend({
  hero: z.unknown(),
  seo: z.unknown(),
});

const aboutMutationInputSchema = z.object({
  pageId: z.uuid(),
  lockVersion: z.number().int().positive(),
  sections: aboutSectionsSchema,
  seo: pageSeoSchema,
});

const aboutRestoredResultSchema = rpcResultSchema.extend({
  sections: z.unknown(),
  seo: z.unknown(),
});

const uploadRequestSchema = z.object({
  pageId: z.uuid(),
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"]),
  byteSize: z.number().int().positive().max(15_728_640),
  checksum: z.string().regex(/^[a-f0-9]{64}$/),
});

const finalizeUploadSchema = uploadRequestSchema.extend({
  storagePath: z.string().trim().min(1).max(500),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  altText: z.string().trim().max(180),
});

export type CreatePageState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
  pageId?: string;
};

export type UploadPreparation =
  | { ok: true; existing: true; assetId: string; url: string }
  | { ok: true; existing: false; path: string; token: string }
  | { ok: false; message: string };

function asJson(value: unknown): Json {
  return value as Json;
}

function mutationError(error: { code?: string; message: string }): PageMutationResult {
  if (error.code === "40001") {
    return {
      ok: false,
      conflict: true,
      message: "This page changed in another session. Reload before continuing.",
    };
  }
  if (error.code === "42501") {
    return {
      ok: false,
      message: "This action needs additional permission or an MFA-verified session.",
    };
  }
  return { ok: false, message: error.message || "The page could not be saved." };
}

function safeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const base = fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70) || "hero";
  return `${base}.${extension}`;
}

export async function createPage(
  _previousState: CreatePageState,
  formData: FormData,
): Promise<CreatePageState> {
  await requireCmsPermission("content.create");
  await requireCmsPermission("seo.edit");

  const parsed = createPageSchema.safeParse({
    name: formData.get("name"),
    path: formData.get("path"),
    key: formData.get("key"),
    locale: formData.get("locale") || "en",
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the page details and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const seo = { ...defaultPageSeo, canonicalPath: parsed.data.path };
  const hero = { ...defaultPageHero, title: parsed.data.name };
  const { data, error } = await supabase.rpc("cms_create_page", {
    requested_name: parsed.data.name,
    requested_path: parsed.data.path,
    requested_key: parsed.data.key,
    requested_locale: parsed.data.locale,
    hero_data: asJson(hero),
    seo_data: asJson(seo),
  });

  if (error) {
    const message = error.code === "23505" ? "A page already uses this path or key." : error.message;
    return { status: "error", message };
  }

  revalidatePath("/dashboard/pages");
  return { status: "idle", pageId: data };
}

export async function savePageDraft(
  pageId: string,
  lockVersion: number,
  draft: PageDraftData,
  createRevision = false,
): Promise<PageMutationResult> {
  await requireCmsPermission("content.edit");
  await requireCmsPermission("seo.edit");
  const parsed = mutationInputSchema.safeParse({ pageId, lockVersion, draft });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Some page fields are invalid.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_save_page_draft", {
    requested_page_id: parsed.data.pageId,
    expected_lock_version: parsed.data.lockVersion,
    hero_data: asJson(parsed.data.draft.hero),
    seo_data: asJson(parsed.data.draft.seo),
    create_revision: createRevision,
  });
  if (error) return mutationError(error);

  const result = rpcResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The server returned an invalid save result." };
  revalidatePath(`/dashboard/pages/${pageId}`);
  return { ok: true, ...result.data, message: createRevision ? "Version saved." : undefined };
}

export async function publishPage(
  pageId: string,
  lockVersion: number,
  draft: PageDraftData,
): Promise<PageMutationResult> {
  await requireCmsPermission("content.publish");
  await requireCmsPermission("seo.publish");
  const parsed = mutationInputSchema.safeParse({ pageId, lockVersion, draft });
  if (!parsed.success) return { ok: false, message: "Some page fields are invalid." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_publish_page", {
    requested_page_id: parsed.data.pageId,
    expected_lock_version: parsed.data.lockVersion,
    hero_data: asJson(parsed.data.draft.hero),
    seo_data: asJson(parsed.data.draft.seo),
  });
  if (error) return mutationError(error);

  const result = rpcResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The server returned an invalid publish result." };
  const { data: publishedPage } = await supabase.from("pages").select("path").eq("id", pageId).maybeSingle();
  if (publishedPage?.path) revalidatePath(publishedPage.path);
  revalidatePath("/dashboard/pages");
  revalidatePath(`/dashboard/pages/${pageId}`);
  return { ok: true, ...result.data, message: "Page published." };
}

export async function unpublishPage(
  pageId: string,
  lockVersion: number,
): Promise<PageMutationResult> {
  await requireCmsPermission("content.publish");
  await requireCmsPermission("seo.publish");
  const parsed = z.object({ pageId: z.uuid(), lockVersion: z.number().int().positive() }).safeParse({ pageId, lockVersion });
  if (!parsed.success) return { ok: false, message: "The page request is invalid." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_unpublish_page", {
    requested_page_id: parsed.data.pageId,
    expected_lock_version: parsed.data.lockVersion,
  });
  if (error) return mutationError(error);

  const result = rpcResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The server returned an invalid result." };
  const { data: unpublishedPage } = await supabase.from("pages").select("path").eq("id", pageId).maybeSingle();
  if (unpublishedPage?.path) revalidatePath(unpublishedPage.path);
  revalidatePath("/dashboard/pages");
  revalidatePath(`/dashboard/pages/${pageId}`);
  return { ok: true, ...result.data, message: "Page moved to draft." };
}

export async function restorePageRevision(
  pageId: string,
  revisionId: string,
  lockVersion: number,
): Promise<(PageMutationResult & { draft?: PageDraftData })> {
  await requireCmsPermission("content.edit");
  await requireCmsPermission("seo.edit");
  const parsed = z.object({ pageId: z.uuid(), revisionId: z.uuid(), lockVersion: z.number().int().positive() }).safeParse({ pageId, revisionId, lockVersion });
  if (!parsed.success) return { ok: false, message: "The selected version is invalid." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_restore_page_revision", {
    requested_page_id: parsed.data.pageId,
    requested_revision_id: parsed.data.revisionId,
    expected_lock_version: parsed.data.lockVersion,
  });
  if (error) return mutationError(error);

  const result = restoredResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The restored version is invalid." };
  revalidatePath(`/dashboard/pages/${pageId}`);
  return {
    ok: true,
    lockVersion: result.data.lockVersion,
    updatedAt: result.data.updatedAt,
    message: "Version restored as a draft.",
    draft: { hero: parsePageHero(result.data.hero), seo: parsePageSeo(result.data.seo) },
  };
}

export async function saveAboutDraft(
  pageId: string,
  lockVersion: number,
  sections: AboutSectionsData,
  seo: PageSeoData,
  createRevision = false,
): Promise<PageMutationResult> {
  await requireCmsPermission("content.edit");
  await requireCmsPermission("seo.edit");
  const parsed = aboutMutationInputSchema.safeParse({ pageId, lockVersion, sections, seo });
  if (!parsed.success) return { ok: false, message: "Some page fields are invalid." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_save_about_draft", {
    requested_page_id: parsed.data.pageId,
    expected_lock_version: parsed.data.lockVersion,
    sections_data: asJson(parsed.data.sections),
    seo_data: asJson(parsed.data.seo),
    create_revision: createRevision,
  });
  if (error) return mutationError(error);

  const result = rpcResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The server returned an invalid save result." };
  revalidatePath(`/dashboard/pages/${pageId}`);
  return { ok: true, ...result.data, message: createRevision ? "Version saved." : undefined };
}

export async function publishAboutPage(
  pageId: string,
  lockVersion: number,
  sections: AboutSectionsData,
  seo: PageSeoData,
): Promise<PageMutationResult> {
  await requireCmsPermission("content.publish");
  await requireCmsPermission("seo.publish");
  const parsed = aboutMutationInputSchema.safeParse({ pageId, lockVersion, sections, seo });
  if (!parsed.success) return { ok: false, message: "Some page fields are invalid." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_publish_about_page", {
    requested_page_id: parsed.data.pageId,
    expected_lock_version: parsed.data.lockVersion,
    sections_data: asJson(parsed.data.sections),
    seo_data: asJson(parsed.data.seo),
  });
  if (error) return mutationError(error);

  const result = rpcResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The server returned an invalid publish result." };
  const { data: publishedPage } = await supabase.from("pages").select("path").eq("id", pageId).maybeSingle();
  if (publishedPage?.path) revalidatePath(publishedPage.path);
  revalidatePath("/dashboard/pages");
  revalidatePath(`/dashboard/pages/${pageId}`);
  return { ok: true, ...result.data, message: "Page published." };
}

export async function restoreAboutRevision(
  pageId: string,
  revisionId: string,
  lockVersion: number,
): Promise<PageMutationResult & { sections?: AboutSectionsData; seo?: PageSeoData }> {
  await requireCmsPermission("content.edit");
  await requireCmsPermission("seo.edit");
  const parsed = z.object({ pageId: z.uuid(), revisionId: z.uuid(), lockVersion: z.number().int().positive() }).safeParse({ pageId, revisionId, lockVersion });
  if (!parsed.success) return { ok: false, message: "The selected version is invalid." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_restore_about_revision", {
    requested_page_id: parsed.data.pageId,
    requested_revision_id: parsed.data.revisionId,
    expected_lock_version: parsed.data.lockVersion,
  });
  if (error) return mutationError(error);

  const result = aboutRestoredResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The restored version is invalid." };
  revalidatePath(`/dashboard/pages/${pageId}`);
  return {
    ok: true,
    lockVersion: result.data.lockVersion,
    updatedAt: result.data.updatedAt,
    message: "Version restored as a draft.",
    sections: parseAboutSections((result.data.sections as Record<string, unknown>) ?? {}),
    seo: parsePageSeo(result.data.seo),
  };
}

export async function deletePage(pageId: string): Promise<{ ok: boolean; message: string }> {
  await requireCmsPermission("content.purge");
  const parsed = z.uuid().safeParse(pageId);
  if (!parsed.success) return { ok: false, message: "The page ID is invalid." };

  const supabase = await createSupabaseServerClient();
  const { data: pageToDelete } = await supabase.from("pages").select("path").eq("id", parsed.data).maybeSingle();
  const { data, error } = await supabase.from("pages").delete().eq("id", parsed.data).select("id").maybeSingle();
  if (error) return { ok: false, message: error.message };
  if (!data) return { ok: false, message: "Deleting pages requires an MFA-verified Super Admin session." };
  if (pageToDelete?.path) revalidatePath(pageToDelete.path);
  revalidatePath("/dashboard/pages");
  return { ok: true, message: "Page deleted." };
}

export async function prepareHeroUpload(input: z.infer<typeof uploadRequestSchema>): Promise<UploadPreparation> {
  const user = await requireCmsPermission("media.create");
  const parsed = uploadRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Choose a JPG, PNG, WebP, or AVIF image under 15 MB." };

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("media_assets")
    .select("id,bucket,storage_path")
    .eq("checksum", parsed.data.checksum)
    .eq("status", "ready")
    .maybeSingle();
  if (existing) {
    const { data: publicUrl } = supabase.storage.from(existing.bucket).getPublicUrl(existing.storage_path);
    return { ok: true, existing: true, assetId: existing.id, url: publicUrl.publicUrl };
  }

  const path = `pages/${parsed.data.pageId}/hero/${user.id}/${crypto.randomUUID()}-${safeFileName(parsed.data.fileName)}`;
  const { data, error } = await supabase.storage.from("site-media").createSignedUploadUrl(path);
  if (error) return { ok: false, message: error.message };
  return { ok: true, existing: false, path, token: data.token };
}

export async function finalizeHeroUpload(input: z.infer<typeof finalizeUploadSchema>) {
  const user = await requireCmsPermission("media.create");
  const parsed = finalizeUploadSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "The uploaded image details are invalid." };
  if (!parsed.data.storagePath.startsWith(`pages/${parsed.data.pageId}/hero/${user.id}/`)) {
    return { ok: false as const, message: "The uploaded image path is invalid." };
  }

  const supabase = await createSupabaseServerClient();
  const slash = parsed.data.storagePath.lastIndexOf("/");
  const folder = parsed.data.storagePath.slice(0, slash);
  const objectName = parsed.data.storagePath.slice(slash + 1);
  const { data: objects, error: listError } = await supabase.storage
    .from("site-media")
    .list(folder, { search: objectName, limit: 1 });
  if (listError || !objects?.some((object) => object.name === objectName)) {
    return { ok: false as const, message: "The uploaded image could not be verified." };
  }

  const { data: asset, error } = await supabase
    .from("media_assets")
    .insert({
      bucket: "site-media",
      storage_path: parsed.data.storagePath,
      original_name: parsed.data.fileName,
      mime_type: parsed.data.mimeType,
      byte_size: parsed.data.byteSize,
      width: parsed.data.width,
      height: parsed.data.height,
      checksum: parsed.data.checksum,
      alt_text: parsed.data.altText,
      status: "ready",
      uploaded_by: user.id,
    })
    .select("id,bucket,storage_path")
    .single();
  if (error) return { ok: false as const, message: error.message };

  const { data: publicUrl } = supabase.storage.from(asset.bucket).getPublicUrl(asset.storage_path);
  return { ok: true as const, assetId: asset.id, url: publicUrl.publicUrl };
}
