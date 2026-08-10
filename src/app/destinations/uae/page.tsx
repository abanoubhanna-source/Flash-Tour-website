import type { Metadata } from "next";
import { getPublishedDestinationSeo } from "@/lib/cms/destinations/public";
import UaePageClient from "./UaePageClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedDestinationSeo("uae");
  return {
    title: seo?.title || "United Arab Emirates | Flash Group",
    description:
      seo?.description ||
      "Ultra-modern luxury meets authentic Arabian hospitality — Flash Group's UAE division delivers VIP services, premium mobility, and bespoke experiences in Dubai and beyond.",
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : { canonical: "/destinations/uae" },
    openGraph: seo?.openGraph?.image ? { images: [seo.openGraph.image] } : undefined,
  };
}

export default function UaePage() {
  return <UaePageClient />;
}
