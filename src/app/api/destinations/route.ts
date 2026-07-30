import { NextRequest, NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";
import fallback from "@/data/destinations.json";
import type { DestinationContentData } from "@/lib/cms/destinations/schema";

// The CMS-managed fields (destinationContentSchema) win whenever they've
// actually been edited; the curated fallback (matched by slug) covers
// anything still blank, so a destination with no CMS photo yet doesn't
// regress to nothing.
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const entries = await getPublishedCollection("destination");
  const bySlug = new Map((fallback as Array<Record<string, unknown>>).map((item) => [item.id, item]));

  if (!entries.length) {
    if (!slug) return NextResponse.json(fallback);
    const match = bySlug.get(slug);
    return NextResponse.json(match ? { ...match, hero: null } : null);
  }

  const merged = entries.map((entry) => {
    const data = publicData(entry) as Partial<DestinationContentData>;
    const match = bySlug.get(entry.slug) ?? {};
    const heroImage = data.hero?.image ?? { assetId: null, url: "", alt: "" };
    return {
      id: entry.id,
      slug: entry.slug,
      name: entry.title,
      title: entry.title,
      subtitle: typeof data.subtitle === "string" && data.subtitle ? data.subtitle : (match.subtitle as string) ?? "",
      description: typeof data.description === "string" && data.description ? data.description : (match.description as string) ?? "",
      highlights: Array.isArray(data.highlights) && data.highlights.length
        ? data.highlights.map((highlight) => highlight.title)
        : (match.highlights as string[]) ?? [],
      image: heroImage.url || (match.image as string) || "",
      icon: typeof data.iconKey === "string" && data.iconKey ? data.iconKey : (match.icon as string) ?? "Compass",
      hero: data.hero ? { eyebrow: data.hero.eyebrow, title: data.hero.title, accentTitle: data.hero.accentTitle, subtitle: data.hero.subtitle, image: heroImage } : null,
    };
  });

  if (!slug) return NextResponse.json(merged);
  return NextResponse.json(merged.find((item) => item.slug === slug) ?? null);
}
