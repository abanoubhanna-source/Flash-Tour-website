import type { Json } from "@/types/database.generated";
import type { PageHeroData, PageSeoData } from "./schema";
import type { AboutSectionsData } from "./about-schema";

export type CmsPageSummary = {
  id: string;
  name: string;
  path: string;
  key: string;
  locale: string;
  enabled: boolean;
  updatedAt: string;
};

export type CmsPageRevision = {
  id: string;
  version: number;
  event: "draft_saved" | "published" | "unpublished" | "archived" | "restored";
  snapshot: Json;
  createdAt: string;
  authorName: string | null;
};

export type CmsPageEditorData = CmsPageSummary & {
  templateKey: string;
  lockVersion: number;
  heroSectionId: string;
  hero: PageHeroData;
  publishedHero: PageHeroData | null;
  seoEntryId: string;
  seo: PageSeoData;
  publishedSeo: PageSeoData | null;
  revisions: CmsPageRevision[];
};

export type CmsAboutPageEditorData = CmsPageSummary & {
  templateKey: string;
  lockVersion: number;
  sections: AboutSectionsData;
  publishedSections: AboutSectionsData | null;
  seoEntryId: string;
  seo: PageSeoData;
  publishedSeo: PageSeoData | null;
  revisions: CmsPageRevision[];
};

export type PageMutationResult =
  | { ok: true; lockVersion: number; updatedAt: string; message?: string }
  | { ok: false; message: string; conflict?: boolean; fieldErrors?: Record<string, string[]> };
