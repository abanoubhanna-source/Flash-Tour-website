import { NextRequest, NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";
import { hospitalityShowcaseRegions } from "@/lib/cms/collections/schema";

// Returns every published hospitality entry tagged with showcaseRegion=<region>,
// in display order — the full card list for one /hospitality/* deep-dive page
// (e.g. /hospitality/coastal-sanctuaries), so cards can be added, removed, and
// reordered entirely from the dashboard instead of living in a hardcoded array.
export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("region") ?? "";
  if (!hospitalityShowcaseRegions.includes(region as (typeof hospitalityShowcaseRegions)[number])) {
    return NextResponse.json([]);
  }

  const entries = await getPublishedCollection("hospitality");
  const items = entries
    .map((entry) => ({ entry, data: publicData(entry) }))
    .filter(({ data }) => data.showcaseRegion === region)
    .map(({ entry, data }) => {
      const locationParts = [...new Set([data.location, data.region, data.country].filter(
        (part): part is string => typeof part === "string" && part.length > 0,
      ))];
      const gallery = Array.isArray(data.gallery) ? data.gallery : [];
      const firstImage = gallery[0] && typeof gallery[0] === "object" ? (gallery[0] as { url?: unknown }).url : undefined;
      const specs: string[] = [];
      if (typeof data.roomsOrCabins === "number") specs.push(`${data.roomsOrCabins} Rooms`);
      if (Array.isArray(data.diningOptions)) specs.push(...data.diningOptions.slice(0, 1).filter((v): v is string => typeof v === "string"));
      if (Array.isArray(data.facilities)) specs.push(...data.facilities.filter((v): v is string => typeof v === "string"));

      return {
        id: entry.id,
        slug: entry.slug,
        name: entry.title,
        tag: locationParts.join(", ").toUpperCase(),
        desc: typeof data.fullDescription === "string" && data.fullDescription
          ? data.fullDescription
          : typeof data.shortDescription === "string" ? data.shortDescription : "",
        img: typeof firstImage === "string" && firstImage ? firstImage : "",
        iconKey: typeof data.showcaseIcon === "string" ? data.showcaseIcon : "",
        specs: specs.slice(0, 4),
      };
    });

  return NextResponse.json(items);
}
