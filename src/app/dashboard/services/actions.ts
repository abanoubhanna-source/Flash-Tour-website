"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCmsPermission } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.generated";
import {
  createServiceSchema,
  parseServiceContent,
  parseServiceSeo,
  serviceDraftSchema,
  type ServiceDraftData,
} from "@/lib/cms/services/schema";
import type { ServiceMutationResult } from "@/lib/cms/services/types";

const mutationSchema = z.object({ serviceId: z.uuid(), lockVersion: z.number().int().positive(), draft: serviceDraftSchema });
const rpcResultSchema = z.object({ lockVersion: z.number().int().positive(), updatedAt: z.string() });
const restoredResultSchema = rpcResultSchema.extend({ content: z.unknown(), seo: z.unknown() });
const uploadRequestSchema = z.object({
  serviceId: z.uuid(), fileName: z.string().trim().min(1).max(180),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"]),
  byteSize: z.number().int().positive().max(15_728_640), checksum: z.string().regex(/^[a-f0-9]{64}$/),
});
const finalizeUploadSchema = uploadRequestSchema.extend({
  storagePath: z.string().trim().min(1).max(500), width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(), altText: z.string().trim().max(180),
});

export type CreateServiceState = { status: "idle" | "error"; message?: string; fieldErrors?: Record<string, string[]>; serviceId?: string };
export type ServiceUploadPreparation =
  | { ok: true; existing: true; assetId: string; url: string }
  | { ok: true; existing: false; path: string; token: string }
  | { ok: false; message: string };

function asJson(value: unknown): Json { return value as Json; }
function safeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const base = fileName.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "service";
  return `${base}.${extension}`;
}
function mutationError(error: { code?: string; message: string }): ServiceMutationResult {
  if (error.code === "40001") return { ok: false, conflict: true, message: "This service changed in another session. Reload before continuing." };
  if (error.code === "42501") return { ok: false, message: "This action needs additional permission or an MFA-verified session." };
  if (error.code === "23505") return { ok: false, message: "Another service already uses this slug." };
  return { ok: false, message: error.message || "The service could not be saved." };
}

export async function createService(_state: CreateServiceState, formData: FormData): Promise<CreateServiceState> {
  await requireCmsPermission("content.create");
  await requireCmsPermission("seo.edit");
  const parsed = createServiceSchema.safeParse({ title: formData.get("title"), slug: formData.get("slug"), locale: formData.get("locale") || "en" });
  if (!parsed.success) return { status: "error", message: "Check the service details and try again.", fieldErrors: parsed.error.flatten().fieldErrors };
  const content = {
    title: parsed.data.title, slug: parsed.data.slug, description: "Add a service description.",
    image: { assetId: null, url: "/images/services-hero.jpg", alt: parsed.data.title },
    eyebrow: "Service", iconKey: "globe", sortOrder: 0,
  };
  const seo = { title: `${parsed.data.title} | Flash Group`, description: "", canonicalPath: "/services", ogImage: "/images/services-hero.jpg" };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_create_service", {
    requested_title: parsed.data.title, requested_slug: parsed.data.slug, requested_locale: parsed.data.locale,
    content_data: asJson(content), seo_data: asJson(seo),
  });
  if (error) return { status: "error", message: error.code === "23505" ? "A service already uses this slug." : error.message };
  revalidatePath("/dashboard/services");
  return { status: "idle", serviceId: data };
}

export async function saveServiceDraft(serviceId: string, lockVersion: number, draft: ServiceDraftData, createRevision = false): Promise<ServiceMutationResult> {
  await requireCmsPermission("content.edit"); await requireCmsPermission("seo.edit");
  const parsed = mutationSchema.safeParse({ serviceId, lockVersion, draft });
  if (!parsed.success) return { ok: false, message: "Some service fields are invalid.", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_save_service_draft", {
    requested_service_id: parsed.data.serviceId, expected_lock_version: parsed.data.lockVersion,
    content_data: asJson(parsed.data.draft.content), seo_data: asJson(parsed.data.draft.seo), create_revision: createRevision,
  });
  if (error) return mutationError(error);
  const result = rpcResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The server returned an invalid save result." };
  revalidatePath(`/dashboard/services/${serviceId}`); revalidatePath("/dashboard/services");
  return { ok: true, ...result.data, message: createRevision ? "Version saved." : undefined };
}

export async function publishService(serviceId: string, lockVersion: number, draft: ServiceDraftData): Promise<ServiceMutationResult> {
  await requireCmsPermission("content.publish"); await requireCmsPermission("seo.publish");
  const parsed = mutationSchema.safeParse({ serviceId, lockVersion, draft });
  if (!parsed.success) return { ok: false, message: "Some service fields are invalid." };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_publish_service", {
    requested_service_id: parsed.data.serviceId, expected_lock_version: parsed.data.lockVersion,
    content_data: asJson(parsed.data.draft.content), seo_data: asJson(parsed.data.draft.seo),
  });
  if (error) return mutationError(error);
  const result = rpcResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The server returned an invalid publish result." };
  revalidatePath("/services"); revalidatePath("/api/services"); revalidatePath("/dashboard/services"); revalidatePath(`/dashboard/services/${serviceId}`);
  return { ok: true, ...result.data, message: "Service published." };
}

