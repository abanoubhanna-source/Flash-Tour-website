// src/app/hospitality/urban-centers/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import RegionPageClient from "./RegionPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/hospitality/urban-centers");
  return {
    title: content?.seo?.title || "Urban Centers | Flash Group Hospitality",
    description:
      content?.seo?.description ||
      "Heritage & Fine Dining. In the heart of the city, our hospitality takes a profound cultural form.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default function UrbanCentersPage() {
  return <RegionPageClient />;
}
