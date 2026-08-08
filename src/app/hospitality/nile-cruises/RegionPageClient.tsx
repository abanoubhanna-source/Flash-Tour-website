// src/app/hospitality/nile-cruises/RegionPageClient.tsx
'use client';

import { useEffect } from 'react';
import { Anchor, Ship } from 'lucide-react';
import { trackCruiseView } from '@/lib/analytics';
import { HospitalityRegionPageTemplate, useHospitalityShowcase, type HospitalityShowcaseItem } from '@/components/hospitality/HospitalityRegionPageTemplate';
import { regionNav } from '@/components/hospitality/region-nav';

const defaultFleet: HospitalityShowcaseItem[] = [
  { id: '01', name: 'Nile Serenity', tag: 'THE FLAGSHIP', desc: 'Setting the absolute benchmark for river cruising. Designed for the global elite, offering uninterrupted panoramic views and uncompromised luxury.', img: '/images/cruise-1.jpg', icon: Ship, specs: ['72 Luxury Suites', 'Gourmet Gastronomy', 'Rooftop Infinity Pool', 'Private Docking'] },
  { id: '02', name: 'Nile Excellence', slug: 'nile-excellence', tag: 'MODERN ELEGANCE', desc: 'A seamless blend of contemporary design and classic river heritage, featuring expansive sun decks and premium culinary experiences.', img: '/images/cruise-2.jpg', icon: Ship, specs: ['68 Premium Cabins', 'Panoramic Lounge', 'Spa & Wellness', 'VIP Concierge'] },
  { id: '03', name: 'Lady Carol', slug: 'lady-carol', tag: 'BOUTIQUE SANCTUARY', desc: 'An intimate, highly exclusive cruising experience perfectly tailored for private charters and high-net-worth corporate gatherings.', img: '/images/cruise-3.jpg', icon: Ship, specs: ['40 Boutique Suites', 'Exclusive Dining', 'Library Lounge', 'Charter Ready'] },
  { id: '04', name: 'Magic II', slug: 'magic-ii', tag: 'PANORAMIC VOYAGER', desc: 'Commanding the ancient waters with breathtaking floor-to-ceiling windows, ensuring the timeless Nile is always your backdrop.', img: '/images/cruise-4.jpg', icon: Ship, specs: ['60 Cabins', 'Sundeck Jacuzzi', 'Fitness Center', 'Evening Entertainment'] },
  { id: '05', name: 'Magic I', slug: 'magic-i', tag: 'HERITAGE CLASSIC', desc: 'A legacy of majestic sailings. The optimal choice for large corporate incentive groups seeking authentic Egyptian hospitality.', img: '/images/cruise-5.jpg', icon: Ship, specs: ['70 Cabins', 'Grand Restaurant', 'Bazaar Onboard', 'Guided Excursions'] },
  { id: '06', name: 'Lady Mary', slug: 'lady-mary', tag: 'THE SUN CHASER', desc: 'Exceptional sun decks and shaded lounges, providing the ultimate environment for relaxation and networking between temple visits.', img: '/images/cruise-6.jpg', icon: Ship, specs: ['65 Cabins', 'Massive Sun Deck', 'Poolside Bar', 'Reading Lounge'] },
  { id: '07', name: 'Nile Majestic', slug: 'nile-majestic', tag: "THE HIDDEN DAHABIYA", desc: 'A pharaonic-inspired dahabiya revealing hidden islands rarely seen in Luxor and Aswan. With just 10 guest cabins, it offers refined local dining, curated excursions, and a relaxing sundeck with pool and lounge areas for an intimate Nile journey.', img: '/images/hospitality-cruise.jpg', icon: Ship, specs: ['10 Guest Cabins', 'Pharaonic-Inspired Design', 'Curated Hidden-Island Excursions', 'Sundeck With Pool & Bar'] },
  { id: '08', name: 'Nile Divine', slug: 'nile-divine', tag: "THE ARTISTS’ DAHABIYA", desc: 'The first dahabiya of its kind, redefining history on the Nile through a collaboration with renowned artists. Its 8 cabins are hand-painted works of art by Egyptian artisans, complemented by an elegant reception, a spa, and two sundecks.', img: '/images/hospitality-cruise.jpg', icon: Ship, specs: ['8 Artist-Designed Cabins', 'Hand-Painted Interiors', 'Elegant Reception & Spa', 'Two Private Sundecks'] },
];

export default function RegionPageClient() {
  useEffect(() => { trackCruiseView('Nile Cruises'); }, []);
  const fleet = useHospitalityShowcase('nile-cruises', defaultFleet);

  return (
    <HospitalityRegionPageTemplate
      path="/hospitality/nile-cruises"
      eyebrowIcon={Anchor}
      nav={regionNav('nile-cruises')}
      showcase={fleet}
      fallback={{
        eyebrow: '100% Exclusively Owned Fleet',
        title: 'The River',
        accentTitle: 'Masters',
        subtitle: 'Commanding the ancient waters of the Nile with absolute prestige, uncompromised luxury, and legendary hospitality.',
        heroImage: '/images/cruise-1.jpg',
        introHeading: "A Legacy Forged on the World's Most Historic River",
        introBody: "We do not just broker river cruises; we own and operate a majestic fleet of floating palaces. From intimate boutique vessels to our ultra-luxury flagship, every ship in the Flash Group portfolio guarantees your VIP clients an unforgettable journey through Egypt's timeless wonders.",
        ctaHeading: 'Command The Current.',
        ctaBody: 'Ready to secure the ultimate floating luxury for your elite clients? Partner directly with the source.',
      }}
    />
  );
}
