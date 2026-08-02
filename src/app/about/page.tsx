// src/app/about/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Ship, Bus, UtensilsCrossed, Eye, Target, Quote, Globe2, ShieldCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";
import FlawlessProcess from '@/components/FlawlessProcess';

type AboutTimelineEntry = {
  year: string;
  title: string;
  desc: string;
};

type AboutContent = {
  hero: {
    tag: string;
    title_part1: string;
    title_part2: string;
    desc: string;
  };
  vision: string;
  mission: string;
  ceo_message: string;
  director_name: string;
  director_title: string;
  signature_img?: string;
  team_stats: string;
  timeline: AboutTimelineEntry[];
};

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // جلب البيانات ديناميكياً من الـ API
  useEffect(() => {
    fetch('/api/about')
      .then(res => res.ok ? res.json() : null)
      .then((data: AboutContent | null) => {
        if (data) setAboutData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading about data:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !aboutData) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-en">
        <Loader2 className="w-12 h-12 animate-spin text-teal-700 mb-4" />
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Loading Legacy...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full bg-white overflow-hidden">
      
      {/* 1. Monumental Hero Section */}
      <section className="relative w-full py-40 flex flex-col items-center justify-center bg-brand-navy-deep overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--color-brand-teal) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-navy-deep/80 to-slate-50 z-10"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-20 w-full flex flex-col items-center text-center mt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold font-bold text-xs uppercase tracking-[0.2em] mb-6 font-en">
              <span className="h-px w-4 bg-brand-gold" /> {aboutData.hero.tag}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-en mb-6 tracking-tight uppercase drop-shadow-lg">
              {(() => {
                const words = aboutData.hero.title_part1.split(' ');
                const lead = words.slice(0, -1).join(' ');
                const accent = words.slice(-1).join(' ');
                return <>{lead} <span className="text-brand-gold">{accent}</span></>;
              })()}
              {aboutData.hero.title_part2 && <> <br /> {aboutData.hero.title_part2}</>}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-en leading-relaxed max-w-3xl mx-auto font-light drop-shadow-md">
              {aboutData.hero.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Vision & Mission */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-slate-50 p-12 rounded-[1.5rem] border border-slate-100">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-8">
                <Eye className="w-8 h-8 text-teal-700" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 font-en mb-4">Our Vision</h2>
              <p className="text-slate-600 font-en leading-relaxed text-lg">
                {aboutData.vision}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-slate-50 p-12 rounded-[1.5rem] border border-slate-100">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-teal-700" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 font-en mb-4">Our Mission</h2>
              <p className="text-slate-600 font-en leading-relaxed text-lg">
                {aboutData.mission}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. The Flawless Process */}
      <FlawlessProcess />

      {/* 4. The Asset Portfolio */}
      <section className="w-full py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-bold text-slate-900 font-en mb-6">We Don&apos;t Just Plan Trips.<br/>We Own The Experience.</h2>
              <p className="text-lg text-slate-600 font-en leading-relaxed mb-8">
                What sets Flash Group apart is our massive infrastructure. We own and operate our fleet, our cruises, and our hotels. This absolute control over the supply chain guarantees uncompromised 5-star quality at every touchpoint.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Ship, label: "Luxury Nile Cruises" },
                  { icon: Building2, label: "5-Star Resorts & Hotels" },
                  { icon: Bus, label: "100+ VIP Fleet" },
                  { icon: UtensilsCrossed, label: "Award-Winning Dining" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                      <item.icon className="w-5 h-5 text-teal-700" />
                    </div>
                    <span className="font-en font-bold text-slate-800">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[600px] rounded-[1.5rem] overflow-hidden shadow-2xl border border-slate-100">
              <Image src="/images/vip-bus.jpg" alt="Flash Group Infrastructure" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. The Heritage Timeline (Dynamic) */}
      <section className="w-full py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative">

          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-en mb-4">The <span className="text-teal-700">Evolution</span></h2>
            <div className="w-24 h-1.5 bg-teal-700 mx-auto rounded-full"></div>
          </div>

          <div className="absolute left-6 md:left-1/2 top-[200px] bottom-0 w-1 bg-slate-100 -translate-x-1/2 rounded-full overflow-hidden">
            <motion.div
              initial={{ height: '0%' }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="w-full bg-teal-700 rounded-full"
            />
          </div>

          <div className="space-y-32 relative z-10">
            {aboutData.timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.year} className={`flex flex-col md:flex-row items-center justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  <div className="hidden md:block w-5/12"></div>
                  
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-teal-700 shadow-lg z-20"></div>

                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`w-full md:w-5/12 pl-16 md:pl-0 ${isEven ? 'md:text-left' : 'md:text-right'}`}
                  >
                    <span className="text-6xl font-bold text-slate-100 block mb-2 font-en">{item.year}</span>
                    <h3 className="text-3xl font-bold text-teal-800 font-en mb-3 tracking-widest">{item.title}</h3>
                    <p className="text-slate-600 font-en leading-relaxed text-lg">{item.desc}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. Global Operations Centers */}
      <section className="w-full py-32 bg-slate-50 border-t border-slate-100 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-teal-700 font-bold tracking-[0.2em] uppercase text-sm block mb-4 font-en">
                Global Infrastructure
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-en mb-6 leading-tight">
                Operational <span className="text-teal-700">Command</span> Centers
              </h2>
              <p className="text-slate-600 font-en text-lg leading-relaxed mb-10">
                To guarantee uncompromised quality, we do not rely on third-party agencies. Flash Group establishes its own physical strongholds in key international markets. From our nerve centers in the Middle East to our tropical outposts, these hubs ensure flawless 24/7 logistical execution.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0 border border-teal-100 mt-1">
                    <Globe2 className="w-6 h-6 text-teal-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-en mb-2">Localized Excellence</h3>
                    <p className="text-slate-500 font-en leading-relaxed">Direct oversight of all ground operations, VIP fleets, and hospitality assets without intermediaries.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0 border border-teal-100 mt-1">
                    <ShieldCheck className="w-6 h-6 text-teal-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-en mb-2">24/7 Precision Control</h3>
                    <p className="text-slate-500 font-en leading-relaxed">Dedicated regional teams providing round-the-clock support for elite corporate events and high-net-worth clients.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[500px] lg:h-[650px] w-full flex justify-end">
              <div className="relative w-[80%] h-[80%] rounded-[1.5rem] overflow-hidden shadow-2xl z-10 top-0 right-0 border-[12px] border-slate-50">
                <Image src="/images/office-1.jpg" fill sizes="(max-width: 1024px) 80vw, 40vw" alt="Flash Group Operations Hub" className="object-cover" />
              </div>
              <div className="absolute w-[60%] h-[55%] rounded-2xl overflow-hidden shadow-xl z-20 bottom-0 left-0 border-[12px] border-slate-50">
                <Image src="/images/office-2.jpg" fill sizes="(max-width: 1024px) 60vw, 30vw" alt="Regional Operations Center" className="object-cover" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. CEO Message, Team & Signature (Dynamic) */}
      <section className="w-full py-24 bg-slate-950 text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Quote className="w-12 h-12 text-teal-500 mb-8 opacity-50" />
              <h2 className="text-4xl font-bold font-en mb-6">Message From The <span className="text-teal-500">CEO</span></h2>
              <p className="text-slate-300 font-en leading-relaxed text-lg italic mb-8 border-l-4 border-teal-500 pl-6">
                &quot;{aboutData.ceo_message}&quot;
              </p>

              {/* Director Info & Signature */}
              <div className="mt-10 border-t border-white/10 pt-8">
                <h3 className="text-2xl font-bold font-en text-white uppercase tracking-widest">
                  {aboutData.director_name}
                </h3>
                <p className="text-sm text-teal-500 font-bold font-en uppercase tracking-widest mb-6">
                  {aboutData.director_title}
                </p>
                
                {/* The Signature Image */}
                {aboutData.signature_img && (
                  <div className="relative w-56 h-20 opacity-80 hover:opacity-100 transition-opacity duration-300">
                    <Image 
                      src={aboutData.signature_img} 
                      alt="Director Signature" 
                      fill
                      sizes="224px"
                      className="object-contain object-left invert brightness-0"
                    />
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md p-12 rounded-[1.5rem] border border-white/10"
            >
              <h3 className="text-3xl font-bold font-en mb-6 text-amber-500">The Team Behind The Empire</h3>
              <p className="text-slate-400 font-en leading-relaxed mb-8 text-lg">
                With more than {aboutData.team_stats} dedicated experts and consultants across four continents, our workforce is our greatest asset. Our bilingual teams speak Arabic, English, German, French, Russian, Italian, and Dutch, ensuring every guest feels understood. From the captains of our Nile cruises to the concierges at our 5-star resorts, every member of the Flash family is committed to delivering perfection.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-6xl font-bold text-white font-en">{aboutData.team_stats}</div>
                <div className="text-sm text-teal-500 font-bold uppercase tracking-[0.2em] font-en">Global<br/>Experts</div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
