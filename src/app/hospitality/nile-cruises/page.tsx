// src/app/hospitality/nile-cruises/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import RegionPageClient from "./RegionPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/hospitality/nile-cruises");
  return {
    title: content?.seo?.title || "The River Masters | Flash Group Hospitality",
    description:
      content?.seo?.description ||
      "Commanding the ancient waters of the Nile with absolute prestige, uncompromised luxury, and legendary hospitality.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default function NileCruisesPage() {
  return <RegionPageClient />;
}
