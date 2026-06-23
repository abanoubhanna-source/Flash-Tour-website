// src/app/hospitality/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Ship, Waves, Palmtree, Map, Building2, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";

// الداتا مع إضافة مسار الروابط (link) لكل قسم
const portfolioRegions = [
  {
    id: "nile",
    tag: "THE NILE RIVER",
    title: "The River Fleet",
    subtitle: "Sailing the Nile in Absolute Luxury",
    desc: "We don't just cruise the Nile; we own its finest vessels. Our massive fleet of 7 luxury floating hotels, including the ultra-luxurious 'Serenity' line, guarantees an unmatched river hospitality experience where every detail is under our direct control.",
    icon: Ship,
    img: "/images/cruise-1.jpg",
    link: "/hospitality/nile-cruises",
    features: [
      "Serenity I & II Luxury Cruises",
      "Premium Suites with Panoramic Views",
      "Gourmet Dining & Lounge Bars",
      "Exclusive Docking Rights"
    ]
  },
  {
    id: "red-sea",
    tag: "THE RED SEA",
    title: "Coastal Sanctuaries",
    subtitle: "Mastering the Land and Sea",
    desc: "From the golden sands to the deep blue. You will find our signature hospitality at the 5-Star True Beach Resort in Marsa Alam, complemented by our private motorboats and diving yachts dominating the coastline.",
    icon: Waves,
    img: "/images/true-beach.jpg",
    link: "/hospitality/coastal-sanctuaries",
    features: [
      "True Beach Resort (Family & Adults-Only)",
      "Flash Yachting (Flash 3, 4, 5)",
      "Exquisite Private Beaches",
      "World-Class Spa & Kitesurfing Hub"
    ]
  },
  {
    id: "indian-ocean",
    tag: "THE INDIAN OCEAN",
    title: "Tropical Retreats",
    subtitle: "Zanzibar's Premium Estates",
    desc: "Our footprint extends to the exotic shores of Tanzania. At our fully-owned Kiwengwa Beach Resort in Zanzibar, we deliver the Flash Group standard of luxury wrapped in a breathtaking tropical environment.",
    icon: Palmtree,
    img: "/images/zanzibar-resort.jpg",
    link: "/hospitality/tropical-retreats",
    features: [
      "Kiwengwa Beach Resort",
      "Exclusive White Sand Beaches",
      "Premium Safari Integrations",
      "Tropical Corporate Retreats"
    ]
  },
  {
    id: "mediterranean",
    tag: "THE MEDITERRANEAN",
    title: "European Elegance",
    subtitle: "The Italian Collection",
    desc: "A strategic, commanding presence in Europe's most elite destinations. Our curated collection of 7 exclusive properties across Sardinia and Sicily proves that our hospitality knows no borders.",
    icon: Map,
    img: "/images/italy-resorts.jpg",
    link: "/hospitality/european-elegance",
    features: [
      "7 Exclusive Italian Resorts",
      "Sardinia & Sicily Prime Locations",
      "Authentic Mediterranean Hospitality",
      "Elite European MICE Capabilities"
    ]
  },
  {
    id: "urban",
    tag: "URBAN CENTERS",
    title: "Heritage & Fine Dining",
    subtitle: "A Century of Elegance in Cairo",
    desc: "In the heart of the city, our hospitality takes a cultural form. We preserve history through meticulously restored 100-year-old boutique villas and elevate the culinary scene with our award-winning dining lounges.",
    icon: Building2,
    img: "/images/boutique-hotel.jpg",
    link: "/hospitality/urban-centers",
    features: [
      "1920s Boutique Hotel (Heliopolis)",
      "Carlo's Restaurant (Historic Gardens)",
      "Rossini Italian Fine Dining",
      "Personalized VIP Concierge"
    ]
  }
];

