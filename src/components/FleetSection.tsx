// src/components/FleetSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Car, ShieldCheck, Cog, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const fleetFeatures = [
  "Over 150+ owned vehicles globally",
  "Latest Mercedes-Benz & luxury models",
  "In-house maintenance & safety checks",
  "GPS tracked with 24/7 operations control",
  "Highly trained multilingual chauffeurs"
];

export default function FleetSection() {
  return (
    <section className="w-full bg-[#0F162A] py-24 relative z-20 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-[#157670]/5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#F1B820] font-bold tracking-[0.2em] uppercase text-sm block mb-4 font-en flex items-center gap-2">
              <Car className="w-5 h-5" /> Executive Mobility
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white font-en mb-6 leading-tight">
              Unmatched VIP <br /> <span className="text-[#157670]">Transportation</span>
            </h2>
            <p className="text-slate-300 font-en text-lg leading-relaxed mb-8">
              Corporate travel requires precision. Our massive, fully-owned fleet of VIP coaches, luxury sedans, and 4x4s ensures that your delegates are moved with absolute safety, punctuality, and prestige.
            </p>

            <ul className="space-y-4 mb-10">
              {fleetFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 font-en text-slate-200">
                  <div className="bg-[#157670] rounded-full p-1"><Check className="w-4 h-4 text-white" /></div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6">
              <Link href="/services" className="px-8 py-4 bg-[#F1B820] text-[#0F162A] font-bold font-en rounded-full hover:bg-white transition-colors shadow-lg">
                View Fleet Specs
              </Link>
              <div className="flex items-center gap-2 text-slate-400 font-en text-sm">
                <ShieldCheck className="w-5 h-5 text-[#157670]" /> Fully Insured
              </div>
            </div>
          </motion.div>

          {/* Right Image Composition */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[500px] w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#157670]/20 to-transparent rounded-[2.5rem] border border-white/10 overflow-hidden">
              {/* إنت محتاج تحط صورة فخمة للأسطول بتاعكم هنا */}
              <Image 
                src="/images/fleet-showcase.jpg" 
                alt="Flash Group VIP Fleet" 
                fill 
                className="object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 -left-6 bg-white p-6 rounded-3xl shadow-2xl flex items-center gap-4">
                <div className="bg-[#0F162A] p-4 rounded-2xl text-[#F1B820]">
                  <Cog className="w-8 h-8 animate-[spin_4s_linear_infinite]" />
                </div>
                <div>
                  <p className="text-[#0F162A] font-black font-en text-2xl">24/7</p>
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