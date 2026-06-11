// src/app/page.tsx
import HeroSection from "@/components/HeroSection";
import StatsAndCerts from "@/components/StatsAndCerts";
import InteractiveMap from "@/components/InteractiveMap";
import HospitalityBrands from "@/components/HospitalityBrands";
import B2BSolutions from "@/components/B2BSolutions";
import FleetSection from "@/components/FleetSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full overflow-hidden bg-white">
      {/* 1. Hero */}
      <HeroSection />

      {/* 3. Scale + Certifications */}
      <StatsAndCerts />

      {/* 4. Global Infrastructure */}
      <InteractiveMap />

      {/* 5. Group Assets / Owned Hospitality */}
      <HospitalityBrands />

      {/* 6. Enterprise Solutions */}
      <B2BSolutions />

      {/* 7. VIP Transportation */}
      <FleetSection />

      {/* 8. Footer */}
      <Footer />
    </main>
  );
}