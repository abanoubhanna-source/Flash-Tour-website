// src/components/FleetSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Car, ShieldCheck, Cog, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { HospitalityTransportationSectionData } from '@/lib/cms/pages/schema';

type Props = { content?: HospitalityTransportationSectionData };

const defaultFeatures = [
  "Over 150+ owned vehicles globally",
  "Latest luxury models",
  "In-house maintenance",
  "GPS tracked operations",
  "Highly trained chauffeurs",
];

export default function FleetSection({ content }: Props) {
  const features = content?.features?.length ? content.features : defaultFeatures;

  return (
    <section className="w-full bg-brand-navy py-28 relative z-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-sm block mb-4 font-en flex items-center gap-2">
              <Car className="w-5 h-5" /> Executive Mobility
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-en mb-6 leading-tight">
              {content?.heading || "Unmatched VIP Transportation"}
            </h2>
            <p className="text-slate-300 font-en text-lg leading-relaxed mb-8">
              {content?.description || "Corporate travel requires precision. Our massive, fully-owned fleet of VIP coaches, luxury sedans, and 4x4s ensures that your delegates are moved with absolute safety, punctuality, and prestige."}
            </p>

            <ul className="space-y-4 mb-10">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 font-en text-slate-200">
                  <div className="bg-brand-teal rounded-full p-1"><Check className="w-4 h-4 text-white" /></div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6">
              <Link href="/hospitality#transportation" className="px-8 py-4 bg-brand-gold text-brand-navy font-bold font-en rounded-full hover:bg-white transition-colors shadow-lg">
                View Fleet Specs
              </Link>
              <div className="flex items-center gap-2 text-slate-400 font-en text-sm">
                <ShieldCheck className="w-5 h-5 text-brand-teal" /> Fully Insured
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[500px] w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal/20 to-transparent rounded-[1.5rem] border border-white/10 overflow-hidden">
              <Image
                src={content?.image.url || "/images/fleet-showcase.jpg"}
                alt={content?.image.alt || "Flash Group VIP Fleet"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              />
              <div className="absolute bottom-8 -left-6 bg-white p-6 rounded-3xl shadow-2xl flex items-center gap-4">
                <div className="bg-brand-navy p-4 rounded-2xl text-brand-gold">
                  <Cog className="w-8 h-8 animate-[spin_4s_linear_infinite]" />
                </div>
                <div>
                  <p className="text-brand-navy font-bold font-en text-2xl">24/7</p>
                  <p className="text-slate-500 font-en text-xs font-bold uppercase tracking-wider">Operations<br/>Control</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
