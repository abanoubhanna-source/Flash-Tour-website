import "server-only";

import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnvironment } from "@/lib/supabase/env";
import type { Database } from "@/types/database.generated";
import { parsePageHero, parsePageSeo } from "./schema";
import type { PageHeroData, PageSeoData } from "./schema";

export type PublishedPageContent = {
  hero: PageHeroData;
  seo: PageSeoData | null;
};

export const getPublishedPageContent = cache(
  async (path: string, locale = "en"): Promise<PublishedPageContent | null> => {
    try {
      const environment = getPublicSupabaseEnvironment();
      const supabase = createClient<Database>(
        environment.NEXT_PUBLIC_SUPABASE_URL,
        environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        { auth: { persistSession: false, autoRefreshToken: false } },
      );
      const { data: page, error: pageError } = await supabase
        .from("published_pages")
        .select("id")
        .eq("path", path)
        .eq("locale", locale)
        .maybeSingle();

      if (pageError || !page?.id) return null;

      const [{ data: section }, { data: seo }] = await Promise.all([
        supabase
          .from("published_page_sections")
          .select("data")
          .eq("page_id", page.id)
          .eq("key", "hero")
          .maybeSingle(),
        supabase
          .from("published_seo_entries")
          .select("data")
          .eq("page_id", page.id)
          .eq("locale", locale)
          .maybeSingle(),
      ]);

      if (!section?.data) return null;
      return {
        hero: parsePageHero(section.data),
        seo: seo?.data ? parsePageSeo(seo.data) : null,
      };
    } catch {
      return null;
    }
  },
);
