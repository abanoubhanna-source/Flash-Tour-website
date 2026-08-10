// src/app/services/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";
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

export default async function ServicesPage() {
  const services = await getPublishedCollection("service");
  const serviceSchema = {
    "@context": "https://schema.org",
    "@graph": services.map((entry) => {
      const data = publicData(entry);
      return {
        "@type": "Service",
        name: entry.title,
        description: typeof data.description === "string" ? data.description : undefined,
        provider: { "@type": "TravelAgency", name: "Flash Group" },
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://flash-tour-group.vercel.app"}/services#${entry.slug}`,
      };
    }),
  };

  return (
    <>
      {services.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      )}
      <ServicesPageClient />
    </>
  );
}
