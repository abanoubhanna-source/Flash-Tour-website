// src/app/destinations/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import DestinationsPageClient from "./DestinationsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/destinations");
  return {
    title: content?.seo?.title || "Destinations | Flash Group",
    description:
      content?.seo?.description ||
      "Five distinct regions. Infinite possibilities. Discover the destinations where Flash Group brings luxury to life.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default function DestinationsPage() {
  return <DestinationsPageClient />;
}
