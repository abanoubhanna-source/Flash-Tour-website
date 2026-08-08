// src/app/services/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import ServicesPageClient from "./ServicesPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/services");
  return {
    title: content?.seo?.title || "Our Services | Flash Group",
    description:
      content?.seo?.description ||
      "From exclusive leisure travel to flawless corporate event management, Flash Group delivers uncompromised quality across every touchpoint of your journey.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default function ServicesPage() {
  return <ServicesPageClient />;
}
