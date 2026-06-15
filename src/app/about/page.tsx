// src/app/about/page.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Building2, Ship, Bus, UtensilsCrossed, Eye, Target, Quote, Globe2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";
import FlawlessProcess from '@/components/FlawlessProcess';

// الداتا التاريخية (ممكن نخليها ديناميك بعدين لو حبيت)
const timeline = [
  { year: "1985", title: "THE FOUNDATION", desc: "Flash Tour was established in Cairo, Egypt. What started as an ambitious inbound travel agency rapidly set the foundation for redefining regional tourism standards through uncompromised dedication to quality and client satisfaction." },
  { year: "2000", title: "THE EMPIRE EMERGES", desc: "Evolution into the integrated 'Flash Group'. This pivotal era marked our shift from a service provider to an asset owner, acquiring real estate, establishing robust ground operations, and scaling our B2B logistical capabilities." },
  { year: "2015", title: "ASSET DOMINANCE", desc: "A massive expansion phase solidifying our control over the supply chain. We aggressively scaled our Nile Cruise fleet, integrated luxury hotel management, and deployed one of the largest VIP transport fleets in the region." },
  { year: "2026", title: "GLOBAL LEADERSHIP", desc: "Celebrating over 40 years of unparalleled expertise. Today, Flash Group operates across multiple continents as a premier Destination Management Company, offering elite MICE solutions, exclusive hospitality, and a massive global network." },
];

