// src/app/hospitality/nile-cruises/page.tsx
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";
import { ArrowUpRight, Anchor, Ship, Waves, CheckCircle2 } from 'lucide-react';
import { trackCruiseView } from '@/lib/analytics';

const fleet = [
  { 
    id: '01', 
    name: 'Nile Serenity', 
    tag: 'THE FLAGSHIP',
    desc: 'Setting the absolute benchmark for river cruising. Designed for the global elite, offering uninterrupted panoramic views and uncompromised luxury.', 
    img: '/images/cruise-1.jpg',
    specs: ['72 Luxury Suites', 'Gourmet Gastronomy', 'Rooftop Infinity Pool', 'Private Docking']
  },
  { 
    id: '02', 
    name: 'Nile Excellence', 
    tag: 'MODERN ELEGANCE',
    desc: 'A seamless blend of contemporary design and classic river heritage, featuring expansive sun decks and premium culinary experiences.', 
    img: '/images/cruise-2.jpg',
    specs: ['68 Premium Cabins', 'Panoramic Lounge', 'Spa & Wellness', 'VIP Concierge']
  },
  { 
    id: '03', 
    name: 'Lady Carol', 
    tag: 'BOUTIQUE SANCTUARY',
    desc: 'An intimate, highly exclusive cruising experience perfectly tailored for private charters and high-net-worth corporate gatherings.', 
    img: '/images/cruise-3.jpg',
    specs: ['40 Boutique Suites', 'Exclusive Dining', 'Library Lounge', 'Charter Ready']
  },
  { 
    id: '04', 
    name: 'Magic II', 
    tag: 'PANORAMIC VOYAGER',
    desc: 'Commanding the ancient waters with breathtaking floor-to-ceiling windows, ensuring the timeless Nile is always your backdrop.', 
    img: '/images/cruise-4.jpg',
    specs: ['60 Cabins', 'Sundeck Jacuzzi', 'Fitness Center', 'Evening Entertainment']
  },
  { 
    id: '05', 
    name: 'Magic I', 
    tag: 'HERITAGE CLASSIC',
    desc: 'A legacy of majestic sailings. The optimal choice for large corporate incentive groups seeking authentic Egyptian hospitality.', 
    img: '/images/cruise-5.jpg',
    specs: ['70 Cabins', 'Grand Restaurant', 'Bazaar Onboard', 'Guided Excursions']
  },
  { 
    id: '06', 
    name: 'Lady Mary', 
    tag: 'THE SUN CHASER',
    desc: 'Exceptional sun decks and shaded lounges, providing the ultimate environment for relaxation and networking between temple visits.', 
    img: '/images/cruise-6.jpg',
    specs: ['65 Cabins', 'Massive Sun Deck', 'Poolside Bar', 'Reading Lounge']
  }
];

export default function NileCruisesPage() {
  useEffect(() => { trackCruiseView('Nile Cruises'); }, []);

  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white overflow-hidden">
      
      {/* 1. Epic Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center bg-brand-navy">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/cruise-1.jpg" 
            alt="The Royal Nile Fleet" 
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
              <Anchor className="w-4 h-4 text-brand-gold" /> 100% EXCLUSIVELY OWNED FLEET
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-en mb-6 tracking-tight drop-shadow-2xl uppercase">
              The River <br/> <span className="text-brand-gold">Masters</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-navy font-en leading-relaxed max-w-2xl mx-auto font-bold bg-white/70 backdrop-blur-md py-3 px-8 rounded-full shadow-lg">
              Commanding the ancient waters of the Nile with absolute prestige, uncompromised luxury, and legendary hospitality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Intro Statement */}
      <section className="w-full py-20 bg-white relative z-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Waves className="w-12 h-12 text-brand-teal mx-auto mb-6 opacity-50" />
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy font-en leading-tight mb-6">
              A Legacy Forged on the World&apos;s Most Historic River
            </h2>
            <p className="text-lg text-slate-500 font-en leading-relaxed">
              We do not just broker river cruises; we own and operate a majestic fleet of floating palaces. From intimate boutique vessels to our ultra-luxury flagship, every ship in the Flash Group portfolio guarantees your VIP clients an unforgettable journey through Egypt&apos;s timeless wonders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. The Fleet Showcase (Alternating Editorial Layout) */}
      <section className="w-full bg-white relative z-20 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          
          {fleet.map((ship, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={ship.id} className="relative group">
                
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
                        <Ship className="w-6 h-6 text-brand-teal" />
                      </div>
                      <span className="text-brand-gold font-bold uppercase tracking-widest text-sm font-en">
                        {ship.tag}
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-navy font-en tracking-tight uppercase mb-6">
                      {ship.name}
                    </h2>
                    
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">
                      {ship.desc}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 pt-6 border-t border-slate-100">
                      {ship.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                          <span className="text-slate-700 font-en font-medium">{spec}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/partner-portal" className="w-fit flex items-center gap-3 text-brand-teal hover:text-brand-gold uppercase tracking-widest text-sm font-bold font-en transition-colors group/btn">
                      Request Fleet Rates 
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
                      src={ship.img} 
                      alt={ship.name} 
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>
                    
                    {/* Floating ID Badge */}
                    <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-brand-teal font-bold text-xl font-en">{ship.id}</span>
                    </div>

                    <div className="absolute bottom-8 left-8 text-white font-bold font-en text-xl flex items-center gap-3">
                      Discover {ship.name}
                    </div>
                  </motion.div>

                </div>

                {/* Separator Line */}
                {idx !== fleet.length - 1 && (
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
            <Anchor className="w-16 h-16 text-brand-gold mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-bold text-white font-en tracking-tight uppercase mb-6">
              Command The Current.
            </h2>
            <p className="text-teal-100 text-lg md:text-xl font-medium leading-relaxed mb-10 font-en max-w-2xl mx-auto">
              Ready to secure the ultimate floating luxury for your elite clients? Partner directly with the source.
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