// src/components/B2BSolutions.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe2, Car, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function B2BSolutions() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if(data && !data.error) setServices(data);
        setIsLoading(false);
      });
  }, []);

  // عشان المكون ده فيه 3 كروت بس، هناخد أول 3 خدمات من الداش بورد (أو نعرض داتا افتراضية لو الداش بورد فاضية)
  const displayServices = services.length >= 3 ? services.slice(0, 3) : [
    { title: "DMC & Inbound", desc: "Comprehensive ground handling, hotel contracting, and exclusive excursion management." },
    { title: "MICE Management", desc: "Flawless execution of international conferences, high-end incentive trips, and large-scale corporate events." },
    { title: "Fleet & Mobility", desc: "Direct access to our owned fleet of luxury sedans, 4x4s, and VIP coaches, ensuring uncompromised safety." }
  ];

  return (
    <section className="w-full bg-slate-50 py-24 relative z-20 border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en mb-4 tracking-tight">
            Enterprise <span className="text-[#F1B820]">Solutions</span>
          </h2>
          <p className="text-slate-500 font-en text-lg max-w-2xl mx-auto">
            Tailored operational capabilities for global travel agencies, event organizers, and corporate entities seeking flawless execution.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-[#157670]/10 flex items-center justify-center mb-8 group-hover:bg-[#157670] transition-colors duration-300">
              <Building2 className="w-8 h-8 text-[#157670] group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F162A] font-en mb-4">{displayServices[0]?.title}</h3>
            <p className="text-slate-600 font-en leading-relaxed mb-8 h-20 overflow-hidden line-clamp-3">
              {displayServices[0]?.desc}
            </p>
            <Link href="/services" className="text-[#157670] font-bold font-en flex items-center gap-2 group-hover:translate-x-2 transition-transform">
              Explore Services <ArrowRight className="w-5 h-5"/>
            </Link>
          </motion.div>

          {/* Card 2 (Highlighted) */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#157670] p-10 rounded-[2rem] shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/30">
                <Globe2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-en mb-4">{displayServices[1]?.title}</h3>
              <p className="text-white/90 font-en leading-relaxed mb-8 h-20 overflow-hidden line-clamp-3">
                {displayServices[1]?.desc}
              </p>
              <Link href="/services" className="text-[#F1B820] font-bold font-en flex items-center gap-2 hover:translate-x-2 transition-transform">
                View Case Studies <ArrowRight className="w-5 h-5"/>
              </Link>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-[#F1B820]/10 flex items-center justify-center mb-8 group-hover:bg-[#F1B820] transition-colors duration-300">
              <Car className="w-8 h-8 text-[#F1B820] group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F162A] font-en mb-4">{displayServices[2]?.title}</h3>
            <p className="text-slate-600 font-en leading-relaxed mb-8 h-20 overflow-hidden line-clamp-3">
              {displayServices[2]?.desc}
            </p>
            <Link href="/services" className="text-[#157670] font-bold font-en flex items-center gap-2 group-hover:translate-x-2 transition-transform">
              Our Fleet Assets <ArrowRight className="w-5 h-5"/>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}