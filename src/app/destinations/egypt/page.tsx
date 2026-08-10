import type { Metadata } from "next";
import { getPublishedDestinationSeo } from "@/lib/cms/destinations/public";
import EgyptPageClient from "./EgyptPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedDestinationSeo("egypt");
  return {
    title: seo?.title || "Egypt | Flash Group",
    description:
      seo?.description ||
      "Experience more than 7,000 years of living history, from the Pyramids to the Nile — Flash Group's Egyptian operations, the beating heart of the company.",
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : { canonical: "/destinations/egypt" },
    openGraph: seo?.openGraph?.image ? { images: [seo.openGraph.image] } : undefined,
  };
}

export default function EgyptPage() {
  return <EgyptPageClient />;
}
