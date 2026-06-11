// src/components/HeroSection.tsx
'use client';

import { useState, MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const showcases = [
  {
    id: 'group',
    name: 'FLASH GROUP',
    eyebrow: 'A 40-Year Hospitality Legacy',
    title: 'Crafting Hospitality Since 1985',
    desc: 'An Egyptian-born tourism and hospitality group owning Nile cruises, resorts, restaurants, yachts, and premium mobility assets across strategic destinations.',
    bg: '/images/egypt-bg.jpg',
  },
  {
    id: 'cruises',
    name: 'CRUISES',
    eyebrow: 'Owned Nile Cruise Fleet',
    title: 'Luxury Journeys on the Nile',
    desc: 'A curated fleet of Nile vessels delivering controlled quality, seamless logistics, and unforgettable river experiences for global partners.',
    bg: '/images/hospitality-cruise.jpg',
  },
  {
    id: 'hospitality',
    name: 'HOSPITALITY',
    eyebrow: 'Hotels, Resorts & Fine Dining',
    title: 'Assets That Shape the Experience',
    desc: 'From Red Sea sanctuaries and boutique heritage hotels to international resorts and restaurants, Flash Group owns the journey end-to-end.',
    bg: '/images/zanzibar-bg.jpg',
  },
  {
    id: 'mobility',
    name: 'MOBILITY',
    eyebrow: 'Executive Transport Infrastructure',
    title: 'Precision on Every Route',
    desc: 'A premium fleet, trained chauffeurs, and operational control built for B2B travel, MICE, VIP transfers, and large-scale movements.',
    bg: '/images/fleet-showcase.jpg',
  },
];

export default function HeroSection() {
  const [selected, setSelected] = useState(showcases[0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  }

  const bgX = useTransform(mouseX, [-0.5, 0.5], ['1.5%', '-1.5%']);
  const bgY = useTransform(mouseY, [-0.5, 0.5], ['1.5%', '-1.5%']);

  return (
    <section className="relative w-full h-screen min-h-[760px] overflow-hidden bg-[#081427]" onMouseMove={handleMouseMove}>
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{ x: bgX, y: bgY }}
          className="absolute inset-0 z-0"
        >
          <img src={selected.bg} alt={selected.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081427]/80 via-[#081427]/35 to-white/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081427]/70 via-transparent to-white/10" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#F4C300 1px, transparent 1px)', backgroundSize: '34px 34px' }} />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto h-full flex flex-col justify-center px-6 lg:px-8 pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-3xl rounded-[2rem] border border-white/20 bg-white/[0.13] backdrop-blur-xl p-8 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
          >
            <p className="flex items-center gap-3 text-[#F4C300] font-en font-black tracking-[0.28em] uppercase mb-5 text-xs md:text-sm">
              <Sparkles className="w-4 h-4" /> {selected.eyebrow}
            </p>
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-white font-en mb-7 tracking-[-0.055em] leading-[0.92] drop-shadow-lg">
              {selected.title}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-en mb-10 max-w-2xl leading-relaxed drop-shadow-md">
              {selected.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="group inline-flex items-center justify-center gap-3 bg-[#081427] text-white px-8 py-4 rounded-full text-base font-black font-en hover:bg-[#037373] transition-all duration-300 shadow-xl">
                Partner With Flash Group
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/brands" className="inline-flex items-center justify-center gap-3 bg-white/15 text-white border border-white/25 px-8 py-4 rounded-full text-base font-black font-en hover:bg-white/25 transition-all duration-300">
                Explore Portfolio
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 left-0 w-full flex justify-center gap-3 md:gap-5 z-20 px-4 flex-wrap">
          {showcases.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={`font-en font-black text-xs md:text-sm tracking-widest uppercase px-5 md:px-7 py-3 rounded-full transition-all duration-300 backdrop-blur-xl shadow-lg
                ${selected.id === item.id
                  ? 'bg-[#F4C300] text-[#081427] border border-[#F4C300] scale-105'
                  : 'bg-white/15 text-white border border-white/25 hover:bg-white/30'}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
