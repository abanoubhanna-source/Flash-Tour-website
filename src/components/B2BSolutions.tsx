// src/components/B2BSolutions.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe2, Car, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type ServiceSummary = {
  title: string;
  desc: string;
};

export default function B2BSolutions() {
  const [services, setServices] = useState<ServiceSummary[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then((data: ServiceSummary[] | { error?: unknown }) => {
        if (Array.isArray(data)) setServices(data);
      });
  }, []);

  // عشان المكون ده فيه 3 كروت بس، هناخد أول 3 خدمات من الداش بورد (أو نعرض داتا افتراضية لو الداش بورد فاضية)
  const displayServices = services.length >= 3 ? services.slice(0, 3) : [
    { title: "DMC & Inbound", desc: "Comprehensive ground handling, hotel contracting, and exclusive excursion management." },
    { title: "MICE Management", desc: "Flawless execution of international conferences, high-end incentive trips, and large-scale corporate events." },
    { title: "Fleet & Mobility", desc: "Direct access to our owned fleet of luxury sedans, 4x4s, and VIP coaches, ensuring uncompromised safety." }
  ];

  return (
    <section className="w-full bg-slate-50 py-20 relative z-20 border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-navy font-en mb-4 tracking-tight">
            Enterprise <span className="text-brand-gold">Solutions</span>
          </h2>
          <p className="text-slate-500 font-en text-lg max-w-2xl mx-auto">
            Tailored operational capabilities for global travel agencies, event organizers, and corporate entities seeking flawless execution.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-teal/30 transition-all duration-300 group">
            <Building2 className="w-7 h-7 text-brand-teal mb-6" />
            <div className="w-8 h-0.5 bg-brand-teal/50 mb-6" />
            <h3 className="text-2xl font-bold text-brand-navy font-en mb-4">{displayServices[0]?.title}</h3>
            <p className="text-slate-600 font-en leading-relaxed mb-8 h-20 overflow-hidden line-clamp-3">
              {displayServices[0]?.desc}
            </p>
            <Link href="/services" className="text-brand-teal font-bold font-en flex items-center gap-2 group-hover:translate-x-2 transition-transform">
              Explore Services <ArrowRight className="w-5 h-5"/>
            </Link>
          </motion.div>

          {/* Card 2 (Highlighted) */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-brand-teal p-10 rounded-2xl shadow-lg transition-all duration-300 group relative overflow-hidden">
            <div className="relative z-10">
              <Globe2 className="w-7 h-7 text-white mb-6" />
              <div className="w-8 h-0.5 bg-white/50 mb-6" />
              <h3 className="text-2xl font-bold text-white font-en mb-4">{displayServices[1]?.title}</h3>
              <p className="text-white/90 font-en leading-relaxed mb-8 h-20 overflow-hidden line-clamp-3">
                {displayServices[1]?.desc}
              </p>
              <Link href="/services" className="text-brand-gold font-bold font-en flex items-center gap-2 hover:translate-x-2 transition-transform">
                View Case Studies <ArrowRight className="w-5 h-5"/>
              </Link>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-gold/40 transition-all duration-300 group">
            <Car className="w-7 h-7 text-brand-gold mb-6" />
            <div className="w-8 h-0.5 bg-brand-gold/50 mb-6" />
            <h3 className="text-2xl font-bold text-brand-navy font-en mb-4">{displayServices[2]?.title}</h3>
            <p className="text-slate-600 font-en leading-relaxed mb-8 h-20 overflow-hidden line-clamp-3">
              {displayServices[2]?.desc}
            </p>
            <Link href="/services" className="text-brand-teal font-bold font-en flex items-center gap-2 group-hover:translate-x-2 transition-transform">
              Our Fleet Assets <ArrowRight className="w-5 h-5"/>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