export async function unpublishService(serviceId: string, lockVersion: number): Promise<ServiceMutationResult> {
  await requireCmsPermission("content.publish"); await requireCmsPermission("seo.publish");
  const parsed = z.object({ serviceId: z.uuid(), lockVersion: z.number().int().positive() }).safeParse({ serviceId, lockVersion });
  if (!parsed.success) return { ok: false, message: "The service request is invalid." };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_unpublish_service", { requested_service_id: parsed.data.serviceId, expected_lock_version: parsed.data.lockVersion });
  if (error) return mutationError(error);
  const result = rpcResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The server returned an invalid result." };
  revalidatePath("/services"); revalidatePath("/api/services"); revalidatePath("/dashboard/services"); revalidatePath(`/dashboard/services/${serviceId}`);
  return { ok: true, ...result.data, message: "Service moved to draft." };
}

export async function restoreServiceRevision(serviceId: string, revisionId: string, lockVersion: number): Promise<ServiceMutationResult & { draft?: ServiceDraftData }> {
  await requireCmsPermission("content.edit"); await requireCmsPermission("seo.edit");
  const parsed = z.object({ serviceId: z.uuid(), revisionId: z.uuid(), lockVersion: z.number().int().positive() }).safeParse({ serviceId, revisionId, lockVersion });
  if (!parsed.success) return { ok: false, message: "The selected version is invalid." };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("cms_restore_service_revision", {
    requested_service_id: parsed.data.serviceId, requested_revision_id: parsed.data.revisionId, expected_lock_version: parsed.data.lockVersion,
  });
  if (error) return mutationError(error);
  const result = restoredResultSchema.safeParse(data);
  if (!result.success) return { ok: false, message: "The restored version is invalid." };
  revalidatePath(`/dashboard/services/${serviceId}`);
  return { ok: true, lockVersion: result.data.lockVersion, updatedAt: result.data.updatedAt, message: "Version restored as a draft.", draft: { content: parseServiceContent(result.data.content), seo: parseServiceSeo(result.data.seo) } };
}

export async function deleteService(serviceId: string): Promise<{ ok: boolean; message: string }> {
  await requireCmsPermission("content.purge");
  const parsed = z.uuid().safeParse(serviceId); if (!parsed.success) return { ok: false, message: "The service ID is invalid." };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("content_entries").delete().eq("id", parsed.data).eq("content_type", "service").select("id").maybeSingle();
  if (error) return { ok: false, message: error.message };
  if (!data) return { ok: false, message: "Deleting services requires an MFA-verified Super Admin session." };
  revalidatePath("/services"); revalidatePath("/api/services"); revalidatePath("/dashboard/services");
  return { ok: true, message: "Service deleted." };
}

export async function prepareServiceImageUpload(input: z.infer<typeof uploadRequestSchema>): Promise<ServiceUploadPreparation> {
  const user = await requireCmsPermission("media.create"); const parsed = uploadRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Choose a JPG, PNG, WebP, or AVIF image under 15 MB." };
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase.from("media_assets").select("id,bucket,storage_path").eq("checksum", parsed.data.checksum).eq("status", "ready").maybeSingle();
  if (existing) { const { data } = supabase.storage.from(existing.bucket).getPublicUrl(existing.storage_path); return { ok: true, existing: true, assetId: existing.id, url: data.publicUrl }; }
  const path = `services/${parsed.data.serviceId}/${user.id}/${crypto.randomUUID()}-${safeFileName(parsed.data.fileName)}`;
  const { data, error } = await supabase.storage.from("site-media").createSignedUploadUrl(path);
  if (error) return { ok: false, message: error.message };
  return { ok: true, existing: false, path, token: data.token };
}

export async function finalizeServiceImageUpload(input: z.infer<typeof finalizeUploadSchema>) {
  const user = await requireCmsPermission("media.create"); const parsed = finalizeUploadSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "The uploaded image details are invalid." };
  if (!parsed.data.storagePath.startsWith(`services/${parsed.data.serviceId}/${user.id}/`)) return { ok: false as const, message: "The uploaded image path is invalid." };
  const supabase = await createSupabaseServerClient(); const slash = parsed.data.storagePath.lastIndexOf("/");
  const folder = parsed.data.storagePath.slice(0, slash); const objectName = parsed.data.storagePath.slice(slash + 1);
  const { data: objects, error: listError } = await supabase.storage.from("site-media").list(folder, { search: objectName, limit: 1 });
  if (listError || !objects?.some((object) => object.name === objectName)) return { ok: false as const, message: "The uploaded image could not be verified." };
  const { data: asset, error } = await supabase.from("media_assets").insert({
    bucket: "site-media", storage_path: parsed.data.storagePath, original_name: parsed.data.fileName,
    mime_type: parsed.data.mimeType, byte_size: parsed.data.byteSize, width: parsed.data.width, height: parsed.data.height,
    checksum: parsed.data.checksum, alt_text: parsed.data.altText, status: "ready", uploaded_by: user.id,
  }).select("id,bucket,storage_path").single();
  if (error) return { ok: false as const, message: error.message };
  const { data } = supabase.storage.from(asset.bucket).getPublicUrl(asset.storage_path);
  return { ok: true as const, assetId: asset.id, url: data.publicUrl };
}
