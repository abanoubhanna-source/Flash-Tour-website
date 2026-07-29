import { NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";
import fallback from "@/data/destinations.json";

// The CMS only manages text fields (name/description) for destinations today.
// Visual fields (image, icon, subtitle, highlights) aren't in the CMS schema
// yet, so we keep using the curated fallback for those, matched by slug, and
// let CMS text win whenever it's actually been edited.
export async function GET() {
  const entries = await getPublishedCollection("destination");
  if (!entries.length) return NextResponse.json(fallback);

  const bySlug = new Map((fallback as Array<Record<string, unknown>>).map((item) => [item.id, item]));

  const merged = entries.map((entry) => {
    const data = publicData(entry);
    const match = bySlug.get(entry.slug) ?? {};
    const description =
      typeof data.fullDescription === "string" && data.fullDescription
        ? data.fullDescription
        : typeof data.summary === "string" && data.summary
          ? data.summary
          : (match.description as string) ?? "";
    return {
      id: entry.id,
      slug: entry.slug,
      name: entry.title,
      title: entry.title,
      subtitle: typeof data.subtitle === "string" && data.subtitle ? data.subtitle : (match.subtitle as string) ?? "",
      description,
      highlights: Array.isArray(data.highlights)
        ? data.highlights
            .map((h) => (h && typeof h === "object" && "title" in h ? (h as { title: unknown }).title : h))
            .filter((t): t is string => typeof t === "string")
        : (match.highlights as string[]) ?? [],
      image: typeof data.image === "string" && data.image ? data.image : (match.image as string) ?? "",
      icon: typeof data.icon === "string" && data.icon ? data.icon : (match.icon as string) ?? "Compass",
    };
  });

  return NextResponse.json(merged);
}
