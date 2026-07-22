// src/app/hospitality/tropical-retreats/page.tsx
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";
import { ArrowUpRight, CheckCircle2, Building2, Sun, Trees, Briefcase, Palmtree } from 'lucide-react';
import { trackHospitalityPropertyView } from '@/lib/analytics';

const tropicalData = [
  { 
    id: '01', 
    name: 'Kiwengwa Beach Resort', 
    tag: '5-STAR ESTATES',
    desc: 'Our fully-owned flagship property in Zanzibar delivers the Flash Group standard of luxury. Boasting over 200 modern African-style units, it offers a seamless blend of natural beauty and premium comfort directly on the beach.', 
    img: '/images/zanzibar-island.jpg', // تأكد من اسم الصورة
    icon: Building2,
    specs: ['200+ Luxury Rooms', 'Premium Dining & Bars', 'Multiple Swimming Pools', 'Recreation Center']
  },
  { 
    id: '02', 
    name: 'Exclusive White Sand Beaches', 
    tag: 'PRISTINE COASTLINES',
    desc: 'Relax and unwind on some of the most famous beaches in Africa. We organize private boat safaris to secluded sandbanks in the middle of the ocean, offering absolute tranquility under the tropical sun.', 
    img: '/images/zanzibar-beach.jpg', // تأكد من اسم الصورة
    icon: Sun,
    specs: ['Private Sandbanks', 'Crystal Clear Waters', 'Luxury Sunbeds', 'Bespoke Beachside Service']
  },
  { 
    id: '03', 
    name: 'Premium Safari Integrations', 
    tag: 'WILDLIFE ADVENTURES',
    desc: 'Experience the best of both worlds. Seamlessly combine your beach retreat with thrilling wildlife excursions in the majestic Savannas, including over-day trips to Mikumi or Selous reserves.', 
    img: '/images/safari-main.jpg', // تأكد من اسم الصورة
    icon: Trees,
    specs: ['Private Car Safaris', 'Mikumi & Selous Tours', 'Guided Forest Walks', 'Spice Tour Experiences']
  },
  { 
    id: '04', 
    name: 'Tropical Corporate Retreats', 
    tag: 'MICE & INCENTIVES',
    desc: 'Elevate your corporate events in a breathtaking tropical setting. We offer tailored B2B solutions for incentive groups, combining professional environments with unforgettable leisure activities and VIP mobility.', 
    img: '/images/zanzibar-corporate.jpg', // تأكد من اسم الصورة
    icon: Briefcase,
    specs: ['Tailored B2B Solutions', 'Incentive Travel', 'Team Building Events', 'VIP Ground Mobility']
  }
];

export default function TropicalRetreatsPage() {
  useEffect(() => { trackHospitalityPropertyView('Tropical Retreats'); }, []);

  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white overflow-hidden">
      
      {/* 1. Epic Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center bg-brand-navy">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/zanzibar-main.jpg" 
            alt="Tropical Retreats" 
            sizes="100vw"
            fill 
            className="object-cover opacity-50"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-navy/70 to-white z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-brand-gold font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-6 font-en flex items-center justify-center gap-2">
              <Palmtree className="w-4 h-4 text-brand-gold" /> THE EXOTIC SHORES OF TANZANIA
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-en mb-6 tracking-tight drop-shadow-2xl uppercase">
              Tropical <br/> <span className="text-brand-gold">Retreats</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-navy font-en leading-relaxed max-w-2xl mx-auto font-bold bg-white/70 backdrop-blur-md py-3 px-8 rounded-full shadow-lg">
              Zanzibar&apos;s Premium Estates. We deliver the Flash Group standard of luxury wrapped in a breathtaking tropical environment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Intro Statement */}
      <section className="w-full py-20 bg-white relative z-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Sun className="w-12 h-12 text-brand-teal mx-auto mb-6 opacity-50" />
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy font-en leading-tight mb-6">
              A Symphony of Wildlife and Luxury
            </h2>
            <p className="text-lg text-slate-500 font-en leading-relaxed">
              Our footprint extends to the exotic shores of Tanzania. At our fully-owned Kiwengwa Beach Resort, we provide an unparalleled gateway to Zanzibar’s white sand beaches and East Africa&apos;s majestic Savannas, perfectly suited for elite leisure and corporate incentive groups.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. The Tropical Showcase (Alternating Editorial Layout) */}
      <section className="w-full bg-white relative z-20 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          
          {tropicalData.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={item.id} className="relative group">
                
                {/* Text & Main Image Container */}
                <div className={`flex flex-col lg:flex-row items-center gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Text Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }} 
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true, margin: "-100px" }} 
                    className="w-full lg:w-5/12 flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center border border-brand-teal/20">
                        <item.icon className="w-6 h-6 text-brand-teal" />
                      </div>
                      <span className="text-brand-gold font-bold uppercase tracking-widest text-sm font-en">
                        {item.tag}
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-navy font-en tracking-tight uppercase mb-6">
                      {item.name}
                    </h2>
                    
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">
                      {item.desc}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 pt-6 border-t border-slate-100">
                      {item.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                          <span className="text-slate-700 font-en font-medium">{spec}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/contact" className="w-fit flex items-center gap-3 text-brand-teal hover:text-brand-gold uppercase tracking-widest text-sm font-bold font-en transition-colors group/btn">
                      Request B2B Rates 
                      <span className="w-10 h-10 rounded-full border border-brand-teal/30 flex items-center justify-center group-hover/btn:border-brand-gold transition-colors bg-slate-50 group-hover/btn:bg-white">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </motion.div>

                  {/* Image Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }} 
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true, margin: "-100px" }} 
                    className="w-full lg:w-7/12 relative h-[500px] lg:h-[600px] rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_60px_rgba(21,118,112,0.15)] transition-all duration-700"
                  >
                    <Image 
                      src={item.img} 
                      alt={item.name} 
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>
                    
                    {/* Floating ID Badge */}
                    <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-brand-teal font-bold text-xl font-en">{item.id}</span>
                    </div>

                    <div className="absolute bottom-8 left-8 text-white font-bold font-en text-xl flex items-center gap-3">
                      Discover {item.name}
                    </div>
                  </motion.div>

                </div>

                {/* Separator Line */}
                {idx !== tropicalData.length - 1 && (
                  <div className="w-full max-w-3xl mx-auto h-px bg-slate-200 mt-32"></div>
                )}
              </div>
            );
          })}

        </div>
      </section>

      {/* 4. Grand CTA Section */}
      <section className="w-full bg-brand-teal py-24 relative z-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat z-0"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Palmtree className="w-16 h-16 text-brand-gold mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-bold text-white font-en tracking-tight uppercase mb-6">
              Partner With The Best.
            </h2>
            <p className="text-teal-100 text-lg md:text-xl font-medium leading-relaxed mb-10 font-en max-w-2xl mx-auto">
              Secure the ultimate tropical escapes for your elite clients. Connect with our corporate relations team today.
            </p>
            <Link href="/partner-portal" className="inline-block bg-brand-navy text-white px-10 py-5 rounded-full font-bold font-en text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 shadow-xl hover:shadow-2xl">
              Access B2B Portal
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}