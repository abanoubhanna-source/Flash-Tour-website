'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import Footer from "@/components/Footer";

export default function ServicesPage() {
  const [servicesData, setServicesData] = useState<any[]>([]);

  useEffect(() => {
    // سحب البيانات من الـ API الحقيقي
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServicesData(data));
  }, []);

// ... هنا بيبدأ الـ return (متغيرش فيه حاجة)
  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-[#f8fafc] overflow-hidden selection:bg-[#157670] selection:text-white">
      
      {/* 1. Page Header (Hero) */}
      <section className="relative w-full py-40 flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/services-hero.jpg" 
            alt="Services Hero Background" 
            fill 
            className="object-cover opacity-50" 
            priority 
          />
          {/* Gradient: Dark at top for text visibility, transparent in middle, fading to white/slate at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/95 via-[#020617]/50 to-[#f8fafc] z-10"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto w-full mt-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F1B820]/30 bg-[#F1B820]/10 text-[#F1B820] font-bold text-xs uppercase tracking-[0.2em] mb-6 font-en">
              <ShieldCheck className="w-4 h-4" /> Global Portfolio
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white font-en mb-6 tracking-tight uppercase drop-shadow-lg">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#157670] to-[#F1B820]">Services.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 font-en leading-relaxed max-w-3xl mx-auto font-light drop-shadow-md">
              Egyptian international company that owns various brands and sister companies in the field of tourism and hospitality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Services Catalog (Image Cards Grid) */}
      <section className="w-full pb-32 pt-10 relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {servicesData.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col border border-slate-100"
              >
                {/* Image Section */}
                <div className="relative w-full h-64 overflow-hidden bg-slate-200">
                  <Image 
                    src={service.img} 
                    alt={service.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                  
                  {/* Title over image (looks very premium) */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-black text-white font-en uppercase tracking-tight leading-snug drop-shadow-lg">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Text Content Section */}
                <div className="p-8 flex-grow flex flex-col">
                  <p className="text-slate-600 font-en text-sm leading-relaxed mb-6 flex-grow">
                    {service.desc}
                  </p>
                  
                  {/* Small visual anchor at the bottom of each card */}
                  <div className="w-8 h-1 bg-gradient-to-r from-[#157670] to-[#F1B820] rounded-full mt-auto opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Grand CTA */}
      <section className="w-full py-32 bg-[#020617] relative overflow-hidden z-20">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#F1B820 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 text-white">
          <h2 className="text-5xl md:text-7xl font-black font-en mb-6 tracking-tight uppercase">
            Scale With <span className="text-[#F1B820]">Confidence.</span>
          </h2>
          <p className="text-slate-400 font-en text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            Partner with Flash Group to gain direct access to our comprehensive hospitality and operational capabilities.
          </p>
          <Link href="/partner-portal" className="inline-flex items-center gap-3 px-12 py-6 bg-white text-[#020617] rounded-full font-black font-en text-sm uppercase tracking-widest hover:bg-[#F1B820] transition-all shadow-2xl group">
            Access Partner Portal <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}