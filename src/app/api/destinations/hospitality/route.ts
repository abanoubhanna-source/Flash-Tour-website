import { NextRequest, NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";

// Returns Flash Group's owned hospitality properties and cruises located in
// a given country, e.g. /api/destinations/hospitality?country=Egypt. Powers
// the "Our Hospitality & Cruises" section on each destination country page,
// sourced from the same Hospitality/Cruises collections editors already use
// — no separate content to keep in sync.
export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country") ?? "";
  if (!country) return NextResponse.json([]);

  const [hospitality, cruises] = await Promise.all([
    getPublishedCollection("hospitality").then((entries) => entries.map((entry) => ({ ...entry, type: "hospitality" as const }))),
    getPublishedCollection("cruise").then((entries) => entries.map((entry) => ({ ...entry, type: "cruise" as const }))),
  ]);

  // Hospitality and Cruises are twin content types — the same physical vessel
  // (e.g. Nile Majestic) often exists as both, sharing the same slug. Keep the
  // hospitality copy when both exist rather than showing the same property twice.
  const bySlug = new Map<string, (typeof hospitality)[number] | (typeof cruises)[number]>();
  for (const entry of [...cruises, ...hospitality]) bySlug.set(entry.slug, entry);

  const items = [...bySlug.values()]
    .filter((entry) => {
      const data = publicData(entry);
      return typeof data.country === "string" && data.country.toLowerCase() === country.toLowerCase();
    })
    .map((entry) => {
      const data = publicData(entry);
      const gallery = Array.isArray(data.gallery) ? data.gallery : [];
      const firstImage = gallery[0] && typeof gallery[0] === "object" ? (gallery[0] as { url?: unknown }).url : undefined;
      return {
        id: entry.id,
        slug: entry.slug,
        type: entry.type,
        name: entry.title,
        region: typeof data.region === "string" ? data.region : "",
        description: typeof data.shortDescription === "string" && data.shortDescription
          ? data.shortDescription
          : typeof data.fullDescription === "string" ? data.fullDescription : "",
        image: typeof firstImage === "string" && firstImage ? firstImage : "",
      };
    })
    .slice(0, 12);

  return NextResponse.json(items);
}
