import type { Metadata } from "next";
import { getPublishedDestinationSeo } from "@/lib/cms/destinations/public";
import MoroccoPageClient from "./MoroccoPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedDestinationSeo("morocco");
  return {
    title: seo?.title || "Morocco | Flash Group",
    description:
      seo?.description ||
      "From the souks of Marrakech to the Atlas Mountains — Flash Group's Moroccan operations deliver an authentic and luxurious North African experience.",
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : { canonical: "/destinations/morocco" },
    openGraph: seo?.openGraph?.image ? { images: [seo.openGraph.image] } : undefined,
  };
}

export default function MoroccoPage() {
  return <MoroccoPageClient />;
}
