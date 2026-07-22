import type { Json } from "@/types/database.generated";
import type { ServiceContentData, ServiceSeoData } from "./schema";

export type CmsServiceSummary = {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: "draft" | "published" | "archived";
  sortOrder: number;
  updatedAt: string;
};

export type CmsServiceRevision = {
  id: string;
  version: number;
  event: "draft_saved" | "published" | "unpublished" | "archived" | "restored";
  snapshot: Json;
  createdAt: string;
  authorName: string | null;
};

export type CmsServiceEditorData = CmsServiceSummary & {
  lockVersion: number;
  content: ServiceContentData;
  publishedContent: ServiceContentData | null;
  seo: ServiceSeoData;
  publishedSeo: ServiceSeoData | null;
  revisions: CmsServiceRevision[];
};

export type ServiceMutationResult =
  | { ok: true; lockVersion: number; updatedAt: string; message?: string }
  | { ok: false; message: string; conflict?: boolean; fieldErrors?: Record<string, string[]> };
