import { z } from "zod";

export const managedContentTypeSchema = z.enum(["hospitality", "destination", "destination_place", "destination_attraction", "cruise", "brand"]);
export type ManagedContentType = z.infer<typeof managedContentTypeSchema>;

export const imageSchema = z.object({
  assetId: z.uuid().nullable().default(null),
  url: z.string().trim().max(2000).default(""),
  alt: z.string().trim().max(180).default(""),
  caption: z.string().trim().max(240).default(""),
});
export const seoSchema = z.object({ title: z.string().trim().max(70).default(""), description: z.string().trim().max(170).default(""), keywords: z.array(z.string().trim().min(1).max(80)).max(30).default([]), canonicalUrl: z.string().trim().max(500).default(""), openGraph: z.object({ title: z.string().trim().max(100).default(""), description: z.string().trim().max(220).default(""), image: z.string().trim().max(2000).default("") }).default({ title: "", description: "", image: "" }) });
export type ManagedSeo = z.infer<typeof seoSchema>;

export const hospitalityShowcaseRegions = ["coastal-sanctuaries", "tropical-retreats", "nile-cruises", "european-elegance", "urban-centers"] as const;
export type HospitalityShowcaseRegion = (typeof hospitalityShowcaseRegions)[number];

export const hospitalityShowcaseIcons = ["Building2", "Ship", "Sun", "Wind", "Trees", "Briefcase", "Landmark", "UtensilsCrossed", "Wine", "MapPin", "Crown", "Anchor"] as const;
export type HospitalityShowcaseIcon = (typeof hospitalityShowcaseIcons)[number];

export const contentSchema = z.object({
  title: z.string().trim().min(2).max(140), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), shortDescription: z.string().trim().max(500).default(""), fullDescription: z.string().trim().max(12000).default(""),
  country: z.string().trim().max(120).nullable().default(null), region: z.string().trim().max(160).nullable().default(null), location: z.string().trim().max(220).nullable().default(null),
  categoryId: z.uuid().nullable().default(null), rooms: z.number().int().nonnegative().nullable().default(null), cabins: z.number().int().nonnegative().nullable().default(null), suites: z.number().int().nonnegative().nullable().default(null), facilities: z.array(z.string().trim().min(1).max(160)).max(50).default([]), diningOptions: z.array(z.string().trim().min(1).max(160)).max(50).default([]), accessibility: z.array(z.string().trim().min(1).max(160)).max(50).default([]), gallery: z.array(imageSchema).max(40).default([]), displayOrder: z.number().int().min(0).max(99999).default(0), isActive: z.boolean().default(true),
  showcaseRegion: z.enum(hospitalityShowcaseRegions).nullable().default(null),
  showcaseIcon: z.enum(hospitalityShowcaseIcons).nullable().default(null),
});
export type ManagedContent = z.infer<typeof contentSchema>;
export const draftSchema = z.object({ content: contentSchema, seo: seoSchema, parentId: z.uuid().nullable().default(null) });
export type ManagedDraft = z.infer<typeof draftSchema>;

/**
 * Gallery images may be an absolute http(s) URL (external or uploaded to
 * Supabase Storage) or a root-relative path into this site's own
 * /public/images (e.g. "/images/foo.jpg") — never a protocol-relative
 * ("//host/x"), data:, or other scheme, which could point at an
 * attacker-controlled host or inline payload.
 */
export function isValidExternalImageUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function validateGalleryUrls(content: ManagedContent): string | null {
  for (const [index, image] of content.gallery.entries()) {
    if (!image.url || !isValidExternalImageUrl(image.url)) {
      return `Gallery image ${index + 1} needs a valid image URL (either "/images/..." or a full http(s):// link).`;
    }
  }
  return null;
}

export function parseContent(value: unknown, fallback: { title: string; slug: string; sortOrder: number; isActive: boolean }): ManagedContent {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const parsed = contentSchema.safeParse({
    title: source.title ?? source.name ?? fallback.title, slug: source.slug ?? fallback.slug, shortDescription: source.shortDescription ?? source.summary ?? source.subtitle ?? "", fullDescription: source.fullDescription ?? source.description ?? "",
    country: source.country && typeof source.country === "object" ? (source.country as Record<string, unknown>).code ?? null : source.country ?? null, region: source.region ?? (source.country && typeof source.country === "object" ? (source.country as Record<string, unknown>).region ?? null : null), location: source.location ?? null,
    categoryId: source.categoryId ?? null, rooms: source.rooms ?? null, cabins: source.cabins ?? null, suites: source.suites ?? null, facilities: source.facilities ?? [], diningOptions: source.diningOptions ?? [], accessibility: source.accessibility ?? [], gallery: source.gallery ?? [], displayOrder: source.displayOrder ?? source.sortOrder ?? fallback.sortOrder, isActive: source.isActive ?? fallback.isActive,
    showcaseRegion: source.showcaseRegion ?? null, showcaseIcon: source.showcaseIcon ?? null,
  });
  return parsed.success ? parsed.data : contentSchema.parse({ title: fallback.title, slug: fallback.slug, displayOrder: fallback.sortOrder, isActive: fallback.isActive });
}

export function parseSeo(value: unknown): ManagedSeo { const parsed = seoSchema.safeParse(value); return parsed.success ? parsed.data : seoSchema.parse({}); }
