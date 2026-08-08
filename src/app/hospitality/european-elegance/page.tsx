// src/app/hospitality/european-elegance/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import RegionPageClient from "./RegionPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/hospitality/european-elegance");
  return {
    title: content?.seo?.title || "European Elegance | Flash Group Hospitality",
    description:
      content?.seo?.description ||
      "The Italian Collection. A strategic, commanding presence in Europe's most elite destinations.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default function EuropeanElegancePage() {
  return <RegionPageClient />;
}
