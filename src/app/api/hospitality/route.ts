import { NextResponse } from "next/server";
import fallback from "@/data/hospitality.json";

// Note: the "hospitality" content_type in the CMS holds individual
// properties (Magic I, President Sea Palace, ...), not these 5 curated
// geographic categories. The category cards below are structural/editorial
// and intentionally stay on the static file — the individual CMS entries
// power the deep-dive pages (e.g. /hospitality/nile-cruises) instead, via
// /api/hospitality/properties.
export async function GET() {
  return NextResponse.json(fallback);
}
