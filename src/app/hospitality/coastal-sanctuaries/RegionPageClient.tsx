// src/app/hospitality/coastal-sanctuaries/RegionPageClient.tsx
'use client';

import { useEffect } from 'react';
import { Anchor, Building2, Ship, Sun, Wind } from 'lucide-react';
import { trackHospitalityPropertyView } from '@/lib/analytics';
import { HospitalityRegionPageTemplate, useHospitalityShowcase, type HospitalityShowcaseItem } from '@/components/hospitality/HospitalityRegionPageTemplate';
import { regionNav } from '@/components/hospitality/region-nav';

const defaultCoastalData: HospitalityShowcaseItem[] = [
  { id: '01', name: 'True Beach Resort', slug: 'true-beach-resort', tag: '5-STAR LUXURY', desc: 'Our signature hospitality shines at our flagship coastal property in Marsa Alam. Thoughtfully divided into a vibrant family-friendly resort and an exclusive adults-only village for ultimate serenity.', img: '/images/true-beach.jpg', icon: Building2, specs: ['Family & Adults-Only Zones', 'Premium Dining', 'Private Pools', 'VIP Concierge'] },
  { id: '02', name: 'Flash Yachting (Flash 3, 4, 5)', slug: 'flash-boats', tag: 'SEA MOBILITY', desc: 'Command the Red Sea with our exclusive fleet of private motorboats and diving yachts. Perfectly designed to dominate the coastline, offering bespoke marine excursions and private island hopping.', img: '/images/flash-boats.jpg', icon: Ship, specs: ['Flash 3, 4 & 5 Yachts', 'Private Charters', 'Elite Diving Excursions', 'Island Hopping'] },
  { id: '03', name: 'Exquisite Private Beaches', tag: 'PRISTINE COASTLINES', desc: 'Unwind on golden sands merging seamlessly with the deep blue. Our private beaches offer unmatched tranquility, luxury cabanas, and elite beachside service for the most discerning guests.', img: '/images/true-beach-card.jpg', icon: Sun, specs: ['Luxury Cabanas', 'Beachside Dining', 'Exclusive Access', 'Crystal Clear Waters'] },
  { id: '04', name: 'World-Class Spa & Kitesurfing Hub', tag: 'WELLNESS & ADVENTURE', desc: 'Balance ultimate relaxation with thrilling adventure. Rejuvenate your senses at our holistic world-class spa, or ride the wind at our professional Tulipe Kitesurfing Hub.', img: '/images/kitesurf.jpg', icon: Wind, specs: ['Holistic Spa Treatments', 'Professional Kitesurfing', 'Wellness Therapies', 'Extreme Sports'] },
];

export default function RegionPageClient() {
  useEffect(() => { trackHospitalityPropertyView('Coastal Sanctuaries'); }, []);
  const coastalData = useHospitalityShowcase('coastal-sanctuaries', defaultCoastalData);

  return (
    <HospitalityRegionPageTemplate
      path="/hospitality/coastal-sanctuaries"
      eyebrowIcon={Anchor}
      nav={regionNav('coastal-sanctuaries')}
      showcase={coastalData}
      fallback={{
        eyebrow: 'Mastering the Land and Sea',
        title: 'Coastal',
        accentTitle: 'Sanctuaries',
        subtitle: 'From the golden sands to the deep blue. Experience our signature hospitality dominating the coastline.',
        heroImage: '/images/true-beach.jpg',
        introHeading: 'A Symphony of Sand and Sea',
        introBody: 'You will find our signature hospitality at the 5-Star True Beach Resort in Marsa Alam, perfectly complemented by our private motorboats and diving yachts. Whether you seek thrilling marine adventures or secluded beachfront tranquility, our coastal properties deliver an uncompromised standard of luxury.',
        ctaHeading: 'Partner With The Best.',
        ctaBody: 'Secure the ultimate coastal luxury for your elite clients. Connect with our corporate relations team today.',
      }}
    />
  );
}
