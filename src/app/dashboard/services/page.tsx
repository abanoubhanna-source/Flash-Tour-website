// src/app/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";
import { ArrowRight, Briefcase, Loader2, Sparkles, Building2, Globe2, Plane, Car } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // جلب الـ 13 خدمة من الـ API
  useEffect(() => {
    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setServices(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading services:", err);
        setIsLoading(false);
      });
  }, []);

  // دالة لاختيار أيقونة مناسبة للخدمة بناءً على اسمها
  const getServiceIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('flight') || t.includes('airport')) return Plane;
    if (t.includes('transportation') || t.includes('mobility')) return Car;
    if (t.includes('tourism') || t.includes('tour') || t.includes('leisure')) return Globe2;
    return Building2;
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-slate-50 overflow-hidden">
      
      {/* 1. Epic Hero Section */}
      <section className="relative w-full h-[60vh] flex flex-col items-center justify-center bg-[#020617] overflow-hidden mt-16 md:mt-24">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/services-hero.jpg" 
            alt="Enterprise Solutions" 
            fill 
            className="object-cover opacity-30" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617] z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#157670]/30 bg-[#157670]/10 backdrop-blur-sm text-[#157670] font-bold text-xs uppercase tracking-widest mb-6 font-en">
              <Briefcase className="w-4 h-4" /> Comprehensive B2B Solutions
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white font-en mb-6 tracking-tight uppercase">
              Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#157670] to-[#F1B820]">Services</span>
            </h1>
            <p className="text-lg text-slate-300 font-en leading-relaxed max-w-2xl mx-auto font-medium">
              From global flight reservations and hotel contracting to MICE management and VIP transportation. We deliver excellence across all tourism and hospitality sectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Services Grid Section */}
      <section className="w-full py-24 relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#157670] mb-4" />
              <p className="text-sm font-bold font-en uppercase tracking-[0.2em] text-slate-400">Loading Services Directory...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, idx) => {
                const Icon = getServiceIcon(service.title);
                return (
                  <motion.div 
                    key={service.id} 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-50px" }} 
                    transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(21,118,112,0.1)] transition-all group flex flex-col h-full"
                  >
                    {/* Service Image Header */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                      <Image 
                        src={service.img} 
                        alt={service.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 to-transparent"></div>
                      
                      {/* Floating Icon */}
                      <div className="absolute bottom-4 left-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Service Content */}
                    <div className="p-8 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-[#020617] font-en leading-tight mb-4 group-hover:text-[#157670] transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-slate-600 font-en text-sm leading-relaxed mb-8">
                          {service.desc}
                        </p>
                      </div>
                      
                      <Link href="/contact" className="inline-flex items-center gap-2 text-[#157670] font-bold font-en text-xs uppercase tracking-widest hover:text-[#020617] transition-colors w-fit pt-4 border-t border-slate-100 mt-auto">
                        Request Proposal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="w-full bg-[#157670] py-20 relative z-20 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Sparkles className="w-12 h-12 text-[#F1B820] mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white font-en tracking-tight uppercase mb-6">
            Ready to Elevate Your Operations?
          </h2>
          <p className="text-teal-50 text-lg font-medium leading-relaxed mb-10 font-en max-w-2xl mx-auto">
            Our specialized in-house teams are ready to handle everything from VIP FIT packages to massive MICE events.
          </p>
          <Link href="/contact" className="inline-block bg-[#020617] text-white px-10 py-5 rounded-full font-black font-en text-sm uppercase tracking-widest hover:bg-white hover:text-[#020617] transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            Contact Corporate Team
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}