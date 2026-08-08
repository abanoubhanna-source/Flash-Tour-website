// src/app/contact/page.tsx
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";
import ContactPageClient from "./ContactPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/contact");
  return {
    title: content?.seo?.title || "Contact Us | Flash Group",
    description:
      content?.seo?.description ||
      "For tour operators, corporate entities, event planners, and hospitality partners seeking direct access to Flash Group infrastructure.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default function ContactPage() {
  return <ContactPageClient />;
}
