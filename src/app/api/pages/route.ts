import { NextRequest, NextResponse } from "next/server";
import { getPublishedPageContent } from "@/lib/cms/pages/public";

// Lets client-rendered pages (which can't call the server-only
// getPublishedPageContent directly) overlay their hero content from the
// Pages CMS module, the same way usePublishedDestination does for
// destinations. /api/pages?path=/services -> { hero, seo } | null
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json(null);
  const content = await getPublishedPageContent(path);
  return NextResponse.json(content);
}
