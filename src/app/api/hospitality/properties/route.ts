import { NextRequest, NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";

// Fetches individual hospitality properties (Magic I, President Sea Palace, ...)
// by slug, for the deep-dive pages under /hospitality/*. Pass ?slugs=a,b,c to
// get them back in that order; unknown slugs are simply omitted, and if none
// of the requested slugs are published yet the caller gets an empty array
// (pages should keep their own hardcoded fallback in that case).
export async function GET(request: NextRequest) {
  const slugsParam = request.nextUrl.searchParams.get("slugs") ?? "";
  const requested = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);
  if (!requested.length) return NextResponse.json([]);

  const entries = await getPublishedCollection("hospitality");
  const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));

  const items = requested
    .map((slug) => bySlug.get(slug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .map((entry) => {
      const data = publicData(entry);
      const locationParts = [data.location, data.region, data.country].filter(
        (part): part is string => typeof part === "string" && part.length > 0,
      );
      return {
        id: entry.id,
        slug: entry.slug,
        name: entry.title,
        tag: locationParts.join(", ").toUpperCase(),
        desc: typeof data.fullDescription === "string" && data.fullDescription
          ? data.fullDescription
          : typeof data.shortDescription === "string" ? data.shortDescription : "",
        roomsOrCabins: typeof data.roomsOrCabins === "number" ? data.roomsOrCabins : null,
        facilities: Array.isArray(data.facilities) ? data.facilities.filter((v): v is string => typeof v === "string") : [],
        diningOptions: Array.isArray(data.diningOptions) ? data.diningOptions.filter((v): v is string => typeof v === "string") : [],
        accessibility: Array.isArray(data.accessibility) ? data.accessibility.filter((v): v is string => typeof v === "string") : [],
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
      };
    });

  return NextResponse.json(items);
}
