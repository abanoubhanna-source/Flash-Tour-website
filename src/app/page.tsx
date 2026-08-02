// src/app/page.tsx
import HeroSection from "@/components/HeroSection";
import StatsAndCerts from "@/components/StatsAndCerts";
import InteractiveMap from "@/components/InteractiveMap";
import HospitalityBrands from "@/components/HospitalityBrands";
import B2BSolutions from "@/components/B2BSolutions";
import FleetSection from "@/components/FleetSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { getPublishedPageContent } from "@/lib/cms/pages/public";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPageContent("/");
  return {
    title: content?.seo?.title || "Flash Group | Crafting Hospitality Since 1985",
    description:
      content?.seo?.description ||
      "An Egyptian International company offering full-fledged services in tourism and hospitality.",
    alternates: content?.seo?.canonicalPath ? { canonical: content.seo.canonicalPath } : undefined,
    openGraph: content?.seo?.ogImage ? { images: [content.seo.ogImage] } : undefined,
  };
}

export default async function Home() {
  const content = await getPublishedPageContent("/");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full overflow-hidden bg-white">
      {/* 1. Hero */}
      <HeroSection content={content?.hero} />

      {/* 3. Scale + Certifications */}
      <StatsAndCerts content={content?.hero.stats} />

      {/* 4. Global Infrastructure */}
      <InteractiveMap content={content?.hero.map} />

      {/* 5. Group Assets / Owned Hospitality */}
      <HospitalityBrands content={content?.hero.ownedHospitality} />

      {/* 6. Enterprise Solutions */}
      <B2BSolutions content={content?.hero.enterpriseSolutions} />

      {/* 7. VIP Transportation */}
      <FleetSection />

      {/* 8. Footer */}
      <Footer />
    </main>
  );
}
