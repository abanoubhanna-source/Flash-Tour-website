// src/app/destinations/morocco/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, ChevronRight, Compass, Mountain, Sun, Building2 } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";

// الداتا الموحدة للمغرب (بأسلوب B2B فخم)
const moroccoData = [
  {
    id: "marrakech",
    name: "MARRAKECH",
    icon: Building2,
    desc: "Known as the 'Red City', Marrakech is a sensory masterpiece where ancient traditions meet modern luxury. From the bustling souks and the historic Medina to our exclusive, meticulously restored luxury Riads, we offer your elite clients an authentic yet highly sophisticated Moroccan experience.",
    mainImg: "/images/marrakech-main.jpg",
    places: [
      { name: "Luxury Riads", desc: "Experience ultimate privacy and authentic Moroccan hospitality in our curated selection of high-end Riads located in the heart of the Medina.", img: "/images/luxury-riad.jpg" },
      { name: "Jemaa el-Fnaa", desc: "The vibrant heartbeat of the city. A UNESCO Masterpiece of the Oral and Intangible Heritage of Humanity, offering an unforgettable cultural immersion.", img: "/images/jemaa-elfna.jpg" },
      { name: "Bahia Palace", desc: "A 19th-century palace reflecting the true essence of Islamic and Moroccan architectural brilliance, surrounded by lush, tranquil gardens.", img: "/images/bahia-palace.jpg" }
    ]
  },
  {
    id: "atlas-mountains",
    name: "ATLAS MOUNTAINS",
    icon: Mountain,
    desc: "Just a short drive from the vibrant cities lies the serene majesty of the Atlas Mountains. Perfect for exclusive corporate retreats and VIP leisure, offering breathtaking valleys, authentic Berber villages, and luxury eco-lodges that blend seamlessly with nature.",
    mainImg: "/images/atlas-main.jpg",
    places: [
      { name: "Luxury Eco-Lodges", desc: "Unwind in high-end mountain retreats offering panoramic views, premium spa services, and absolute tranquility away from the city.", img: "/images/atlas-lodge.jpg" },
      { name: "Ourika Valley", desc: "A stunning valley offering exclusive guided excursions, pristine waterfalls, and a chance to experience the authentic lifestyle of the Berber people.", img: "/images/ourika.jpg" },
      { name: "Mount Toubkal", desc: "The highest peak in North Africa. We organize bespoke, fully-serviced hiking and climbing expeditions for the adventurous elite.", img: "/images/toubkal.jpg" }
    ]
  },
  {
    id: "sahara",
    name: "THE SAHARA DESERT",
    icon: Compass,
    desc: "A journey into the endless golden dunes. We redefine desert exploration by providing ultra-luxury glamping experiences. Imagine dining under a canopy of stars with world-class service, private nomadic tents, and VIP mobility across the majestic Sahara.",
    mainImg: "/images/sahara-main.jpg",
    places: [
      { name: "Luxury Glamping", desc: "Bespoke desert camps featuring king-size beds, en-suite facilities, and gourmet dining, ensuring 5-star comfort in the heart of the dunes.", img: "/images/luxury-camp.jpg" },
      { name: "Merzouga Dunes", desc: "Famous for the towering Erg Chebbi dunes. Experience private sunset camel treks and exclusive 4x4 dune bashing adventures.", img: "/images/merzouga.jpg" },
      { name: "Ait Benhaddou", desc: "A historic fortified village (Ksar) and UNESCO World Heritage site, famous as a backdrop for numerous Hollywood masterpieces.", img: "/images/ait-benhaddou.jpg" }
    ]
  }
];

export default function MoroccoDestinationPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white overflow-hidden">
      
      {/* 1. Epic Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center bg-brand-navy">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/morocco-hero.jpg" 
            alt="Enchanting Morocco" 
            fill 
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-navy/70 to-white z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-brand-gold font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-6 font-en flex items-center justify-center gap-2">
              <Star className="w-4 h-4 fill-brand-gold" /> THE GATEWAY TO AFRICA <Star className="w-4 h-4 fill-brand-gold" />
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-en mb-6 tracking-tight drop-shadow-2xl uppercase">
              Enchanting <br/> <span className="text-brand-gold">Morocco</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-navy font-en leading-relaxed max-w-2xl mx-auto font-bold bg-white/60 backdrop-blur-md py-3 px-8 rounded-full shadow-lg">
              Immerse yourself in vibrant colors, rich traditions, and unparalleled North African luxury.
            </p>
          </motion.div>
        </div>

        {/* Floating Pill Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="absolute -bottom-6 left-0 right-0 z-30 flex justify-center px-4 w-full max-w-[1200px] mx-auto"
        >
          <div className="bg-white p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex gap-2 overflow-x-auto max-w-full no-scrollbar">
            {moroccoData.map((region, idx) => (
              <button 
                key={idx} onClick={() => scrollToSection(region.id)}
                className="flex items-center gap-2 px-8 py-4 rounded-full hover:bg-brand-teal hover:text-white text-brand-navy font-bold font-en text-sm tracking-wide uppercase transition-colors whitespace-nowrap"
              >
                <region.icon className="w-5 h-5" strokeWidth={2} /> {region.name}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 2. Main Content - Editorial White Background Layout */}
      <section className="w-full bg-white relative z-20 pt-32 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          
          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold text-brand-navy font-en tracking-tight uppercase">Explore Destinations</h2>
            <div className="w-24 h-1.5 bg-brand-gold mx-auto mt-6 rounded-full"></div>
          </div>

          {moroccoData.map((region, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={region.id} id={region.id} className="relative scroll-mt-32 group">
                
                {/* Top Section: Text & Main Image */}
                <div className={`flex flex-col lg:flex-row items-center gap-16 mb-12 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Text */}
                  <motion.div initial={{ opacity: 0, x: isEven ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-5/12 flex flex-col justify-center">
                    <div className="w-16 h-1.5 bg-brand-gold mb-6 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-6">
                      <region.icon className="w-8 h-8 text-brand-teal" />
                      <h2 className="text-4xl md:text-5xl font-bold text-brand-navy font-en tracking-tight uppercase">{region.name}</h2>
                    </div>
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">{region.desc}</p>
                  </motion.div>

                  {/* Main Large Image */}
                  <motion.div initial={{ opacity: 0, x: isEven ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-7/12 relative h-[400px] rounded-[1.5rem] overflow-hidden shadow-2xl group">
                    <Image src={region.mainImg} alt={region.name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 text-white font-bold font-en text-2xl flex items-center gap-3">
                      <MapPin className="text-brand-gold w-6 h-6" /> Explore {region.name}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Section: Landmarks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {region.places.map((place, pIdx) => (
                    <motion.div key={pIdx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: pIdx * 0.1 }} className="group cursor-pointer">
                      <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-md mb-6 border border-slate-100">
                        <Image src={place.img} alt={place.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/30 transition-colors duration-500"></div>
                      </div>
                      <h4 className="text-2xl font-bold text-brand-teal font-en mb-3 flex items-center gap-2">
                        {place.name} <ChevronRight className="w-5 h-5 text-brand-gold opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </h4>
                      <p className="text-slate-600 font-en text-sm leading-relaxed">{place.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Separator Line */}
                {idx !== moroccoData.length - 1 && (
                  <div className="w-full max-w-3xl mx-auto h-px bg-slate-200 mt-32"></div>
                )}
              </div>
            );
          })}

        </div>
      </section>

      <Footer />
    </main>
  );
}