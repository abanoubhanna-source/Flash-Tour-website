import type { Metadata } from "next";
import { getPublishedDestinationSeo } from "@/lib/cms/destinations/public";
import ZanzibarPageClient from "./ZanzibarPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedDestinationSeo("zanzibar");
  return {
    title: seo?.title || "Zanzibar | Flash Group",
    description:
      seo?.description ||
      "A tropical paradise where white sandy beaches meet rich cultural heritage — Flash Group's Zanzibar operations deliver untouched nature with a 5-star standard of comfort.",
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : { canonical: "/destinations/zanzibar" },
    openGraph: seo?.openGraph?.image ? { images: [seo.openGraph.image] } : undefined,
  };
}

export default function ZanzibarPage() {
  return <ZanzibarPageClient />;
}
