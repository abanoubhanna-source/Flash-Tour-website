import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnvironment } from "@/lib/supabase/env";
import type { Database, Json } from "@/types/database.generated";

type PublicContentType = "service" | "destination" | "hospitality" | "cruise" | "brand";
export type PublishedCollectionEntry = { id: string; slug: string; title: string; sortOrder: number; data: Json };

export function publicData(entry: PublishedCollectionEntry): Record<string, Json | undefined> {
  const data = entry.data;
  return data && typeof data === "object" && !Array.isArray(data) ? data : {};
}

export async function getPublishedCollection(type: PublicContentType): Promise<PublishedCollectionEntry[]> {
  try {
    const env = getPublicSupabaseEnvironment();
    const supabase = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.from("published_content_entries").select("id,slug,title,sort_order,data").eq("content_type", type).order("sort_order");
    if (error) return [];
    return data.filter((entry): entry is typeof entry & { id: string; slug: string; title: string; sort_order: number } => Boolean(entry.id && entry.slug && entry.title && entry.sort_order !== null)).map((entry) => ({ id: entry.id, slug: entry.slug, title: entry.title, sortOrder: entry.sort_order, data: entry.data }));
  } catch { return []; }
}
