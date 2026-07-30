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

export const homeStatItemSchema = z.object({
  number: z.string().trim().min(1).max(20),
  label: z.string().trim().min(1).max(60),
});

export const homeCertificationSchema = z.object({
  name: z.string().trim().min(1).max(80),
  desc: z.string().trim().max(160).default(""),
  logo: z.string().trim().max(500).default(""),
});

export const homeStatsSectionSchema = z.object({
  heading: z.string().trim().max(140).default("Scale That Builds Trust"),
  items: z.array(homeStatItemSchema).min(0).max(8).default([]),
  certificationsHeading: z.string().trim().max(140).default("Certified Excellence"),
  certificationsIntro: z.string().trim().max(400).default(""),
  certifications: z.array(homeCertificationSchema).min(0).max(8).default([]),
});

export const homeMapLocationSchema = z.object({
  id: z.string().trim().min(1).max(60),
  name: z.string().trim().min(1).max(100),
  top: z.string().trim().min(1).max(10),
  left: z.string().trim().min(1).max(10),
  details: z.string().trim().max(200).default(""),
});

export const homeMapSectionSchema = z.object({
  heading: z.string().trim().max(140).default("Our Global Infrastructure"),
  intro: z.string().trim().max(600).default(""),
  checklist: z.array(z.string().trim().max(80)).min(0).max(8).default([]),
  locations: z.array(homeMapLocationSchema).min(0).max(12).default([]),
});

export const pageHeroSchema = z.object({
  eyebrow: z.string().trim().max(120).default(""),
  title: z.string().trim().min(1, "Page title is required.").max(140),
  accentTitle: z.string().trim().max(140).default(""),
  subtitle: z.string().trim().max(500).default(""),
  primaryCta: linkSchema.default({ label: "", href: "" }),
  secondaryCta: linkSchema.default({ label: "", href: "" }),
  image: imageSchema.default({ assetId: null, url: "", alt: "" }),
  slides: z.array(pageHeroSlideSchema).min(0).max(4).default([]),
  stats: homeStatsSectionSchema.default({
    heading: "Scale That Builds Trust",
    items: [],
    certificationsHeading: "Certified Excellence",
    certificationsIntro: "",
    certifications: [],
  }),
  map: homeMapSectionSchema.default({
    heading: "Our Global Infrastructure",
    intro: "",
    checklist: [],
    locations: [],
  }),
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
export type HomeStatsSectionData = z.infer<typeof homeStatsSectionSchema>;
export type HomeStatItemData = z.infer<typeof homeStatItemSchema>;
export type HomeCertificationData = z.infer<typeof homeCertificationSchema>;
export type HomeMapSectionData = z.infer<typeof homeMapSectionSchema>;
export type HomeMapLocationData = z.infer<typeof homeMapLocationSchema>;

export const defaultPageHero: PageHeroData = {
  eyebrow: "",
  title: "New page",
  accentTitle: "",
  subtitle: "",
  primaryCta: { label: "", href: "" },
  secondaryCta: { label: "", href: "" },
  image: { assetId: null, url: "/images/egypt-bg.jpg", alt: "" },
  slides: [],
  stats: { heading: "Scale That Builds Trust", items: [], certificationsHeading: "Certified Excellence", certificationsIntro: "", certifications: [] },
  map: { heading: "Our Global Infrastructure", intro: "", checklist: [], locations: [] },
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