export default function AboutPage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start center", "end center"] });
  const scaleHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // 1. تعريف المتغيرات اللي هتشيل داتا المدير من الداش بورد
  const [aboutData, setAboutData] = useState({
    ceo_message: "Loading message...",
    director_name: "Loading...",
    director_title: "...",
    signature_img: "/images/Signuter.png"
  });

  // 2. سحب البيانات أول ما الصفحة تفتح
  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        if(data && !data.error) setAboutData(data);
      })
      .catch(err => console.log("Error loading about data", err));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full bg-white overflow-hidden">
      
      {/* Monumental Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center bg-slate-50 border-b border-slate-100 mt-16 md:mt-20">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0F766E 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-2 px-6 rounded-full bg-teal-50 text-teal-800 font-bold font-en tracking-[0.2em] uppercase text-sm mb-8 border border-teal-100">A 40-Year Legacy</span>
            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 font-en mb-6 tracking-tight leading-tight">
              Building an <span className="text-teal-700">Empire</span> <br /> of Hospitality.
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-en max-w-3xl mx-auto leading-relaxed">
              Since 1985, Flash Group has evolved from a visionary agency into a multinational asset-owning powerhouse in tourism, accommodation, and fine dining.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-8"><Eye className="w-8 h-8 text-teal-700" /></div>
              <h2 className="text-3xl font-bold text-slate-900 font-en mb-4">Our Vision</h2>
              <p className="text-slate-600 font-en leading-relaxed text-lg">To be the ultimate global benchmark in the tourism and hospitality industry, crafting impeccable experiences that inspire and endure.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-8"><Target className="w-8 h-8 text-teal-700" /></div>
              <h2 className="text-3xl font-bold text-slate-900 font-en mb-4">Our Mission</h2>
              <p className="text-slate-600 font-en leading-relaxed text-lg">To provide unparalleled, end-to-end travel solutions by leveraging our owned assets, ensuring absolute quality, safety, and luxury at every step of the journey.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Flawless Process */}
      <FlawlessProcess />

      {/* The Asset Portfolio */}
      <section className="w-full py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-bold text-slate-900 font-en mb-6">We Don't Just Plan Trips.<br/>We Own The Experience.</h2>
              <p className="text-lg text-slate-600 font-en leading-relaxed mb-8">What sets Flash Group apart is our massive infrastructure. We own and operate our fleet, our cruises, and our hotels. This absolute control over the supply chain guarantees uncompromised 5-star quality at every touchpoint.</p>
              <div className="grid grid-cols-2 gap-6">
                {[{ icon: Ship, label: "Luxury Nile Cruises" }, { icon: Building2, label: "5-Star Resorts & Hotels" }, { icon: Bus, label: "100+ VIP Fleet" }, { icon: UtensilsCrossed, label: "Award-Winning Dining" }].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm"><item.icon className="w-5 h-5 text-teal-700" /></div>
                    <span className="font-en font-bold text-slate-800">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
              <Image src="/images/vip-bus.jpg" alt="Flash Group Infrastructure" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Heritage Timeline */}
      <section className="w-full py-32 bg-white" ref={targetRef}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-en mb-4">The <span className="text-teal-700">Evolution</span></h2>
            <div className="w-24 h-1.5 bg-teal-700 mx-auto rounded-full"></div>
          </div>
          <div className="absolute left-6 md:left-1/2 top-[200px] bottom-0 w-1 bg-slate-100 -translate-x-1/2 rounded-full overflow-hidden">
            <motion.div style={{ height: scaleHeight }} className="w-full bg-teal-700 rounded-full" />
          </div>
          <div className="space-y-32 relative z-10">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.year} className={`flex flex-col md:flex-row items-center justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  <div className="hidden md:block w-5/12"></div>
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-teal-700 shadow-lg z-20"></div>
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className={`w-full md:w-5/12 pl-16 md:pl-0 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                    <span className="text-6xl font-black text-slate-100 block mb-2 font-en">{item.year}</span>
                    <h3 className="text-3xl font-bold text-teal-800 font-en mb-3 tracking-widest">{item.title}</h3>
                    <p className="text-slate-600 font-en leading-relaxed text-lg">{item.desc}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Operations Centers */}
      <section className="w-full py-32 bg-slate-50 border-t border-slate-100 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-teal-700 font-bold tracking-[0.2em] uppercase text-sm block mb-4 font-en">Global Infrastructure</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-en mb-6 leading-tight">Operational <span className="text-teal-700">Command</span> Centers</h2>
              <p className="text-slate-600 font-en text-lg leading-relaxed mb-10">To guarantee uncompromised quality, we do not rely on third-party agencies. Flash Group establishes its own physical strongholds in key international markets. From our nerve centers in the Middle East to our tropical outposts, these hubs ensure flawless 24/7 logistical execution.</p>
              <ul className="space-y-6">
                <li className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0 border border-teal-100 mt-1"><Globe2 className="w-6 h-6 text-teal-700" /></div>
                  <div><h4 className="text-xl font-bold text-slate-900 font-en mb-2">Localized Excellence</h4><p className="text-slate-500 font-en leading-relaxed">Direct oversight of all ground operations, VIP fleets, and hospitality assets without intermediaries.</p></div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0 border border-teal-100 mt-1"><ShieldCheck className="w-6 h-6 text-teal-700" /></div>
                  <div><h4 className="text-xl font-bold text-slate-900 font-en mb-2">24/7 Precision Control</h4><p className="text-slate-500 font-en leading-relaxed">Dedicated regional teams providing round-the-clock support for elite corporate events and high-net-worth clients.</p></div>
                </li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[500px] lg:h-[650px] w-full flex justify-end">
              <div className="relative w-[80%] h-[80%] rounded-[2.5rem] overflow-hidden shadow-2xl z-10 top-0 right-0 border-[12px] border-slate-50"><Image src="/images/office-1.jpg" fill alt="Flash Group Operations Hub" className="object-cover" /></div>
              <div className="absolute w-[60%] h-[55%] rounded-[2rem] overflow-hidden shadow-xl z-20 bottom-0 left-0 border-[12px] border-slate-50"><Image src="/images/office-2.jpg" fill alt="Regional Operations Center" className="object-cover" /></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CEO Message, Team & Signature (Dynamic Data from CMS) */}
      <section className="w-full py-24 bg-slate-950 text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Quote className="w-12 h-12 text-teal-500 mb-8 opacity-50" />
              <h2 className="text-4xl font-bold font-en mb-6">Message From The <span className="text-teal-500">CEO</span></h2>
              
              {/* 3. ربط رسالة المدير */}
              <p className="text-slate-300 font-en leading-relaxed text-lg italic mb-8 border-l-4 border-teal-500 pl-6">
                "{aboutData.ceo_message}"
              </p>

              <div className="mt-10 border-t border-white/10 pt-8">
                {/* 4. ربط اسم المدير ومنصبه */}
                <h4 className="text-2xl font-black font-en text-white uppercase tracking-widest">
                  {aboutData.director_name}
                </h4>
                <p className="text-sm text-teal-500 font-bold font-en uppercase tracking-widest mb-6">
                  {aboutData.director_title}
                </p>
                
                {/* 5. ربط صورة الإمضاء */}
                <div className="relative w-56 h-20 opacity-80 hover:opacity-100 transition-opacity duration-300">
                  {aboutData.signature_img && (
                    <Image 
                      src={aboutData.signature_img} 
                      alt="Director Signature" 
                      fill 
                      className="object-contain object-left invert brightness-0"
                    />
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/5 backdrop-blur-md p-12 rounded-[2.5rem] border border-white/10">
              <h3 className="text-3xl font-bold font-en mb-6 text-amber-500">The Team Behind The Empire</h3>
              <p className="text-slate-400 font-en leading-relaxed mb-8 text-lg">
                With more than 1000+ dedicated experts and consultants, our workforce is our greatest asset. From the captains of our Nile cruises to the concierges at our 5-star resorts, every member of the Flash family is committed to delivering perfection.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-6xl font-black text-white font-en">1000+</div>
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