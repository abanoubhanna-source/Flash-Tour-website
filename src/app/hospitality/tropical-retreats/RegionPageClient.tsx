// src/app/hospitality/tropical-retreats/RegionPageClient.tsx
'use client';

import { useEffect } from 'react';
import { Briefcase, Building2, Palmtree, Sun, Trees } from 'lucide-react';
import { trackHospitalityPropertyView } from '@/lib/analytics';
import { HospitalityRegionPageTemplate, useHospitalityShowcase, type HospitalityShowcaseItem } from '@/components/hospitality/HospitalityRegionPageTemplate';
import { regionNav } from '@/components/hospitality/region-nav';

const defaultTropicalData: HospitalityShowcaseItem[] = [
  { id: '01', name: 'Kiwengwa Beach Resort', slug: 'kiwengwa-beach-resort', tag: '5-STAR ESTATES', desc: 'Our fully-owned flagship property in Zanzibar delivers the Flash Group standard of luxury. Boasting over 200 modern African-style units, it offers a seamless blend of natural beauty and premium comfort directly on the beach.', img: '/images/zanzibar-island.jpg', icon: Building2, specs: ['200+ Luxury Rooms', 'Premium Dining & Bars', 'Multiple Swimming Pools', 'Recreation Center'] },
  { id: '02', name: 'Exclusive White Sand Beaches', tag: 'PRISTINE COASTLINES', desc: 'Relax and unwind on some of the most famous beaches in Africa. We organize private boat safaris to secluded sandbanks in the middle of the ocean, offering absolute tranquility under the tropical sun.', img: '/images/zanzibar-resort.jpg', icon: Sun, specs: ['Private Sandbanks', 'Crystal Clear Waters', 'Luxury Sunbeds', 'Bespoke Beachside Service'] },
  { id: '03', name: 'Premium Safari Integrations', tag: 'WILDLIFE ADVENTURES', desc: 'Experience the best of both worlds. Seamlessly combine your beach retreat with thrilling wildlife excursions in the majestic Savannas, including over-day trips to Mikumi or Selous reserves.', img: '/images/safari-main.jpg', icon: Trees, specs: ['Private Car Safaris', 'Mikumi & Selous Tours', 'Guided Forest Walks', 'Spice Tour Experiences'] },
  { id: '04', name: 'Tropical Corporate Retreats', tag: 'MICE & INCENTIVES', desc: 'Elevate your corporate events in a breathtaking tropical setting. We offer tailored B2B solutions for incentive groups, combining professional environments with unforgettable leisure activities and VIP mobility.', img: '/images/service-mice.jpg', icon: Briefcase, specs: ['Tailored B2B Solutions', 'Incentive Travel', 'Team Building Events', 'VIP Ground Mobility'] },
];

export default function RegionPageClient() {
  useEffect(() => { trackHospitalityPropertyView('Tropical Retreats'); }, []);
  const tropicalData = useHospitalityShowcase('tropical-retreats', defaultTropicalData);

  return (
    <HospitalityRegionPageTemplate
      path="/hospitality/tropical-retreats"
      eyebrowIcon={Palmtree}
      nav={regionNav('tropical-retreats')}
      showcase={tropicalData}
      fallback={{
        eyebrow: 'The Exotic Shores of Tanzania',
        title: 'Tropical',
        accentTitle: 'Retreats',
        subtitle: "Zanzibar's Premium Estates. We deliver the Flash Group standard of luxury wrapped in a breathtaking tropical environment.",
        heroImage: '/images/zanzibar-main.jpg',
        introHeading: 'A Symphony of Wildlife and Luxury',
        introBody: "Our footprint extends to the exotic shores of Tanzania. At our fully-owned Kiwengwa Beach Resort, we provide an unparalleled gateway to Zanzibar's white sand beaches and East Africa's majestic Savannas, perfectly suited for elite leisure and corporate incentive groups.",
        ctaHeading: 'Partner With The Best.',
        ctaBody: 'Secure the ultimate tropical escapes for your elite clients. Connect with our corporate relations team today.',
      }}
    />
  );
}
