// src/app/hospitality/european-elegance/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";
import { ArrowUpRight, CheckCircle2, Building2, MapPin, Wine, Briefcase, Anchor } from 'lucide-react';
import { trackHospitalityPropertyView } from '@/lib/analytics';

type CmsProperty = { slug: string; name: string; tag: string; desc: string; roomsOrCabins: number | null; facilities: string[]; diningOptions: string[] };

function buildSpecs(item: CmsProperty): string[] {
  const specs: string[] = [];
  if (item.roomsOrCabins) specs.push(`${item.roomsOrCabins} Rooms`);
  specs.push(...item.diningOptions.slice(0, 1), ...item.facilities.slice(0, 3));
  return specs.slice(0, 4);
}

const defaultMediterraneanData = [
  { 
    id: '01', 
    name: 'President Sea Palace Hotel', 
    slug: 'president-sea-palace-hotel',
    tag: 'NOTO MARINA, SICILY',
    desc: 'A charming 4-star seaside retreat on the beachfront of Noto Marina, surrounded by lush gardens, swaying palm trees, and the crystal-clear Mediterranean, with direct access to a sandy beach. Choose from 74 rooms with side sea views, and enjoy authentic Sicilian dining across two restaurants and two bars, an Italian entertainment team, a fully equipped gym, and wheelchair-friendly facilities.', 
    img: '/images/sicily-main.jpg',
    icon: Building2,
    specs: ['74 Sea-View Rooms', 'Buffet & Poolside Dining', 'Daily Entertainment Team', 'Wheelchair-Friendly Areas']
  },
  { 
    id: '02', 
    name: 'Castelsardo Resort', 
    slug: 'castelsardo-resort',
    tag: 'SARDINIA',
    desc: 'An exceptional seaside retreat with spectacular views of Asinara Island, minutes from the medieval village of Castelsardo. The resort features 132 traditionally styled Sardinian rooms, most with private balconies, alongside a main restaurant, pizzeria, and sea-view bar, plus a gym, tennis court, and daily live entertainment.', 
    img: '/images/sardinia-main.jpg',
    icon: MapPin,
    specs: ['132 Rooms, 99 Sea-View', 'Pizzeria & Sea-View Bar', 'Tennis Court & Gym', 'Live Evening Entertainment']
  },
  { 
    id: '03', 
    name: 'Hopps Hotel', 
    slug: 'hopps-hotel',
    tag: 'MAZARA DEL VALLO, SICILY',
    desc: 'An incredible 4-star retreat on the picturesque seafront of Mazara del Vallo, with easy access to a private beach equipped with sun loungers and umbrellas. The hotel offers 235 rooms with a variety of views, pizzeria restaurants, two bars, swimming pools, and a vibrant entertainment program for all ages.', 
    img: '/images/italy-resorts.jpg',
    icon: Wine,
    specs: ['235 Rooms, Multiple Views', 'Private Beach Access', 'Pizzeria & Two Bars', 'Entertainment For All Ages']
  },
  { 
    id: '04', 
    name: "Baia D'Oro Hotel", 
    slug: 'baia-doro-hotel',
    tag: 'SICILY BEACHFRONT',
    desc: 'One of Sicily\u2019s incredible beachfront resorts, offering 68 rooms and bungalows, most with sea views and private terraces. Guests enjoy separate adult and children\u2019s pools, buffet dining across two restaurants, a fully equipped gym, and a vibrant French entertainment team with daily and evening activities.', 
    img: '/images/hospitality-italy.jpg',
    icon: Building2,
    specs: ['68 Rooms & Bungalows', 'Adult & Kids\u2019 Pools', 'Accessible Rooms Available', 'French Entertainment Team']
  },
  { 
    id: '05', 
    name: 'Hotel Eloro', 
    slug: 'hotel-club-eloro',
    tag: 'NEAR NOTO ANTICA & SYRACUSE, SICILY',
    desc: 'Surrounded by historic sites including Noto Antica, Eloro, and Syracuse, this beachfront hotel overlooks a wide sandy bay with pools for adults and kids. Its 247 rooms mostly enjoy sea views, and dining spans seven cuisines, from Sicilian and grill to fish, Greek, and Mexican, alongside a mini club, tennis court, and sports field.', 
    img: '/images/sicily-main.jpg',
    icon: MapPin,
    specs: ['247 Rooms, Mostly Sea-View', '7 Dining Cuisines', 'Mini Club & Playground', 'Tennis & Multi-Sport Field']
  },
  { 
    id: '06', 
    name: 'Hotel Dolcestate Club', 
    slug: 'hotel-dolcestate-club',
    tag: 'SICILIAN TYRRHENIAN COAST',
    desc: 'Set on Sicily\u2019s Tyrrhenian coast near Buonfornello, this 60-room hotel blends modern comfort with traditional Sicilian and Italian cuisine. Guests enjoy banquet facilities for 20 to 300 guests, a reading room, massage centre, two pools, a bocce court, and a 250-seat amphitheatre for entertainment.', 
    img: '/images/italy-resorts.jpg',
    icon: Briefcase,
    specs: ['60 Rooms, Standard & Superior', 'Banquet Halls For 20\u2013300', 'Massage Centre & Reading Room', '250-Seat Amphitheatre']
  },
  { 
    id: '07', 
    name: 'Le Dune Beach Club', 
    slug: 'le-dune-beach-club',
    tag: 'SICILY BEACHFRONT',
    desc: 'A beachfront bungalow-style property designed for relaxing stays with family and friends, with easy access to the sea and panoramic coastal scenery. Facilities include a fresh-water adult pool, a bar, well-maintained gardens, and beach volleyball, tennis, and soccer, plus a Mini and Baby Club for children aged 4 to 12.', 
    img: '/images/hospitality-italy.jpg',
    icon: Wine,
    specs: ['Beachfront Bungalows', 'Beach Sports & Amphitheatre', 'Mini & Baby Club (Ages 4\u201312)', 'Guarded Parking Available']
  }
];

