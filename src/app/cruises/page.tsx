'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Anchor, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const cruises = [
  {
    id: 'nile-excellence',
    name: 'Nile Excellence',
    tagline: 'Modern Boutique Elegance',
    description: 'A cozy yet modern boutique Nile cruise featuring 30 revamped cabins with a pharaonic touch.',
    features: ['30 Cabins', 'Luxurious Suites', 'French Balconies', 'Swimming Pool'],
    image: '/images/nile-excellence-hero.jpg'
  },
  {
    id: 'nile-serenity',
    name: 'Nile Serenity',
    tagline: 'Unparalleled Beauty',
    description: 'Travel in style with 40 luxurious suites and a full-service spa for ultimate relaxation.',
    features: ['40 Suites', 'Panoramic Views', 'Rejuvenating Spa', 'Lounge Bar'],
    image: '/images/nile-serenity-hero.jpg'
  }
];

export default function CruisesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section - Serenity Cruises */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/cruises-header.jpg"
          alt="Serenity Nile Cruises"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold font-en mb-4"
          >
            Serenity
          </motion.h1>
          <p className="text-xl tracking-[0.3em] uppercase font-en">Nile Cruises Fleet</p>
        </div>
      </section>

      {/* Cruises List */}
      <section className="py-24 space-y-32">
        {cruises.map((cruise, index) => (
          <CruiseRow key={cruise.id} cruise={cruise} reverse={index % 2 !== 0} />
        ))}
      </section>
    </div>
  );
}

function CruiseRow({ cruise, reverse }: { cruise: any, reverse: boolean }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}>
        
        {/* Image side with Parallax Effect */}
        <div className="flex-1 relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
          <motion.div style={{ y }} className="absolute inset-0 h-[120%] -top-[10%]">
            <Image
              src={cruise.image}
              alt={cruise.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-sm font-bold tracking-widest uppercase mb-2">{cruise.tagline}</p>
            <h2 className="text-4xl font-bold font-en">{cruise.name}</h2>
          </div>
        </div>

        {/* Content side */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-bold uppercase tracking-wider">
            <Anchor className="w-4 h-4" />
            Premium Fleet
          </div>
          <h3 className="text-4xl font-bold text-slate-900 font-en leading-tight">
            Redefining the <span className="text-teal-700">Art of Sailing</span>
          </h3>
          <p className="text-lg text-slate-600 leading-relaxed font-en">
            {cruise.description}
          </p>

          <div className="grid grid-cols-2 gap-6">
            {cruise.features.map((feature: string) => (
              <div key={feature} className="flex items-center gap-3 text-slate-700">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="font-en font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <button className="group flex items-center gap-4 text-slate-900 font-bold text-lg font-en hover:text-teal-700 transition-colors">
            View Full Details
            <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}