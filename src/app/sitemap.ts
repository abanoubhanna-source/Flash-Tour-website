import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnvironment } from "@/lib/supabase/env";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://flash-tour-group.vercel.app";

const staticPaths = [
  "",
  "/about",
  "/services",
  "/contact",
  "/brands",
  "/cruises",
  "/partner-portal",
  "/destinations",
  "/destinations/egypt",
  "/destinations/uae",
  "/destinations/italy",
  "/destinations/morocco",
  "/destinations/zanzibar",
  "/hospitality",
  "/hospitality/coastal-sanctuaries",
  "/hospitality/nile-cruises",
  "/hospitality/tropical-retreats",
  "/hospitality/european-elegance",
  "/hospitality/urban-centers",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }));

  try {
    const hospitality = await getPublishedCollection("hospitality");
    for (const item of hospitality) {
      const data = publicData(item);
      const region = typeof data.showcaseRegion === "string" ? data.showcaseRegion : "";
      if (region) entries.push({ url: `${baseUrl}/hospitality/${region}/${item.slug}`, lastModified: now });
    }
  } catch {
    // Best-effort — the static routes above still cover the bulk of the site.
  }

  try {
    const env = getPublicSupabaseEnvironment();
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: places } = await supabase
      .from("published_destination_hierarchy")
      .select("parent_slug,slug")
      .eq("parent_type", "destination");
    const { data: attractions } = await supabase
      .from("published_destination_hierarchy")
      .select("parent_slug,slug")
      .eq("parent_type", "destination_place");

    const countryByPlace = new Map((places ?? []).map((p) => [p.slug, p.parent_slug]));
    for (const place of places ?? []) {
      entries.push({ url: `${baseUrl}/destinations/${place.parent_slug}/${place.slug}`, lastModified: now });
    }
    for (const attraction of attractions ?? []) {
      const country = countryByPlace.get(attraction.parent_slug);
      if (country) entries.push({ url: `${baseUrl}/destinations/${country}/${attraction.parent_slug}/${attraction.slug}`, lastModified: now });
    }
  } catch {
    // Best-effort — the static routes above still cover the bulk of the site.
  }

  return entries;
}
