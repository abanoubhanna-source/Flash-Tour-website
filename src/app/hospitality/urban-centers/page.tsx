// src/app/hospitality/urban-centers/page.tsx
'use client';

import { useEffect } from 'react';
import { Crown, Landmark, UtensilsCrossed, Wine } from 'lucide-react';
import { trackHospitalityPropertyView } from '@/lib/analytics';
import { HospitalityRegionPageTemplate, useHospitalityShowcase, type HospitalityShowcaseItem } from '@/components/hospitality/HospitalityRegionPageTemplate';
import { regionNav } from '@/components/hospitality/region-nav';

const defaultUrbanData: HospitalityShowcaseItem[] = [
  { id: '01', name: '1920s Boutique Hotel', slug: '1920s-boutique-hotel', tag: 'HISTORIC STAY', desc: '1920s Boutique Hotel: Step back in time in the prestigious district of Heliopolis. We preserve history through this meticulously restored 100-year-old historic villa, offering a seamless blend of classic 1920s architecture, antique charm, and modern sophistication.', img: '/images/1920s-hotel.jpg', icon: Landmark, specs: ['Restored 1920s Villa', 'Classic Architecture', 'Luxury Boutique Suites', 'Heart of Heliopolis'] },
  { id: '02', name: "Carlo's Restaurant", slug: 'carlo-heliopolis', tag: 'HISTORIC GARDENS', desc: "Nestled within the lush, historic gardens of our boutique villa. Carlo's elevates the premium casual dining scene, serving a masterful variety of Oriental, Asian, and international dishes in an atmosphere of unparalleled elegance.", img: '/images/carlos.jpg', icon: UtensilsCrossed, specs: ['Historic Garden Setting', 'Premium Casual Dining', 'Oriental & Asian Fusion', 'Elite Atmosphere'] },
  { id: '03', name: 'Rossini Fine Dining', slug: 'rossini', tag: 'AWARD-WINNING CULINARY', desc: "A true landmark in Cairo's fine dining scene since 1993. Proud bearer of the prestigious Chaine des Rotisseurs certification, Rossini offers authentic Italian and Mediterranean gastronomy for the most discerning palates.", img: '/images/rossini.jpg', icon: Wine, specs: ['Chaine des Rotisseurs', 'Italian & Mediterranean', 'Established in 1993', 'Gourmet Gastronomy'] },
  { id: '04', name: 'Personalized VIP Concierge', tag: 'BESPOKE SERVICE', desc: 'Our urban hospitality is defined by absolute attention to detail. From securing exclusive dining reservations to arranging private chauffeured city tours, our dedicated VIP concierge ensures a flawless, highly personalized Cairo experience.', img: '/images/vip-concierge.jpg', icon: Crown, specs: ['24/7 VIP Assistance', 'Private City Tours', 'Exclusive Reservations', 'Chauffeur Services'] },
];

export default function UrbanCentersPage() {
  useEffect(() => { trackHospitalityPropertyView('Urban Centers'); }, []);
  const urbanData = useHospitalityShowcase(defaultUrbanData);

  return (
    <HospitalityRegionPageTemplate
      path="/hospitality/urban-centers"
      eyebrowIcon={Landmark}
      nav={regionNav('urban-centers')}
      showcase={urbanData}
      fallback={{
        eyebrow: 'A Century of Elegance in Cairo',
        title: 'Urban',
        accentTitle: 'Centers',
        subtitle: 'Heritage & Fine Dining. In the heart of the city, our hospitality takes a profound cultural form.',
        heroImage: '/images/1920s-hotel.jpg',
        introHeading: 'Preserving History, Elevating Taste',
        introBody: 'We preserve history through meticulously restored 100-year-old boutique villas and elevate the culinary scene with our award-winning dining lounges. Discover a sophisticated urban retreat designed for travelers who appreciate heritage, art, and world-class gastronomy.',
        ctaHeading: 'Partner With Heritage.',
        ctaBody: 'Offer your elite clients an unforgettable journey through history and culinary mastery. Connect with our corporate relations team today.',
      }}
    />
  );
}
