import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnvironment } from "@/lib/supabase/env";
import { getPublishedCollection } from "@/lib/cms/public-content";
import { parseDestinationSeo, type DestinationSeoData } from "./schema";

export async function getPublishedDestinationSeo(slug: string): Promise<DestinationSeoData | null> {
  try {
    const entries = await getPublishedCollection("destination");
    const entry = entries.find((item) => item.slug === slug);
    if (!entry) return null;

    const env = getPublicSupabaseEnvironment();
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await supabase.from("published_seo_entries").select("data").eq("content_entry_id", entry.id).maybeSingle();
    return data?.data ? parseDestinationSeo(data.data) : null;
  } catch {
    return null;
  }
}
