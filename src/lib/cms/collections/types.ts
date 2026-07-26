import type { Json } from "@/types/database.generated";
import type { ManagedContent, ManagedContentType, ManagedSeo } from "./schema";

export type CmsCollectionSummary = { id: string; type: ManagedContentType; title: string; slug: string; status: "draft" | "published" | "archived"; active: boolean; sortOrder: number; updatedAt: string; lockVersion: number; parentId: string | null; parentTitle: string | null; childCount: number; country: string | null; region: string | null; categoryId: string | null };
export type CmsCollectionRevision = { id: string; version: number; event: string; snapshot: Json; createdAt: string; authorName: string | null };
export type CmsCollectionEditor = CmsCollectionSummary & { content: ManagedContent; seo: ManagedSeo; revisions: CmsCollectionRevision[]; categories: { id: string; key: string; name: string }[]; parents: { id: string; title: string; type: ManagedContentType }[] };
export type MutationResult = { ok: true; id?: string; lockVersion?: number; updatedAt?: string; message: string } | { ok: false; message: string; conflict?: boolean; fieldErrors?: Record<string, string[]> };
