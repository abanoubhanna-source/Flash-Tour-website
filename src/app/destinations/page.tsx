// src/app/destinations/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, Sun, Building, ArrowRight, Globe2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";
import { RichText } from "@/components/content/rich-text";
import { usePublishedPage } from "@/lib/cms/pages/use-published-page";
type PublicDestination={id:string;slug:string;name:string;subtitle:string;description:string;highlights:string[];image:string;icon:string};

// قاموس الأيقونات
const iconMap: Record<string, React.ComponentType<{className?:string}>> = {
  Compass: Compass,
  Building: Building,
  Sun: Sun,
  MapPin: MapPin,
};

// الداتا الأساسية
const fallbackDestinations = [
  {
    id: "egypt",
    slug: "egypt",
    name: "Egypt",
    subtitle: "The Crown Jewel of History",
    description: "Experience more than 7,000 years of living history. From the timeless majesty of the Pyramids to the pristine shores of the Red Sea and the historic waters of the Nile, our Egyptian operations are the beating heart of Flash Group.",
    highlights: ["Serenity Nile Cruises", "True Beach Resort - Marsa Alam", "1920s Boutique Hotel - Cairo", "Tulipe Kitesurfing Hub"],
    image: "/images/egypt-bg.jpg",
    icon: "Compass"
  },
  {
    id: "uae",
    slug: "uae",
    name: "United Arab Emirates",
    subtitle: "Where Luxury Knows No Bounds",
    description: "Our UAE division caters to the most discerning travelers. We seamlessly blend ultra-modern luxury with authentic Arabian hospitality, offering exclusive access to VIP services, premium mobility, and bespoke experiences in Dubai and beyond.",
    highlights: ["VIP Chauffeur Services", "Luxury Desert Safaris", "Exclusive Hotel Partnerships", "Corporate Retreats"],
    image: "/images/uae-bg.jpg",
    icon: "Building"
  },
  {
    id: "zanzibar",
    slug: "zanzibar",
    name: "Zanzibar",
    subtitle: "The Pearl of the Indian Ocean",
    description: "Escape to a tropical paradise where white sandy beaches meet rich cultural heritage. Our Zanzibar operations deliver untouched nature paired with Flash Group’s signature 5-star standard of comfort and safety.",
    highlights: ["Premium Beachfront Resorts", "Spice Tour Experiences", "Diving & Water Sports", "Private Yacht Charters"],
    image: "/images/zanzibar-bg.jpg",
    icon: "Sun"
  },
  {
    id: "italy",
    slug: "italy",
    name: "Italy",
    subtitle: "The Essence of Sophistication",
    description: "Catering to the sophisticated European market, we bring our legacy of luxury to the Mediterranean. From the sweet life of Sicily to the glamour of San Remo and Sardinia, we operate 7 exclusive premium properties.",
    highlights: ["7 Premium Italian Hotels", "Sicily & Sardinia Excursions", "Olive Oil Farm Tours", "Bespoke Mediterranean Hospitality"],
    image: "/images/italy-bg.jpg",
    icon: "MapPin"
  },
  {
    id: "morocco",
    slug: "morocco",
    name: "Morocco",
    subtitle: "The Gateway to Africa",
    description: "Immerse yourself in the vibrant colors and rich traditions of Morocco. From the bustling souks of Marrakech to the serene Atlas Mountains, our operations deliver an authentic and luxurious North African experience.",
    highlights: ["Luxury Riads in Marrakech", "Atlas Mountains Excursions", "Sahara Desert Glamping", "Premium Airport Transfers"],
    // Temporary placeholder photo (Wikimedia Commons, CC-licensed) — replace via the dashboard once real photography is supplied. See public/images/destinations/morocco/CREDITS.md
    image: "/images/destinations/morocco/hero-koutoubia-mosque.jpg",
    icon: "Compass"
  }
];

