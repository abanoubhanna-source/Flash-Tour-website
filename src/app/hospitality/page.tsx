// src/app/hospitality/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import HospitalityPageClient from "./HospitalityPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/hospitality");
  return {
    title: content?.seo?.title || "Hospitality | Flash Group",
    description:
      content?.seo?.description ||
      "Our hospitality is a different breed. We are not just a service provider; we are the destination. From the majestic Nile and the vibrant Red Sea to the exotic Indian Ocean and historic European coastlines.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default function HospitalityPage() {
  return <HospitalityPageClient />;
}
