import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnvironment } from "@/lib/supabase/env";

// Returns the published place/attraction hierarchy for one destination, e.g.
// /api/destinations/hierarchy?slug=egypt -> { places: [{ slug, title, desc,
// attractions: [{ slug, title, desc }] } ...] }. Used to overlay CMS text
// onto the deep-dive destination pages, which otherwise carry their own
// hardcoded copy as a fallback.
export async function GET(request: NextRequest) {
  const destinationSlug = request.nextUrl.searchParams.get("slug") ?? "";
  if (!destinationSlug) return NextResponse.json({ places: [] });

  try {
    const env = getPublicSupabaseEnvironment();
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: placeRows, error: placeError } = await supabase
      .from("published_destination_hierarchy")
      .select("slug,title,data,sort_order")
      .eq("parent_slug", destinationSlug)
      .eq("parent_type", "destination")
      .order("sort_order");
    if (placeError || !placeRows?.length) return NextResponse.json({ places: [] });

    const placeSlugs = placeRows.map((row) => row.slug);
    const { data: attractionRows, error: attractionError } = await supabase
      .from("published_destination_hierarchy")
      .select("parent_slug,slug,title,data,sort_order")
      .in("parent_slug", placeSlugs)
      .eq("parent_type", "destination_place")
      .order("sort_order");
    if (attractionError) return NextResponse.json({ places: [] });

    const describe = (data: unknown): string => {
      const source = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
      return typeof source.fullDescription === "string" && source.fullDescription
        ? source.fullDescription
        : typeof source.summary === "string" ? source.summary : "";
    };

    const imageUrl = (data: unknown): string => {
      const source = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
      const gallery = Array.isArray(source.gallery) ? source.gallery : [];
      const first = gallery[0];
      return first && typeof first === "object" && typeof (first as { url?: unknown }).url === "string"
        ? (first as { url: string }).url
        : "";
    };

    const places = placeRows.map((place) => ({
      slug: place.slug,
      title: place.title,
      desc: describe(place.data),
      image: imageUrl(place.data),
      attractions: (attractionRows ?? [])
        .filter((attraction) => attraction.parent_slug === place.slug)
        .map((attraction) => ({ slug: attraction.slug, title: attraction.title, desc: describe(attraction.data), image: imageUrl(attraction.data) })),
    }));

    return NextResponse.json({ places });
  } catch {
    return NextResponse.json({ places: [] });
  }
}