export default function DestinationsPage() {
  const cms = usePublishedPage('/destinations');
  const [destinations, setDestinations] = useState<PublicDestination[]>(fallbackDestinations);

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => {
        if(data && Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full bg-slate-50 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/map.png"
            alt="Global Destinations"
            fill
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold font-bold text-xs uppercase tracking-[0.2em] mb-6 font-en">
              <span className="h-px w-4 bg-brand-gold" /> {cms?.hero?.eyebrow || "Global Reach"}
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-en mb-6 tracking-tight leading-none">
              {cms?.hero?.title || "Explore Our"} <br/><span className="text-brand-gold">{cms?.hero?.accentTitle || "World"}</span>
            </h1>
            <p className="text-xl text-slate-300 font-en leading-relaxed max-w-2xl mx-auto">
              {cms?.hero?.subtitle || "Five distinct regions. Infinite possibilities. Discover the destinations where Flash Group brings luxury to life."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Alternating Destinations Sections */}
      <section className="w-full">
        {destinations.map((dest, index) => {
          const isEven = index % 2 === 0;
          const IconComponent = iconMap[dest.icon] || Globe2; 

          return (
            <div key={dest.name} className="relative w-full min-h-[80vh] flex items-center overflow-hidden border-b border-slate-100 group">
              
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 transform group-hover:scale-105 transition-transform duration-[2s] ease-out">
                  {dest.image ? (
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    // TODO: no photograph asset exists for this destination yet — replace with a real photo once available.
                    <div className="absolute inset-0 bg-brand-navy-deep" />
                  )}
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${isEven ? 'from-brand-navy-deep/95 via-brand-navy-deep/80 to-transparent' : 'from-transparent via-brand-navy-deep/80 to-brand-navy-deep/95'}`}></div>
              </div>

              <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 w-full flex">
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`w-full lg:w-1/2 p-8 md:p-12 bg-brand-navy-deep/40 backdrop-blur-sm border border-white/10 rounded-[1.5rem] shadow-2xl hover:shadow-brand-teal/10 hover:border-brand-teal/30 transition-all duration-500 ${isEven ? 'mr-auto' : 'ml-auto'}`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-brand-teal/20 flex items-center justify-center border border-brand-teal/30 group-hover:bg-brand-teal/40 transition-colors">
                      <IconComponent className="w-6 h-6 text-brand-gold" />
                    </div>
                    <span className="text-brand-gold font-bold uppercase tracking-widest text-sm font-en">Destination Portfolio</span>
                  </div>

                  <h2 className="text-5xl font-bold text-white font-en mb-2 tracking-tight group-hover:text-slate-100 transition-colors">{dest.name}</h2>
                  <h3 className="text-xl text-brand-teal font-en mb-6 font-semibold">{dest.subtitle}</h3>
                  
                  <RichText value={dest.description} className="space-y-2 text-lg text-slate-300 font-en leading-relaxed mb-8" />

                  <div className="space-y-3 mb-10">
                    <p className="text-white font-bold font-en uppercase tracking-wider text-sm mb-4 border-b border-white/10 pb-2">Flash Infrastructure Highlights</p>
                    
                    {dest.highlights && dest.highlights.map((highlight: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(241,184,32,0.6)]"></div>
                        <span className="text-slate-200 font-en font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href={`/destinations/${dest.slug}`}
                    className="w-fit group/btn flex items-center gap-3 text-white font-bold font-en hover:text-brand-gold transition-colors duration-300"
                  >
                    Discover {dest.name}
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-brand-gold group-hover/btn:text-brand-navy-deep transition-all">
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
      <section className="w-full py-24 bg-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern.png')] bg-repeat"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-slate-900 font-en mb-6">Partner With Us Globally</h2>
          <p className="text-lg text-slate-500 font-en mb-10 leading-relaxed">
            Connect with our localized regional offices to secure exclusive B2B partnerships and seamless global destination management.
          </p>
          <Link href="/contact" className="inline-block bg-brand-teal text-white px-10 py-5 rounded-full font-bold font-en text-lg hover:bg-brand-navy-deep transition-all duration-300 shadow-xl shadow-brand-teal/20 hover:-translate-y-1">
            Contact Our Corporate Relations
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
