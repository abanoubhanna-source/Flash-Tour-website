// src/app/hospitality/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ship, Waves, Palmtree, Map, Building2, CheckCircle, ArrowRight, Loader2, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";

// دالة لمعالجة الأيقونات من الداتا
const renderIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'Ship': return <Ship className={className} />;
    case 'Waves': return <Waves className={className} />;
    case 'Palmtree': return <Palmtree className={className} />;
    case 'Map': return <Map className={className} />;
    case 'Building2': return <Building2 className={className} />;
    default: return <Globe className={className} />;
  }
};

export default function HospitalityPage() {
  const [regions, setRegions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hospitality')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setRegions(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching hospitality data:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white overflow-hidden">
      
      {/* 1. Redesigned Premium Hero */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center bg-brand-navy-deep mt-16 md:mt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hospitality-hero.jpg" alt="Flash Group Portfolio" fill sizes="100vw" className="object-cover opacity-50 scale-105 animate-[pulse_10s_ease-in-out_infinite_alternate]" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy-deep/70 via-brand-navy-deep/40 to-brand-navy-deep z-10"></div>
          <div className="absolute inset-0 opacity-[0.03] z-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        </div>
        
        <div className="relative z-20 px-6 max-w-[1200px] mx-auto w-full text-center mt-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 text-brand-teal font-bold text-xs uppercase tracking-widest mb-8 font-en">
              <span className="h-px w-6 bg-brand-teal" /> Hospitality Without Borders
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white font-en mb-6 tracking-tight leading-[1.1]">
              Everywhere You Seek <br/>
              <span className="text-brand-gold">Excellence.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-en leading-relaxed max-w-3xl mx-auto font-light mb-12">
              Our hospitality is a different breed. We are not just a service provider; we are the destination. From the majestic Nile and the vibrant Red Sea to the exotic Indian Ocean and historic European coastlines—wherever luxury is demanded, we are there.
            </p>
          </motion.div>
        </div>

        {/* Floating Quick Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-brand-navy-deep/80 border border-white/10 backdrop-blur-md rounded-2xl p-6 z-30 flex flex-wrap md:flex-nowrap justify-between gap-6 shadow-2xl"
        >
          <div className="text-left flex-1 border-r border-white/10 last:border-0 pr-4">
            <div className="text-brand-gold text-3xl font-bold font-en mb-1">4</div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest font-en">Global Regions</div>
          </div>
          <div className="text-left flex-1 border-r border-white/10 last:border-0 pr-4">
            <div className="text-brand-gold text-3xl font-bold font-en mb-1">15+</div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest font-en">Owned Properties</div>
          </div>
          <div className="text-left flex-1 border-r border-white/10 last:border-0 pr-4 hidden md:block">
            <div className="text-brand-gold text-3xl font-bold font-en mb-1">7</div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest font-en">Luxury Cruises</div>
          </div>
          <div className="text-left flex-1">
            <div className="text-brand-teal text-3xl font-bold font-en mb-1">1</div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest font-en">Unmatched Standard</div>
          </div>
        </motion.div>
      </section>

      {/* 2. Editorial Overlap Layout (Dynamic) */}
      <div className="w-full bg-slate-50 relative z-20 py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-brand-teal mb-4" />
              <p className="text-sm font-bold font-en uppercase tracking-[0.2em] text-slate-400">Loading Portfolio Regions...</p>
            </div>
          ) : (
            <div className="space-y-32">
              {regions.map((region, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={region.id} className={`flex flex-col lg:flex-row items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                    
                    {/* Image Section */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }}
                      className="w-full lg:w-7/12 relative h-[450px] lg:h-[650px] rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-0"
                    >
                      <Image src={region.img} alt={region.title} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover hover:scale-105 transition-transform duration-[1.5s]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </motion.div>

                    {/* Content Box Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
                      className={`w-full lg:w-6/12 relative z-10 bg-white p-8 md:p-12 lg:p-14 rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-slate-100 mt-[-60px] lg:mt-0 ${isEven ? 'lg:-mr-32' : 'lg:-ml-32'}`}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center">
                          {renderIcon(region.icon, "w-6 h-6 text-brand-teal")}
                        </div>
                        <span className="text-brand-teal font-bold tracking-[0.2em] uppercase text-xs font-en">
                          {region.tag}
                        </span>
                      </div>

                      <h2 className="text-4xl md:text-5xl font-bold text-brand-navy-deep font-en mb-4 leading-tight">
                        {region.title}
                      </h2>
                      <h3 className="text-xl font-bold text-brand-gold font-en mb-6">
                        {region.subtitle}
                      </h3>
                      <p className="text-slate-600 font-en text-lg leading-relaxed mb-8">
                        {region.desc}
                      </p>

                      <div className="space-y-4 mb-10">
                        {region.features.map((feature: string, fIdx: number) => (
                          <div key={fIdx} className="flex items-center gap-4 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                            <CheckCircle className="w-5 h-5 text-brand-teal shrink-0" />
                            <span className="font-en text-slate-800 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link href={region.link} className="inline-flex items-center gap-3 text-brand-navy-deep font-bold font-en text-lg hover:text-brand-teal transition-colors group">
                        Explore This Destination <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </motion.div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom CTA Section */}
      <section className="w-full py-24 bg-brand-navy-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(var(--color-brand-gold) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white font-en mb-6 leading-tight">
            Partner With <span className="text-brand-teal">The Source.</span>
          </h2>
          <p className="text-slate-400 font-en text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Why deal with intermediaries when you can deal directly with the empire that owns the assets? Secure the ultimate luxury experience for your clients today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/partner-portal" className="w-full sm:w-auto bg-brand-teal text-white px-10 py-5 rounded-full font-bold font-en text-lg hover:bg-white hover:text-brand-teal transition-all duration-300 shadow-xl">
              Access B2B Portal
            </Link>
            <Link href="#" className="w-full sm:w-auto bg-transparent border-2 border-white/20 text-white px-10 py-5 rounded-full font-bold font-en text-lg hover:border-white transition-all duration-300">
              Download Factsheet
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}