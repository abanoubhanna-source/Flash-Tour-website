import { z } from "zod";

const linkSchema = z.object({
  label: z.string().trim().max(80).default(""),
  href: z.string().trim().max(500).default(""),
});

const imageSchema = z.object({
  assetId: z.uuid().nullable().default(null),
  url: z.string().trim().max(2000).default(""),
  alt: z.string().trim().max(180).default(""),
});

export const pageHeroSlideSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(80),
  eyebrow: z.string().trim().max(120).default(""),
  title: z.string().trim().min(1).max(140),
  subtitle: z.string().trim().max(500).default(""),
  primaryCta: linkSchema.default({ label: "", href: "" }),
  secondaryCta: linkSchema.default({ label: "", href: "" }),
  image: imageSchema.default({ assetId: null, url: "", alt: "" }),
  enabled: z.boolean().default(true),
});

export const pageHeroSchema = z.object({
  eyebrow: z.string().trim().max(120).default(""),
  title: z.string().trim().min(1, "Page title is required.").max(140),
  subtitle: z.string().trim().max(500).default(""),
  primaryCta: linkSchema.default({ label: "", href: "" }),
  secondaryCta: linkSchema.default({ label: "", href: "" }),
  image: imageSchema.default({ assetId: null, url: "", alt: "" }),
  slides: z.array(pageHeroSlideSchema).min(0).max(4).default([]),
});

export const pageSeoSchema = z.object({
  title: z.string().trim().max(70).default(""),
  description: z.string().trim().max(170).default(""),
  canonicalPath: z.string().trim().max(500).default(""),
  ogImage: z.string().trim().max(2000).default(""),
});

export const pageDraftSchema = z.object({
  hero: pageHeroSchema,
  seo: pageSeoSchema,
});

export const createPageSchema = z.object({
  name: z.string().trim().min(2).max(80),
  path: z.string().trim().regex(/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/?)?$/, "Use a valid website path."),
  key: z.string().trim().regex(/^[a-z][a-z0-9_]*$/, "Use lowercase letters, numbers, and underscores."),
  locale: z.string().trim().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/).default("en"),
});

export type PageHeroData = z.infer<typeof pageHeroSchema>;
export type PageHeroSlideData = z.infer<typeof pageHeroSlideSchema>;
export type PageSeoData = z.infer<typeof pageSeoSchema>;
export type PageDraftData = z.infer<typeof pageDraftSchema>;

export const defaultPageHero: PageHeroData = {
  eyebrow: "",
  title: "New page",
  subtitle: "",
  primaryCta: { label: "", href: "" },
  secondaryCta: { label: "", href: "" },
  image: { assetId: null, url: "/images/egypt-bg.jpg", alt: "" },
  slides: [],
};

export const defaultPageSeo: PageSeoData = {
  title: "",
  description: "",
  canonicalPath: "",
  ogImage: "",
};

export function parsePageHero(value: unknown): PageHeroData {
  const parsed = pageHeroSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultPageHero;
}

export function parsePageSeo(value: unknown): PageSeoData {
  const parsed = pageSeoSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultPageSeo;
}
