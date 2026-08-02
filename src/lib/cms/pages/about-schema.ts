import { z } from "zod";

export const aboutBodySectionSchema = z.object({
  title: z.string().trim().max(140).default(""),
  body: z.string().trim().max(2000).default(""),
});

export const aboutHeroIntroSchema = z.object({
  eyebrow: z.string().trim().max(120).default(""),
  title: z.string().trim().max(140).default(""),
  body: z.string().trim().max(2000).default(""),
});

export const aboutHighlightItemSchema = z.object({
  label: z.string().trim().max(80).default(""),
  value: z.string().trim().max(80).default(""),
});

export const aboutHighlightsSchema = z.object({
  title: z.string().trim().max(140).default("Highlights"),
  items: z.array(aboutHighlightItemSchema).min(0).max(10).default([]),
});

export const aboutListSchema = z.object({
  title: z.string().trim().max(140).default(""),
  items: z.array(z.string().trim().max(120)).min(0).max(20).default([]),
});

export const aboutMilestoneSchema = z.object({
  year: z.coerce.number().int().min(1900).max(2100).default(2000),
  brand: z.string().trim().max(120).default(""),
  country: z.string().trim().max(120).default(""),
});

export const aboutExpansionJourneySchema = z.object({
  title: z.string().trim().max(140).default(""),
  subtitle: z.string().trim().max(200).default(""),
  body: z.string().trim().max(2000).default(""),
  milestones: z.array(aboutMilestoneSchema).min(0).max(20).default([]),
});

const emptyBody = { title: "", body: "" };
const emptyHeroIntro = { eyebrow: "", title: "", body: "" };
const emptyHighlights = { title: "Highlights", items: [] };
const emptyList = { title: "", items: [] };
const emptyExpansionJourney = { title: "", subtitle: "", body: "", milestones: [] };

export const aboutSectionsSchema = z.object({
  hero_intro: aboutHeroIntroSchema.default(emptyHeroIntro),
  experience: aboutBodySectionSchema.default(emptyBody),
  highlights: aboutHighlightsSchema.default(emptyHighlights),
  vision: aboutBodySectionSchema.default(emptyBody),
  mission: aboutBodySectionSchema.default(emptyBody),
  services_summary: aboutListSchema.default(emptyList),
  expansion_journey: aboutExpansionJourneySchema.default(emptyExpansionJourney),
  ceo_message: aboutBodySectionSchema.default(emptyBody),
  team: aboutBodySectionSchema.default(emptyBody),
  languages: aboutListSchema.default(emptyList),
  work_process: aboutBodySectionSchema.default(emptyBody),
});

export type AboutBodySectionData = z.infer<typeof aboutBodySectionSchema>;
export type AboutHeroIntroData = z.infer<typeof aboutHeroIntroSchema>;
export type AboutHighlightsData = z.infer<typeof aboutHighlightsSchema>;
export type AboutListData = z.infer<typeof aboutListSchema>;
export type AboutExpansionJourneyData = z.infer<typeof aboutExpansionJourneySchema>;
export type AboutSectionsData = z.infer<typeof aboutSectionsSchema>;

export const aboutSectionKeys = [
  "hero_intro",
  "experience",
  "highlights",
  "vision",
  "mission",
  "services_summary",
  "expansion_journey",
  "ceo_message",
  "team",
  "languages",
  "work_process",
] as const satisfies readonly (keyof AboutSectionsData)[];

export const defaultAboutSections: AboutSectionsData = {
  hero_intro: emptyHeroIntro,
  experience: emptyBody,
  highlights: emptyHighlights,
  vision: emptyBody,
  mission: emptyBody,
  services_summary: emptyList,
  expansion_journey: emptyExpansionJourney,
  ceo_message: emptyBody,
  team: emptyBody,
  languages: emptyList,
  work_process: emptyBody,
};

export function parseAboutSections(bySectionKey: Record<string, unknown>): AboutSectionsData {
  const parsed = aboutSectionsSchema.safeParse(bySectionKey);
  return parsed.success ? parsed.data : defaultAboutSections;
}
