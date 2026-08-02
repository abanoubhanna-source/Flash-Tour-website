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

export const hospitalityTransportationSectionSchema = z.object({
  heading: z.string().trim().max(140).default("Unmatched VIP Transportation"),
  description: z.string().trim().max(600).default(
    "Corporate travel requires precision. Our massive, fully-owned fleet of VIP coaches, luxury sedans, and 4x4s ensures that your delegates are moved with absolute safety, punctuality, and prestige.",
  ),
  features: z.array(z.string().trim().max(120)).min(0).max(8).default([
    "Over 150+ owned vehicles globally",
    "Latest luxury models",
    "In-house maintenance",
    "GPS tracked operations",
    "Highly trained chauffeurs",
  ]),
  image: imageSchema.default({ assetId: null, url: "/images/fleet-showcase.jpg", alt: "Flash Group VIP Fleet" }),
});

export const hospitalityRegionIconSchema = z.enum(["Ship", "Waves", "Palmtree", "Map", "Building2"]);

export const hospitalityRegionCardSchema = z.object({
  id: z.string().trim().min(1).max(40),
  tag: z.string().trim().max(60).default(""),
  title: z.string().trim().max(140).default(""),
  subtitle: z.string().trim().max(160).default(""),
  desc: z.string().trim().max(600).default(""),
  icon: hospitalityRegionIconSchema.default("Ship"),
  link: z.string().trim().max(200).default(""),
  image: imageSchema.default({ assetId: null, url: "", alt: "" }),
  features: z.array(z.string().trim().max(120)).min(0).max(6).default([]),
});

const defaultHospitalityRegions = [
  {
    id: "nile",
    tag: "THE NILE RIVER",
    title: "The River Fleet",
    subtitle: "Sailing the Nile in Absolute Luxury",
    desc: "We don't just cruise the Nile; we own its finest vessels. Our fleet of 8 luxury floating hotels and dahabiyas, including our flagship line and two artisan-crafted dahabiyas, guarantees an unmatched river hospitality experience where every detail is under our direct control.",
    icon: "Ship" as const,
    link: "/hospitality/nile-cruises",
    image: { assetId: null, url: "/images/cruise-1.jpg", alt: "The River Fleet" },
    features: ["Nile Serenity Flagship Cruise", "Two Artisan-Crafted Dahabiyas", "Gourmet Dining & Lounge Bars", "Exclusive Docking Rights"],
  },
  {
    id: "red-sea",
    tag: "THE RED SEA",
    title: "Coastal Sanctuaries",
    subtitle: "Mastering the Land and Sea",
    desc: "From the golden sands to the deep blue. You will find our signature hospitality at the 5-Star True Beach Resort in Marsa Alam, complemented by our private motorboats and diving yachts dominating the coastline.",
    icon: "Waves" as const,
    link: "/hospitality/coastal-sanctuaries",
    image: { assetId: null, url: "/images/true-beach.jpg", alt: "Coastal Sanctuaries" },
    features: ["True Beach Resort (Family & Adults-Only)", "Flash Yachting (Flash 3, 4, 5)", "Exquisite Private Beaches", "World-Class Spa & Kitesurfing Hub"],
  },
  {
    id: "indian-ocean",
    tag: "THE INDIAN OCEAN",
    title: "Tropical Retreats",
    subtitle: "Zanzibar's Premium Estates",
    desc: "Our footprint extends to the exotic shores of Tanzania. At our fully-owned Kiwengwa Beach Resort in Zanzibar, we deliver the Flash Group standard of luxury wrapped in a breathtaking tropical environment.",
    icon: "Palmtree" as const,
    link: "/hospitality/tropical-retreats",
    image: { assetId: null, url: "/images/zanzibar-resort.jpg", alt: "Tropical Retreats" },
    features: ["Kiwengwa Beach Resort", "Exclusive White Sand Beaches", "Premium Safari Integrations", "Tropical Corporate Retreats"],
  },
  {
    id: "mediterranean",
    tag: "THE MEDITERRANEAN",
    title: "European Elegance",
    subtitle: "The Italian Collection",
    desc: "A strategic, commanding presence in Europe's most elite destinations. Our curated collection of 7 exclusive properties across Sardinia and Sicily proves that our hospitality knows no borders.",
    icon: "Map" as const,
    link: "/hospitality/european-elegance",
    image: { assetId: null, url: "/images/italy-resorts.jpg", alt: "European Elegance" },
    features: ["7 Exclusive Italian Resorts", "Sardinia & Sicily Prime Locations", "Authentic Mediterranean Hospitality", "Elite European MICE Capabilities"],
  },
  {
    id: "urban",
    tag: "URBAN CENTERS",
    title: "Heritage & Fine Dining",
    subtitle: "A Century of Elegance in Cairo",
    desc: "In the heart of the city, our hospitality takes a cultural form. We preserve history through meticulously restored 100-year-old boutique villas and elevate the culinary scene with our award-winning dining lounges.",
    icon: "Building2" as const,
    link: "/hospitality/urban-centers",
    image: { assetId: null, url: "/images/boutique-hotel.jpg", alt: "Heritage & Fine Dining" },
    features: ["1920s Boutique Hotel (Heliopolis)", "Carlo's Restaurant (Historic Gardens)", "Rossini Italian Fine Dining", "Personalized VIP Concierge"],
  },
];

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
  transportation: hospitalityTransportationSectionSchema.default({
    heading: "Unmatched VIP Transportation",
    description:
      "Corporate travel requires precision. Our massive, fully-owned fleet of VIP coaches, luxury sedans, and 4x4s ensures that your delegates are moved with absolute safety, punctuality, and prestige.",
    features: [
      "Over 150+ owned vehicles globally",
      "Latest luxury models",
      "In-house maintenance",
      "GPS tracked operations",
      "Highly trained chauffeurs",
    ],
    image: { assetId: null, url: "/images/fleet-showcase.jpg", alt: "Flash Group VIP Fleet" },
  }),
  hospitalityRegions: z.array(hospitalityRegionCardSchema).length(5).default(defaultHospitalityRegions),
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
export type HospitalityTransportationSectionData = z.infer<typeof hospitalityTransportationSectionSchema>;
export type HospitalityRegionCardData = z.infer<typeof hospitalityRegionCardSchema>;

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
  transportation: {
    heading: "Unmatched VIP Transportation",
    description:
      "Corporate travel requires precision. Our massive, fully-owned fleet of VIP coaches, luxury sedans, and 4x4s ensures that your delegates are moved with absolute safety, punctuality, and prestige.",
    features: [
      "Over 150+ owned vehicles globally",
      "Latest luxury models",
      "In-house maintenance",
      "GPS tracked operations",
      "Highly trained chauffeurs",
    ],
    image: { assetId: null, url: "/images/fleet-showcase.jpg", alt: "Flash Group VIP Fleet" },
  },
  hospitalityRegions: defaultHospitalityRegions,
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
