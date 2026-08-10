import type { Metadata } from "next";
import { getPublishedDestinationSeo } from "@/lib/cms/destinations/public";
import ItalyPageClient from "./ItalyPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedDestinationSeo("italy");
  return {
    title: seo?.title || "Italy | Flash Group",
    description:
      seo?.description ||
      "From the sweet life of Sicily to the glamour of Sardinia — Flash Group operates 7 exclusive premium properties bringing our legacy of luxury to the Mediterranean.",
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : { canonical: "/destinations/italy" },
    openGraph: seo?.openGraph?.image ? { images: [seo.openGraph.image] } : undefined,
  };
}

export default function ItalyPage() {
  return <ItalyPageClient />;
}
