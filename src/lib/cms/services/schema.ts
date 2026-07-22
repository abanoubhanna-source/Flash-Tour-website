import { z } from "zod";

const serviceImageSchema = z.object({
  assetId: z.uuid().nullable().default(null),
  url: z.string().trim().max(2000).default(""),
  alt: z.string().trim().max(180).default(""),
});

export const serviceContentSchema = z.object({
  title: z.string().trim().min(2, "Service title is required.").max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug."),
  description: z.string().trim().min(1, "Description is required.").max(5000),
  image: serviceImageSchema.default({ assetId: null, url: "", alt: "" }),
  eyebrow: z.string().trim().max(80).default("Service"),
  iconKey: z.string().trim().max(50).default("globe"),
  sortOrder: z.number().int().min(0).max(9999).default(0),
});

export const serviceSeoSchema = z.object({
  title: z.string().trim().max(70).default(""),
  description: z.string().trim().max(170).default(""),
  canonicalPath: z.string().trim().max(500).default("/services"),
  ogImage: z.string().trim().max(2000).default(""),
});

export const serviceDraftSchema = z.object({
  content: serviceContentSchema,
  seo: serviceSeoSchema,
});

export const createServiceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug."),
  locale: z.string().trim().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/).default("en"),
});

export type ServiceContentData = z.infer<typeof serviceContentSchema>;
export type ServiceSeoData = z.infer<typeof serviceSeoSchema>;
export type ServiceDraftData = z.infer<typeof serviceDraftSchema>;

export function parseServiceContent(value: unknown): ServiceContentData {
  const parsed = serviceContentSchema.safeParse(value);
  if (parsed.success) return parsed.data;
  return {
    title: "Untitled service",
    slug: "untitled-service",
    description: "Add a service description.",
    image: { assetId: null, url: "/images/services-hero.jpg", alt: "" },
    eyebrow: "Service",
    iconKey: "globe",
    sortOrder: 0,
  };
}

export function parseServiceSeo(value: unknown): ServiceSeoData {
  const parsed = serviceSeoSchema.safeParse(value);
  return parsed.success
    ? parsed.data
    : { title: "", description: "", canonicalPath: "/services", ogImage: "" };
}