export default function HospitalityPage() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white overflow-hidden">
      
      {/* 1. Redesigned Premium Hero */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center bg-[#020617] mt-16 md:mt-20 overflow-hidden">
        
        <div className="absolute inset-0 z-0">
          <Image src="/images/hospitality-hero.jpg" alt="Flash Group Portfolio" fill className="object-cover opacity-50 scale-105 animate-[pulse_10s_ease-in-out_infinite_alternate]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-[#020617]/40 to-[#020617] z-10"></div>
          <div className="absolute inset-0 opacity-[0.03] z-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        </div>
        
        <div className="relative z-20 px-6 max-w-[1200px] mx-auto w-full text-center mt-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#157670]/30 bg-[#157670]/10 backdrop-blur-sm text-[#157670] font-bold text-xs uppercase tracking-widest mb-8 font-en">
              <Sparkles className="w-4 h-4" /> Hospitality Without Borders
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white font-en mb-6 tracking-tight leading-[1.1]">
              Everywhere You Seek <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#157670] to-[#F1B820]">Excellence.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-300 font-en leading-relaxed max-w-3xl mx-auto font-light mb-12">
              Our hospitality is a different breed. We are not just a service provider; we are the destination. From the majestic Nile and the vibrant Red Sea to the exotic Indian Ocean and historic European coastlines—wherever luxury is demanded, we are there.
            </p>

          </motion.div>
        </div>

        {/* Floating Quick Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-[#020617]/80 border border-white/10 backdrop-blur-md rounded-2xl p-6 z-30 flex flex-wrap md:flex-nowrap justify-between gap-6 shadow-2xl"
        >
          <div className="text-left flex-1 border-r border-white/10 last:border-0 pr-4">
            <div className="text-[#F1B820] text-3xl font-black font-en mb-1">4</div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest font-en">Global Regions</div>
          </div>
          <div className="text-left flex-1 border-r border-white/10 last:border-0 pr-4">
            <div className="text-[#F1B820] text-3xl font-black font-en mb-1">15+</div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest font-en">Owned Properties</div>
          </div>
          <div className="text-left flex-1 border-r border-white/10 last:border-0 pr-4 hidden md:block">
            <div className="text-[#F1B820] text-3xl font-black font-en mb-1">7</div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest font-en">Luxury Cruises</div>
          </div>
          <div className="text-left flex-1">
            <div className="text-[#157670] text-3xl font-black font-en mb-1">1</div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest font-en">Unmatched Standard</div>
          </div>
        </motion.div>

      </section>

      {/* 2. Editorial Overlap Layout */}
      <div className="w-full bg-slate-50 relative z-20 py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          
          {portfolioRegions.map((region, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={region.id} className={`flex flex-col lg:flex-row items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Image Section */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="w-full lg:w-7/12 relative h-[450px] lg:h-[650px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-0"
                >
                  <Image src={region.img} alt={region.title} fill className="object-cover hover:scale-105 transition-transform duration-[1.5s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </motion.div>

                {/* Content Box Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`w-full lg:w-6/12 relative z-10 bg-white p-8 md:p-12 lg:p-14 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-slate-100 mt-[-60px] lg:mt-0 ${isEven ? 'lg:-mr-32' : 'lg:-ml-32'}`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#157670]/10 rounded-xl flex items-center justify-center">
                      <region.icon className="w-6 h-6 text-[#157670]" />
                    </div>
                    <span className="text-[#157670] font-bold tracking-[0.2em] uppercase text-xs font-en">
                      {region.tag}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-[#020617] font-en mb-4 leading-tight">
                    {region.title}
                  </h2>
                  <h3 className="text-xl font-bold text-[#F1B820] font-en mb-6">
                    {region.subtitle}
                  </h3>
                  <p className="text-slate-600 font-en text-lg leading-relaxed mb-8">
                    {region.desc}
                  </p>

                  <div className="space-y-4 mb-10">
                    {region.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-4 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <CheckCircle className="w-5 h-5 text-[#157670] shrink-0" />
                        <span className="font-en text-slate-800 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* تم تحديث الرابط ليوجه للصفحة الفرعية الخاصة بالقسم */}
                  <Link href={region.link} className="inline-flex items-center gap-3 text-[#020617] font-black font-en text-lg hover:text-[#157670] transition-colors group">
                    Explore This Destination <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>

              </div>
            );
          })}

        </div>
      </div>

      {/* 3. Bottom CTA Section */}
      <section className="w-full py-24 bg-[#020617] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#F1B820 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white font-en mb-6 leading-tight">
            Partner With <span className="text-[#157670]">The Source.</span>
          </h2>
          <p className="text-slate-400 font-en text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Why deal with intermediaries when you can deal directly with the empire that owns the assets? Secure the ultimate luxury experience for your clients today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/partner-portal" className="w-full sm:w-auto bg-[#157670] text-white px-10 py-5 rounded-full font-black font-en text-lg hover:bg-white hover:text-[#157670] transition-all duration-300 shadow-xl">
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