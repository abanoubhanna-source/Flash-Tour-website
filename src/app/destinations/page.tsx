// src/app/destinations/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Compass, MapPin, Sun, Building, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // تفعيل نظام الروابط الذكي
import Footer from "@/components/Footer";

const destinations = [
  {
    id: 'egypt',
    name: 'Egypt',
    subtitle: 'The Crown Jewel of History',
    description: 'Experience more than 7,000 years of living history. From the timeless majesty of the Pyramids to the pristine shores of the Red Sea and the historic waters of the Nile, our Egyptian operations are the beating heart of Flash Group.',
    highlights: ['Serenity Nile Cruises', 'True Beach Resort - Marsa Alam', '1920s Boutique Hotel - Cairo', 'Tulipe Kitesurfing Hub'],
    image: '/images/egypt-bg.jpg',
    icon: Compass,
  },
  {
    id: 'uae',
    name: 'United Arab Emirates',
    subtitle: 'Where Luxury Knows No Bounds',
    description: 'Our UAE division caters to the most discerning travelers. We seamlessly blend ultra-modern luxury with authentic Arabian hospitality, offering exclusive access to VIP services, premium mobility, and bespoke experiences in Dubai and beyond.',
    highlights: ['VIP Chauffeur Services', 'Luxury Desert Safaris', 'Exclusive Hotel Partnerships', 'Corporate Retreats'],
    image: '/images/uae-bg.jpg',
    icon: Building,
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar',
    subtitle: 'The Pearl of the Indian Ocean',
    description: 'Escape to a tropical paradise where white sandy beaches meet rich cultural heritage. Our Zanzibar operations deliver untouched nature paired with Flash Group’s signature 5-star standard of comfort and safety.',
    highlights: ['Premium Beachfront Resorts', 'Spice Tour Experiences', 'Diving & Water Sports', 'Private Yacht Charters'],
    image: '/images/zanzibar-bg.jpg',
    icon: Sun,
  },
  {
    id: 'italy', // تم تعديلها هنا لتطابق فولدر /destinations/italy
    name: 'Italy',
    subtitle: 'The Essence of Sophistication',
    description: 'Catering to the sophisticated European market, we bring our legacy of luxury to the Mediterranean. From the sweet life of Sicily to the glamour of San Remo and Sardinia, we operate 7 exclusive premium properties.',
    highlights: ['7 Premium Italian Hotels', 'Sicily & Sardinia Excursions', 'Olive Oil Farm Tours', 'Bespoke Mediterranean Hospitality'],
    image: '/images/italy-bg.jpg',
    icon: MapPin,
  }
];

export default function DestinationsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full bg-slate-50 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/world-map-clean.png" 
            alt="Global Destinations" 
            fill 
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-teal-500"></div>
              <p className="text-teal-400 font-bold tracking-[0.3em] uppercase text-sm font-en">Global Reach</p>
              <div className="h-px w-16 bg-teal-500"></div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white font-en mb-6 tracking-tight leading-none">
              Explore Our <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-amber-500">World</span>
            </h1>
            <p className="text-xl text-slate-300 font-en leading-relaxed max-w-2xl mx-auto">
              Four distinct regions. Infinite possibilities. Discover the destinations where Flash Group brings luxury to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Alternating Destinations Sections */}
      <section className="w-full">
        {destinations.map((dest, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={dest.id} className="relative w-full min-h-[80vh] flex items-center overflow-hidden border-b border-slate-100">
              
              {/* صورة الخلفية للبلد */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={dest.image} 
                  alt={dest.name} 
                  fill 
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${isEven ? 'from-slate-950/90 via-slate-950/70 to-transparent' : 'from-transparent via-slate-950/70 to-slate-950/90'}`}></div>
              </div>

              {/* الكرت الزجاجي جواه رابط للتوجيه الفوري */}
              <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 w-full flex">
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`w-full lg:w-1/2 p-8 md:p-12 bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl ${isEven ? 'mr-auto' : 'ml-auto'}`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                      <dest.icon className="w-6 h-6 text-teal-400" />
                    </div>
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-sm font-en">Destination Portfolio</span>
                  </div>

                  <h2 className="text-5xl font-bold text-white font-en mb-2 tracking-tight">{dest.name}</h2>
                  <h3 className="text-xl text-teal-400 font-en mb-6">{dest.subtitle}</h3>
                  
                  <p className="text-lg text-slate-300 font-en leading-relaxed mb-8">
                    {dest.description}
                  </p>

                  <div className="space-y-3 mb-10">
                    <p className="text-white font-bold font-en uppercase tracking-wider text-sm mb-4 border-b border-white/20 pb-2">Flash Infrastructure Highlights</p>
                    {dest.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        <span className="text-slate-200 font-en">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* هنا تم التعديل: الزرار بقا Link بينقلك لصفحة البلد فوراً */}
                  <Link 
                    href={`/destinations/${dest.id}`}
                    className="w-fit group flex items-center gap-3 text-white font-bold font-en hover:text-teal-400 transition-colors duration-300"
                  >
                    Discover More 
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              </div>

            </div>
          );
        })}
      </section>

      {/* 3. CTA */}
      <section className="w-full py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 font-en mb-6">Partner With Us Globally</h2>
          <p className="text-lg text-slate-500 font-en mb-10 leading-relaxed">
            Connect with our localized regional offices to secure exclusive B2B partnerships and seamless global destination management.
          </p>
          <Link href="/contact" className="inline-block bg-teal-700 text-white px-10 py-5 rounded-full font-bold font-en text-lg hover:bg-slate-900 transition-all duration-300 shadow-xl shadow-teal-700/20">
            Contact Our Corporate Relations
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}