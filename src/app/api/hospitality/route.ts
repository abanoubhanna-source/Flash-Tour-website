import { NextResponse } from "next/server";
import fallback from "@/data/hospitality.json";
import { getPublishedPageContent } from "@/lib/cms/pages/public";

// Note: the "hospitality" content_type in the CMS holds individual
// properties (Magic I, President Sea Palace, ...), not these 5 curated
// geographic categories. The category cards themselves are dashboard-editable
// via the Hospitality page's "Region cards" section (Dashboard → Hospitality
// → Page header) — the individual CMS entries separately power the
// deep-dive pages (e.g. /hospitality/nile-cruises) via /api/hospitality/showcase.
export async function GET() {
  const content = await getPublishedPageContent("/hospitality");
  const regions = content?.hero.hospitalityRegions;
  if (regions?.length === 5) {
    return NextResponse.json(
      regions.map((region) => ({
        id: region.id,
        tag: region.tag,
        title: region.title,
        subtitle: region.subtitle,
        desc: region.desc,
        icon: region.icon,
        img: region.image.url || fallback.find((item) => item.id === region.id)?.img || "",
        link: region.link,
        features: region.features,
      })),
    );
  }
  return NextResponse.json(fallback);
}
