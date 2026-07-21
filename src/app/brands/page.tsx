// src/app/brands/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Palmtree, Building, Ship, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";

// قاموس الأيقونات
const iconMap: { [key: string]: any } = {
  Anchor: Anchor,
  Palmtree: Palmtree,
  Building: Building,
  Ship: Ship,
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => {
        if(data && !data.error) setBrands(data);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full bg-white overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-slate-950">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/vip-bus.jpg" 
            alt="Flash Group Brands" 
            fill 
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 to-slate-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-teal-400 font-bold tracking-[0.3em] uppercase text-sm font-en mb-6">Our Portfolio</p>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-en mb-6 tracking-tight">
              The <span className="text-teal-500">Collection</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-en leading-relaxed">
              Discover our owned and operated hospitality brands, meticulously crafted to deliver unparalleled luxury.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. The Brands Showcase (Zig-Zag Layout) */}
      <section className="w-full py-12">
        {brands.map((brand: any, index: number) => {
          const isEven = index % 2 === 0;
          return (
            <div key={brand.id} className={`w-full py-24 ${isEven ? 'bg-white' : 'bg-slate-50'}`}>
              <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className={`flex flex-col lg:flex-row items-center gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Image Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full lg:w-1/2"
                  >
                    <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden shadow-2xl group">
                      <Image 
                        src={brand.image} 
                        alt={brand.name} 
                        fill 
                        className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                      
                      {/* Floating Icon Badge */}
                      <div className="absolute top-8 left-8 w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                        {iconMap[brand.icon] && React.createElement(iconMap[brand.icon], { className: `w-8 h-8 text-${brand.color}-600` })}
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="w-full lg:w-1/2 space-y-6"
                  >
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${brand.color}-50 text-${brand.color}-700 font-bold text-xs uppercase tracking-widest font-en`}>
                      Exclusive Property
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-en leading-tight">
                      {brand.name}
                    </h2>
                    <h3 className={`text-xl font-bold text-${brand.color}-600 font-en`}>
                      {brand.subtitle}
                    </h3>
                    
                    <p className="text-lg text-slate-600 font-en leading-relaxed">
                      {brand.description}
                    </p>

                    <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* حل إيرور الـ TypeScript هنا */}
                      {brand.features && brand.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-6 h-6 text-${brand.color}-500 shrink-0`} />
                          <span className="text-slate-700 font-en font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8">
                      <button className="group flex items-center gap-3 bg-slate-900 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-xl">
                        Explore Brand
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Call to Action (Pre-footer) */}
      <section className="w-full py-24 bg-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold font-en mb-6">Experience the Flash Standard</h2>
          <p className="text-xl text-teal-100 font-en mb-10 leading-relaxed">
            Ready to elevate your travel experiences? Partner with us or book your next unforgettable journey across our premium properties.
          </p>
          <button className="bg-white text-teal-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-amber-500 hover:text-white transition-colors duration-300 shadow-2xl">
            Contact Our Experts
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}