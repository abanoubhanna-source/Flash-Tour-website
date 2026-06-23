// src/app/services/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowUpRight, ShieldCheck, Globe2, PlaneTakeoff, Building2, 
  Map, Car, Palmtree, Users, Bus, MoonStar, Luggage, 
  Briefcase, FileCheck, Flag, Sparkles 
} from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";

// قاموس الأيقونات عشان نربط كل خدمة بالأيقونة بتاعتها أوتوماتيك
const iconMapping: { [key: string]: any } = {
  "Inbound & Outbound Tourism": Globe2,
  "Flight Reservations": PlaneTakeoff,
  "Hotel Reservations": Building2,
  "Tour Guiding Services": Map,
  "Transportation": Car,
  "Leisure: Individuals & Groups": Palmtree,
  "Premium FIT & Family Travel": Users,
  "Fully Escorted Group Tours": Bus,
  "Hajj and Umrah": MoonStar,
  "Airport Services": Luggage,
  "MICE Management": Briefcase,
  "Visa Services": FileCheck,
  "Golf": Flag,
};

// الداتا البديلة عشان الموقع يفضل شغال حتى لو الداش بورد فاضية
const fallbackServices = [
  { title: "Inbound & Outbound Tourism", desc: "With many years of experience in the industry, we have diversified our portfolio in hospitality..." },
  { title: "Flight Reservations", desc: "Our team will handle all ticketing procedures as we have partnered up with IATA..." },
  { title: "Hotel Reservations", desc: "We have contracted most of the hotels in the region across all categories, both in terms of luxury and range of facilities..." },
  { title: "Tour Guiding Services", desc: "We have a professional team that offers full guidance in several languages. All our team members are bilingual and certified." },
  { title: "Transportation", desc: "We offer a variety of Private VIP cars, limousines, coasters, shuttles, up to 50 seater buses." },
  { title: "Leisure: Individuals & Groups", desc: "We provide high quality tailor-made solutions for niche-markets and customized services for mass-markets." },
  { title: "Premium FIT & Family Travel", desc: "Our experts are happy to handcraft packages for your FIT clients as well as families." },
  { title: "Fully Escorted Group Tours", desc: "For those who love to travel with company, we offer an exceptional solution with our Small Group Tours." },
  { title: "Hajj and Umrah", desc: "For our Egyptian clients we plan and handle Hajj and Umrah services for those seeking to perform their holy pilgrimages." },
  { title: "Airport Services", desc: "As we provide outstanding products and services that, together, deliver a premium value to our clients..." },
  { title: "MICE Management", desc: "In the UAE we manage large-scale business trips and corporate travels as a different ball game altogether." },
  { title: "Visa Services", desc: "Entry visa to the UAE is one of our services offered at very attractive rates to our valued clients." },
  { title: "Golf", desc: "Since The UAE is a very popular destination for golf enthusiasts, our Flash Horizon Golf team has limitless experience." }
];

export default function ServicesPage() {
  const [servicesData, setServicesData] = useState<any[]>(fallbackServices);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setServicesData(data);
        }
      })
      .catch(err => console.log("Using static fallback for services."));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-slate-50 overflow-hidden">
      
      {/* 1. Elegant Hero Section */}
      <section className="relative w-full py-40 flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#157670 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-slate-50 z-10"></div>
        
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto w-full mt-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F1B820]/30 bg-[#F1B820]/10 text-[#F1B820] font-bold text-xs uppercase tracking-[0.2em] mb-6 font-en">
              <ShieldCheck className="w-4 h-4" /> Global Portfolio
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white font-en mb-6 tracking-tight uppercase drop-shadow-lg">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#157670] to-[#F1B820]">Expertise.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-en leading-relaxed max-w-3xl mx-auto font-light drop-shadow-md">
              From exclusive leisure travel to flawless corporate event management, Flash Group delivers uncompromised quality across every touchpoint of your journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Services Interactive Grid (Icons based) */}
      <section className="w-full pb-32 pt-10 relative z-20 -mt-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service: any, index: number) => {
              // بنختار الأيقونة من القاموس، ولو الخدمة جديدة من الداش بورد بنديلها أيقونة نجوم افتراضية
              const IconComponent = iconMapping[service.title] || Sparkles;

              return (
                <motion.div 
                  key={service.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(21,118,112,0.08)] hover:-translate-y-2 transition-all duration-300 group flex flex-col relative overflow-hidden"
                >
                  {/* Subtle hover background accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#157670]/5 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150"></div>

                  {/* Icon Header */}
                  <div className="flex items-center gap-5 mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-[#157670]/30 group-hover:bg-[#157670]/5 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-[#157670] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 font-en leading-tight flex-1 group-hover:text-[#157670] transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-slate-500 font-en text-sm leading-relaxed mb-6 flex-grow relative z-10">
                    {service.desc}
                  </p>
                  
                  {/* Visual Anchor */}
                  <div className="w-full h-1 bg-slate-100 rounded-full mt-auto overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#157670] to-[#F1B820] w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="w-full py-24 bg-[#157670] relative overflow-hidden z-20">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 text-white">
          <h2 className="text-4xl md:text-5xl font-black font-en mb-6 tracking-tight">
            Ready to Partner With Us?
          </h2>
          <p className="text-teal-100 font-en text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Get direct access to our comprehensive hospitality and operational capabilities across the Middle East, Europe, and Africa.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-[#F1B820] text-[#020617] rounded-full font-black font-en uppercase tracking-widest hover:bg-white transition-all shadow-xl hover:shadow-2xl group hover:-translate-y-1">
            Contact Corporate Relations <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}