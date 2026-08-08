// src/app/about/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import AboutPageClient from "./AboutPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/about");
  return {
    title: content?.seo?.title || "About Us | Flash Group",
    description:
      content?.seo?.description ||
      "Since 1985, Flash Group has evolved from a visionary agency into a multinational asset-owning powerhouse in tourism, accommodation, and fine dining.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default function AboutPage() {
  return <AboutPageClient />;
}