export default function EuropeanElegancePage() {
  const [mediterraneanData, setMediterraneanData] = useState(defaultMediterraneanData);
  useEffect(() => { trackHospitalityPropertyView('European Elegance'); }, []);
  useEffect(() => {
    const slugs = defaultMediterraneanData.map((item) => ('slug' in item ? (item as { slug?: string }).slug : undefined)).filter(Boolean).join(',');
    if (!slugs) return;
    fetch(`/api/hospitality/properties?slugs=${slugs}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((items: CmsProperty[]) => {
        if (!items.length) return;
        const bySlug = new Map(items.map((item) => [item.slug, item]));
        setMediterraneanData((current) => current.map((hotel) => {
          const slug = 'slug' in hotel ? (hotel as { slug?: string }).slug : undefined;
          const match = slug ? bySlug.get(slug) : undefined;
          if (!match) return hotel;
          const specs = buildSpecs(match);
          return { ...hotel, name: match.name, tag: match.tag || hotel.tag, desc: match.desc || hotel.desc, specs: specs.length ? specs : hotel.specs };
        }));
      })
      .catch(() => undefined);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white overflow-hidden">
      
      {/* 1. Epic Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center bg-brand-navy">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/italy-hero.jpg" 
            alt="European Elegance" 
            sizes="100vw"
            fill 
            className="object-cover opacity-50"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-navy/70 to-white z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-brand-gold font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-6 font-en flex items-center justify-center gap-2">
              <Anchor className="w-4 h-4 text-brand-gold" /> THE MEDITERRANEAN
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-en mb-6 tracking-tight drop-shadow-2xl uppercase">
              European <br/> <span className="text-brand-gold">Elegance</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-navy font-en leading-relaxed max-w-2xl mx-auto font-bold bg-white/70 backdrop-blur-md py-3 px-8 rounded-full shadow-lg">
              The Italian Collection. A strategic, commanding presence in Europe&apos;s most elite destinations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Intro Statement */}
      <section className="w-full py-20 bg-white relative z-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Building2 className="w-12 h-12 text-brand-teal mx-auto mb-6 opacity-50" />
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy font-en leading-tight mb-6">
              Hospitality That Knows No Borders
            </h2>
            <p className="text-lg text-slate-500 font-en leading-relaxed">
              Our curated collection of exclusive properties across Sardinia and Sicily proves our commitment to global excellence. We deliver the signature Flash Group luxury experience, perfectly tailored to the sophistication and charm of the Italian Mediterranean.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. The Mediterranean Showcase (Alternating Editorial Layout) */}
      <section className="w-full bg-white relative z-20 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          
          {mediterraneanData.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={item.id} className="relative group">
                
                {/* Text & Main Image Container */}
                <div className={`flex flex-col lg:flex-row items-center gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Text Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }} 
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true, margin: "-100px" }} 
                    className="w-full lg:w-5/12 flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center border border-brand-teal/20">
                        <item.icon className="w-6 h-6 text-brand-teal" />
                      </div>
                      <span className="text-brand-gold font-bold uppercase tracking-widest text-sm font-en">
                        {item.tag}
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-navy font-en tracking-tight uppercase mb-6">
                      {item.name}
                    </h2>
                    
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">
                      {item.desc}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 pt-6 border-t border-slate-100">
                      {item.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                          <span className="text-slate-700 font-en font-medium">{spec}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/destinations/italy" className="w-fit flex items-center gap-3 text-brand-teal hover:text-brand-gold uppercase tracking-widest text-sm font-bold font-en transition-colors group/btn">
                      Explore This Destination 
                      <span className="w-10 h-10 rounded-full border border-brand-teal/30 flex items-center justify-center group-hover/btn:border-brand-gold transition-colors bg-slate-50 group-hover/btn:bg-white">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </motion.div>

                  {/* Image Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }} 
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true, margin: "-100px" }} 
                    className="w-full lg:w-7/12 relative h-[500px] lg:h-[600px] rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_60px_rgba(21,118,112,0.15)] transition-all duration-700"
                  >
                    <Image 
                      src={item.img} 
                      alt={item.name} 
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>
                    
                    {/* Floating ID Badge */}
                    <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-brand-teal font-bold text-xl font-en">{item.id}</span>
                    </div>

                    <div className="absolute bottom-8 left-8 text-white font-bold font-en text-xl flex items-center gap-3">
                      Discover {item.name}
                    </div>
                  </motion.div>

                </div>

                {/* Separator Line */}
                {idx !== mediterraneanData.length - 1 && (
                  <div className="w-full max-w-3xl mx-auto h-px bg-slate-200 mt-32"></div>
                )}
              </div>
            );
          })}

        </div>
      </section>

      {/* 4. Grand CTA Section */}
      <section className="w-full bg-brand-teal py-24 relative z-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat z-0"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Wine className="w-16 h-16 text-brand-gold mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-bold text-white font-en tracking-tight uppercase mb-6">
              Partner With The Best.
            </h2>
            <p className="text-teal-100 text-lg md:text-xl font-medium leading-relaxed mb-10 font-en max-w-2xl mx-auto">
              Secure the ultimate Mediterranean escapes for your elite clients. Connect with our corporate relations team today.
            </p>
            <Link href="/partner-portal" className="inline-block bg-brand-navy text-white px-10 py-5 rounded-full font-bold font-en text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 shadow-xl hover:shadow-2xl">
              Access B2B Portal
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}