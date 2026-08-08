// src/app/hospitality/european-elegance/RegionPageClient.tsx
'use client';

import { useEffect } from 'react';
import { Anchor, Briefcase, Building2, MapPin, Wine } from 'lucide-react';
import { trackHospitalityPropertyView } from '@/lib/analytics';
import { HospitalityRegionPageTemplate, useHospitalityShowcase, type HospitalityShowcaseItem } from '@/components/hospitality/HospitalityRegionPageTemplate';
import { regionNav } from '@/components/hospitality/region-nav';

const defaultMediterraneanData: HospitalityShowcaseItem[] = [
  { id: '01', name: 'President Sea Palace Hotel', slug: 'president-sea-palace-hotel', tag: 'NOTO MARINA, SICILY', desc: 'A charming 4-star seaside retreat on the beachfront of Noto Marina, surrounded by lush gardens, swaying palm trees, and the crystal-clear Mediterranean, with direct access to a sandy beach. Choose from 74 rooms with side sea views, and enjoy authentic Sicilian dining across two restaurants and two bars, an Italian entertainment team, a fully equipped gym, and wheelchair-friendly facilities.', img: '/images/sicily-main.jpg', icon: Building2, specs: ['74 Sea-View Rooms', 'Buffet & Poolside Dining', 'Daily Entertainment Team', 'Wheelchair-Friendly Areas'] },
  { id: '02', name: 'Castelsardo Resort', slug: 'castelsardo-resort', tag: 'SARDINIA', desc: 'An exceptional seaside retreat with spectacular views of Asinara Island, minutes from the medieval village of Castelsardo. The resort features 132 traditionally styled Sardinian rooms, most with private balconies, alongside a main restaurant, pizzeria, and sea-view bar, plus a gym, tennis court, and daily live entertainment.', img: '/images/sardinia-main.jpg', icon: MapPin, specs: ['132 Rooms, 99 Sea-View', 'Pizzeria & Sea-View Bar', 'Tennis Court & Gym', 'Live Evening Entertainment'] },
  { id: '03', name: 'Hopps Hotel', slug: 'hopps-hotel', tag: 'MAZARA DEL VALLO, SICILY', desc: 'An incredible 4-star retreat on the picturesque seafront of Mazara del Vallo, with easy access to a private beach equipped with sun loungers and umbrellas. The hotel offers 235 rooms with a variety of views, pizzeria restaurants, two bars, swimming pools, and a vibrant entertainment program for all ages.', img: '/images/italy-resorts.jpg', icon: Wine, specs: ['235 Rooms, Multiple Views', 'Private Beach Access', 'Pizzeria & Two Bars', 'Entertainment For All Ages'] },
  { id: '04', name: "Baia D'Oro Hotel", slug: 'baia-doro-hotel', tag: 'SICILY BEACHFRONT', desc: "One of Sicily's incredible beachfront resorts, offering 68 rooms and bungalows, most with sea views and private terraces. Guests enjoy separate adult and children's pools, buffet dining across two restaurants, a fully equipped gym, and a vibrant French entertainment team with daily and evening activities.", img: '/images/hospitality-italy.jpg', icon: Building2, specs: ["68 Rooms & Bungalows", "Adult & Kids' Pools", 'Accessible Rooms Available', 'French Entertainment Team'] },
  { id: '05', name: 'Hotel Eloro', slug: 'hotel-club-eloro', tag: 'NEAR NOTO ANTICA & SYRACUSE, SICILY', desc: 'Surrounded by historic sites including Noto Antica, Eloro, and Syracuse, this beachfront hotel overlooks a wide sandy bay with pools for adults and kids. Its 247 rooms mostly enjoy sea views, and dining spans seven cuisines, from Sicilian and grill to fish, Greek, and Mexican, alongside a mini club, tennis court, and sports field.', img: '/images/sicily-main.jpg', icon: MapPin, specs: ['247 Rooms, Mostly Sea-View', '7 Dining Cuisines', 'Mini Club & Playground', 'Tennis & Multi-Sport Field'] },
  { id: '06', name: 'Hotel Dolcestate Club', slug: 'hotel-dolcestate-club', tag: 'SICILIAN TYRRHENIAN COAST', desc: "Set on Sicily's Tyrrhenian coast near Buonfornello, this 60-room hotel blends modern comfort with traditional Sicilian and Italian cuisine. Guests enjoy banquet facilities for 20 to 300 guests, a reading room, massage centre, two pools, a bocce court, and a 250-seat amphitheatre for entertainment.", img: '/images/italy-resorts.jpg', icon: Briefcase, specs: ['60 Rooms, Standard & Superior', 'Banquet Halls For 20–300', 'Massage Centre & Reading Room', '250-Seat Amphitheatre'] },
  { id: '07', name: 'Le Dune Beach Club', slug: 'le-dune-beach-club', tag: 'SICILY BEACHFRONT', desc: 'A beachfront bungalow-style property designed for relaxing stays with family and friends, with easy access to the sea and panoramic coastal scenery. Facilities include a fresh-water adult pool, a bar, well-maintained gardens, and beach volleyball, tennis, and soccer, plus a Mini and Baby Club for children aged 4 to 12.', img: '/images/hospitality-italy.jpg', icon: Wine, specs: ['Beachfront Bungalows', 'Beach Sports & Amphitheatre', 'Mini & Baby Club (Ages 4–12)', 'Guarded Parking Available'] },
];

export default function RegionPageClient() {
  useEffect(() => { trackHospitalityPropertyView('European Elegance'); }, []);
  const mediterraneanData = useHospitalityShowcase('european-elegance', defaultMediterraneanData);

  return (
    <HospitalityRegionPageTemplate
      path="/hospitality/european-elegance"
      eyebrowIcon={Anchor}
      nav={regionNav('european-elegance')}
      showcase={mediterraneanData}
      fallback={{
        eyebrow: 'The Mediterranean',
        title: 'European',
        accentTitle: 'Elegance',
        subtitle: "The Italian Collection. A strategic, commanding presence in Europe's most elite destinations.",
        heroImage: '/images/italy-hero.jpg',
        introHeading: 'Hospitality That Knows No Borders',
        introBody: 'Our curated collection of exclusive properties across Sardinia and Sicily proves our commitment to global excellence. We deliver the signature Flash Group luxury experience, perfectly tailored to the sophistication and charm of the Italian Mediterranean.',
        ctaHeading: 'Partner With The Best.',
        ctaBody: 'Secure the ultimate Mediterranean escapes for your elite clients. Connect with our corporate relations team today.',
      }}
    />
  );
}
