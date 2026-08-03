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

export const aboutBodyWithBulletsSchema = z.object({
  title: z.string().trim().max(140).default(""),
  body: z.string().trim().max(2000).default(""),
  bullets: z.array(z.string().trim().max(120)).min(0).max(8).default([]),
});

export const aboutWorkProcessBulletSchema = z.object({
  title: z.string().trim().max(120).default(""),
  desc: z.string().trim().max(300).default(""),
});

export const aboutWorkProcessSchema = z.object({
  title: z.string().trim().max(140).default(""),
  body: z.string().trim().max(2000).default(""),
  bullets: z.array(aboutWorkProcessBulletSchema).min(0).max(6).default([]),
});

export const aboutListSchema = z.object({
  title: z.string().trim().max(140).default(""),
  items: z.array(z.string().trim().max(120)).min(0).max(20).default([]),
});

const aboutImageSchema = z.object({
  assetId: z.uuid().nullable().default(null),
  url: z.string().trim().max(2000).default(""),
  alt: z.string().trim().max(180).default(""),
});

const emptyAboutImage = { assetId: null, url: "", alt: "" };

export const aboutMilestoneSchema = z.object({
  year: z.coerce.number().int().min(1900).max(2100).default(2000),
  brand: z.string().trim().max(120).default(""),
  country: z.string().trim().max(120).default(""),
  title: z.string().trim().max(140).default(""),
  desc: z.string().trim().max(600).default(""),
  image: aboutImageSchema.default(emptyAboutImage),
});

export const aboutExpansionJourneySchema = z.object({
  milestones: z.array(aboutMilestoneSchema).min(0).max(20).default([]),
});

export const aboutCeoMessageSchema = z.object({
  title: z.string().trim().max(140).default(""),
  body: z.string().trim().max(2000).default(""),
  directorName: z.string().trim().max(120).default(""),
  directorTitle: z.string().trim().max(120).default(""),
  signatureImageUrl: z.string().trim().max(2000).default(""),
});

export const aboutTeamSchema = z.object({
  title: z.string().trim().max(140).default(""),
  body: z.string().trim().max(2000).default(""),
  stats: z.string().trim().max(40).default(""),
});

const emptyBody = { title: "", body: "" };
const emptyHeroIntro = { eyebrow: "", title: "", body: "" };
const emptyBodyWithBullets = { title: "", body: "", bullets: [] };
const emptyWorkProcess = { title: "", body: "", bullets: [] };
const emptyList = { title: "", items: [] };
const emptyExpansionJourney = { milestones: [] };
const emptyCeoMessage = { title: "", body: "", directorName: "", directorTitle: "", signatureImageUrl: "" };
const emptyTeam = { title: "", body: "", stats: "" };

export const aboutSectionsSchema = z.object({
  hero_intro: aboutHeroIntroSchema.default(emptyHeroIntro),
  vision: aboutBodySectionSchema.default(emptyBody),
  mission: aboutBodySectionSchema.default(emptyBody),
  services_summary: aboutListSchema.default(emptyList),
  languages: aboutListSchema.default(emptyList),
  flawless_process: aboutListSchema.default(emptyList),
  experience: aboutBodyWithBulletsSchema.default(emptyBodyWithBullets),
  expansion_journey: aboutExpansionJourneySchema.default(emptyExpansionJourney),
  work_process: aboutWorkProcessSchema.default(emptyWorkProcess),
  ceo_message: aboutCeoMessageSchema.default(emptyCeoMessage),
  team: aboutTeamSchema.default(emptyTeam),
});

export type AboutBodySectionData = z.infer<typeof aboutBodySectionSchema>;
export type AboutHeroIntroData = z.infer<typeof aboutHeroIntroSchema>;
export type AboutBodyWithBulletsData = z.infer<typeof aboutBodyWithBulletsSchema>;
export type AboutWorkProcessData = z.infer<typeof aboutWorkProcessSchema>;
export type AboutListData = z.infer<typeof aboutListSchema>;
export type AboutExpansionJourneyData = z.infer<typeof aboutExpansionJourneySchema>;
export type AboutMilestoneData = z.infer<typeof aboutMilestoneSchema>;
export type AboutCeoMessageData = z.infer<typeof aboutCeoMessageSchema>;
export type AboutTeamData = z.infer<typeof aboutTeamSchema>;
export type AboutSectionsData = z.infer<typeof aboutSectionsSchema>;

export const aboutSectionKeys = [
  "hero_intro",
  "vision",
  "mission",
  "services_summary",
  "languages",
  "flawless_process",
  "experience",
  "expansion_journey",
  "work_process",
  "ceo_message",
  "team",
] as const satisfies readonly (keyof AboutSectionsData)[];

export const defaultAboutSections: AboutSectionsData = {
  hero_intro: emptyHeroIntro,
  vision: emptyBody,
  mission: emptyBody,
  services_summary: emptyList,
  languages: emptyList,
  flawless_process: emptyList,
  experience: emptyBodyWithBullets,
  expansion_journey: emptyExpansionJourney,
  work_process: emptyWorkProcess,
  ceo_message: emptyCeoMessage,
  team: emptyTeam,
};

export function parseAboutSections(bySectionKey: Record<string, unknown>): AboutSectionsData {
  const parsed = aboutSectionsSchema.safeParse(bySectionKey);
  return parsed.success ? parsed.data : defaultAboutSections;
}
