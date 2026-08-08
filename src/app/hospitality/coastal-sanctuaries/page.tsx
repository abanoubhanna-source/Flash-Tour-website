// src/app/hospitality/coastal-sanctuaries/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import RegionPageClient from "./RegionPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/hospitality/coastal-sanctuaries");
  return {
    title: content?.seo?.title || "Coastal Sanctuaries | Flash Group Hospitality",
    description:
      content?.seo?.description ||
      "From the golden sands to the deep blue. Experience our signature hospitality dominating the coastline.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default function CoastalSanctuariesPage() {
  return <RegionPageClient />;
}
