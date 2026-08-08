// src/app/hospitality/tropical-retreats/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import RegionPageClient from "./RegionPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/hospitality/tropical-retreats");
  return {
    title: content?.seo?.title || "Tropical Retreats | Flash Group Hospitality",
    description:
      content?.seo?.description ||
      "Zanzibar's Premium Estates. We deliver the Flash Group standard of luxury wrapped in a breathtaking tropical environment.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default function TropicalRetreatsPage() {
  return <RegionPageClient />;
}
