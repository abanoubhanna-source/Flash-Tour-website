// src/app/hospitality/nile-cruises/page.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";
import { ArrowUpRight, Anchor } from 'lucide-react';

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

const transitionEase = [0.25, 1, 0.5, 1] as const;

export default function NileCruisesPage() {
  return (
    <main className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-[#020617] text-white scroll-smooth selection:bg-[#F1B820] selection:text-black [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* 1. Hero Slide */}
      <section className="relative h-screen w-full snap-start snap-always flex flex-col items-center justify-center overflow-hidden shrink-0">
        <div className="absolute inset-0 z-0">
          <Image src="/images/cruise-1.jpg" alt="Flash Group Nile Cruises" fill className="object-cover opacity-50 scale-105" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/60 to-[#020617]"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 w-full max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease: transitionEase }}
            viewport={{ once: false }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#F1B820]/30 bg-[#F1B820]/10 text-[#F1B820] font-bold text-xs uppercase tracking-[0.3em] mb-10 font-en backdrop-blur-md">
              <Anchor className="w-4 h-4" /> 100% Owned Fleet
            </span>
            <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] font-black font-en mb-6 tracking-tighter uppercase leading-[0.85] text-white">
              The River <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#157670] to-[#F1B820]">Masters.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-en leading-relaxed max-w-3xl mx-auto font-medium mt-10">
              Scroll down to discover our majestic fleet.
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-white/20 overflow-hidden z-20">
          <motion.div 
            className="w-full h-1/2 bg-[#F1B820]"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </section>

      {/* 2. The Fleet Showcase (تعديل بناءً على الصورة اللي بعتها) */}
      {fleet.map((ship) => (
        <section 
          key={ship.id} 
          className="relative h-screen w-full snap-start snap-always flex flex-col justify-end overflow-hidden shrink-0 group"
        >
          {/* Background Image */}
          <Image 
            src={ship.img} 
            alt={ship.name} 
            fill 
            className="object-cover opacity-80 scale-100 group-hover:scale-105 transition-transform duration-[5s] ease-out" 
          />
          
          {/* Gradient overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent z-0"></div>

          {/* Content Box (زي الصورة بالمللي) */}
          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-16 mb-16 md:mb-24">
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, ease: transitionEase }}
              className="bg-[#0A0F1C]/80 backdrop-blur-md border border-white/5 p-8 md:p-12 max-w-3xl rounded-sm"
            >
              {/* Tag Box */}
              <div className="inline-block bg-[#1A2130] px-4 py-2 mb-4">
                <span className="text-[#F1B820] font-bold text-xs uppercase tracking-[0.2em] font-en">
                  {ship.tag}
                </span>
              </div>
              
              {/* Title */}
              <h2 className="text-5xl md:text-7xl font-black text-white font-en mb-6 uppercase tracking-tight leading-none">
                {ship.name}
              </h2>
              
              {/* Description */}
              <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed mb-10 font-en">
                {ship.desc}
              </p>

              {/* Specs Grid (العواميد والنقط الخضراء) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-10 border-t border-white/10 pt-8">
                {ship.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#157670] shrink-0"></div>
                    <span className="text-white text-sm md:text-base font-bold uppercase tracking-widest font-en">{spec}</span>
                  </div>
                ))}
              </div>

              {/* B2B Action Button */}
              <Link href="/partner-portal" className="inline-flex items-center gap-3 text-[#157670] hover:text-[#F1B820] uppercase tracking-widest text-sm font-bold font-en transition-colors group">
                Request B2B Rates 
                <span className="w-8 h-8 rounded-full border border-[#157670] flex items-center justify-center group-hover:border-[#F1B820] transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>

          </div>
        </section>
      ))}

      {/* 3. Final Slide: CTA & Footer */}
      <section className="relative h-screen w-full snap-start snap-always bg-[#157670] flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '50px 50px' }}></div>
        
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: transitionEase }}>
            <Anchor className="w-16 h-16 text-[#F1B820] mx-auto mb-8 opacity-90" />
            <h2 className="text-5xl md:text-8xl font-black font-en tracking-tighter uppercase mb-6 text-white">
              Command The Current.
            </h2>
            <p className="text-teal-100 text-lg md:text-2xl font-medium leading-relaxed mb-12 font-en max-w-3xl mx-auto">
              Ready to secure the ultimate floating luxury for your elite clients? Partner with the source directly.
            </p>
            <Link href="/partner-portal" className="inline-block bg-[#020617] text-white px-12 py-6 uppercase tracking-widest text-sm font-black font-en hover:bg-white hover:text-[#020617] transition-all duration-500 rounded-full shadow-2xl">
              Access Partner Portal
            </Link>
          </motion.div>
        </div>

        <div className="w-full relative z-20">
          <Footer />
        </div>
      </section>

    </main>
  );
}