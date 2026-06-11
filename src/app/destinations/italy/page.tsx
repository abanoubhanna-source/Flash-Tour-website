// src/app/destinations/italy/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Star, Compass, ArrowRight, ChevronRight, Wine, Sun } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";

// 1. فندق بورتفوليو الخاص بإيطاليا من الـ PDF
const italianHotels = [
  { name: "Hotel Baia D'Oro", location: "Sicily", img: "/images/hotel-baia-doro.jpg" },
  { name: "Hotel President Sea Palace", location: "Sicily", img: "/images/hotel-president.jpg" },
  { name: "Castelsardo Resort", location: "Sardinia", img: "/images/castelsardo-resort.jpg" },
  { name: "Hotel Dolcestate Club", location: "Sicily", img: "/images/hotel-dolcestate.jpg" },
  { name: "Le Dune Beach Club", location: "Sicily", img: "/images/le-dune.jpg" },
  { name: "Hotel Club Eloro", location: "Sicily", img: "/images/hotel-eloro.jpg" },
  { name: "Hopps Hotel", location: "Sicily", img: "/images/hopps-hotel.jpg" },
];

// 2. داتا صقلية
const sicilyData = {
  vibeTitle: "The Splendor of Sicily",
  desc: "Sicily, the beauty of Italy. It is one of the most renowned islands in Europe due to its greenery, its endless beaches and locally grown products; moreover, its history and lots of films and movies have been shot there. Sicily has astonishing landscapes, views and some UNESCO world heritage places. Whether you are visiting Ortigia Old town exploring a thousand year old church, or strolling around Marzamemi discovering the biggest tuna factories while tasting local products, you will witness landscapes that you have never seen, and beaches that are as clear as the sky.",
  mainImg: "/images/sicily-main.jpg",
  places: [
    { name: "Palermo", desc: "The city is well known for its downtown markets where local merchants sell their merchandise and pass on the profession to the next generation. The capital city, known for its narrow streets and traditional street markets.", img: "/images/palermo.jpg" },
    { name: "Olive Oil Farms", desc: "Sicilian olive oil is renowned as the best olive oil made in Italy, and the olive farms provide an amazing experience to explore the process of how this delicacy is produced. Experience Sicilian cuisine at its best and learn how this culinary liquid gold is produced.", img: "/images/olive-oil.jpg" },
    { name: "Ortigia", desc: "An old city built in the Baroque style, and well maintained by the locals. It is regarded as a UNESCO site as it is one of the few places that still features a full Baroque experience and a beautiful World Heritage site.", img: "/images/ortigia.jpg" }
  ]
};

// 3. داتا سردينيا
const sardiniaData = {
  vibeTitle: "The Emerald Coast of Sardinia",
  desc: "Sardinia, famous for its Turquoise waters, is the perfect destination to completely relax by the beach. It is the right place to just spend an unforgettable holiday swimming everyday in transparent waters, while enjoying their wine and excellent Italian delicacies such as the fresh sea food and home grown vegetables. Famous for its emerald waters, Sardinia is the perfect destination for an unforgettable luxury stay.",
  mainImg: "/images/sardinia-main.jpg",
  places: [
    { name: "Porto Cervo", desc: "A magnificent marina that hosts several yachts voyaging the Mediterranean. Financed and created by Prince Karim Aga Khan along with other investors, it is a destination for those who seek an extravagant holiday. A magnetic center hosting high-end boutiques and mega-yachts. The ultimate VIP destination.", img: "/images/porto-cervo.jpg" },
    { name: "Costa Smeralda", desc: "A stretch of land surrounded by turquoise water and sandy beaches. The main town of the area is very famous for its upscale hotels and luxury shopping sites. It is a must go destination for everyone visiting Sardinia, famous for its exclusive beaches.", img: "/images/costa-smeralda.jpg" },
    { name: "Cagliari", desc: "The capital city of the Island, and the place where most tourists seeking knowledge about history will stop first; moreover, the hilltop castello, a wall quarter built during the medieval era, is a top attraction for the city featuring rich medieval history.", img: "/images/cagliari.jpg" }
  ]
};

export default function ItalyDestinationPage() {
  const [activeTab, setActiveTab] = useState('hotels');

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
      
      {/* 1. Epic Hero Section (متطابق مع ستايل الإمارات الغامق والفخم) */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center bg-[#0F162A]">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/italy-hero.jpg" 
            alt="Classic Italy" 
            fill 
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F162A]/70 to-[#0F162A] z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#F1B820] font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-6 font-en flex items-center justify-center gap-2">
              <Star className="w-4 h-4 fill-[#F1B820]" /> DOLCE FAR NIENTE <Star className="w-4 h-4 fill-[#F1B820]" />
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white font-en mb-6 tracking-tight drop-shadow-2xl">
              Classic <span className="text-[#F1B820]">ITALY</span>
            </h1>
            <p className="text-xl text-slate-300 font-en leading-relaxed max-w-2xl mx-auto font-light drop-shadow-md">
              With a warm and friendly nature, a Dolce Vita lifestyle, and a passion for fine cuisine. Flash Group brings unparalleled hospitality to the Mediterranean.
            </p>
          </motion.div>
        </div>

        {/* Floating Pill Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="absolute -bottom-8 left-0 right-0 z-30 flex justify-center px-4"
        >
          <div className="bg-white p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 flex gap-2 overflow-x-auto max-w-full no-scrollbar">
            <button onClick={() => { setActiveTab('hotels'); scrollToSection('hotels-section'); }} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold font-en text-sm transition-colors whitespace-nowrap ${activeTab === 'hotels' ? 'bg-[#0F162A] text-white' : 'hover:bg-[#157670] hover:text-white text-[#0F162A]'}`}>
              <Building2 className="w-4 h-4" /> Hotel Portfolio
            </button>
            <button onClick={() => { setActiveTab('sicily'); scrollToSection('excursions-section'); }} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold font-en text-sm transition-colors whitespace-nowrap ${activeTab === 'sicily' ? 'bg-[#157670] text-white' : 'hover:bg-[#157670] hover:text-white text-[#0F162A]'}`}>
              <Wine className="w-4 h-4" /> Sicily
            </button>
            <button onClick={() => { setActiveTab('sardinia'); scrollToSection('excursions-section'); }} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold font-en text-sm transition-colors whitespace-nowrap ${activeTab === 'sardinia' ? 'bg-[#157670] text-white' : 'hover:bg-[#157670] hover:text-white text-[#0F162A]'}`}>
              <Sun className="w-4 h-4" /> Sardinia
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. Our Italian Hotel Portfolio (Clean White Background) */}
      <section id="hotels-section" className="w-full bg-white relative z-20 pt-32 pb-20 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-[#157670]" />
              <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">Our Italian Hotel Portfolio</h2>
            </div>
            <div className="w-24 h-1.5 bg-[#F1B820] mx-auto mt-6 rounded-full mb-6"></div>
            <p className="text-slate-600 font-en text-lg max-w-2xl mx-auto">
              Expanding our European footprint, Flash Group proudly operates an exclusive collection of 7 premium hotels and resorts across Italy's most breathtaking islands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {italianHotels.map((hotel, idx) => (
              <motion.div 
                key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="group relative h-80 rounded-[2rem] overflow-hidden shadow-md border border-slate-100 cursor-pointer"
              >
                <Image src={hotel.img} alt={hotel.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F162A]/90 via-[#0F162A]/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[#F1B820] font-bold text-xs uppercase tracking-widest flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3" /> {hotel.location}
                  </span>
                  <h3 className="text-xl font-bold font-en leading-snug">{hotel.name}</h3>
                </div>
              </motion.div>
            ))}
            
            {/* CTA Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }}
              className="group relative h-80 rounded-[2rem] overflow-hidden shadow-lg bg-[#157670] flex flex-col justify-center items-center text-center p-8 cursor-pointer border border-[#157670]/50 hover:bg-[#0d4a46] transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-[#F1B820]/20 flex items-center justify-center mb-4 border border-[#F1B820]/40">
                <Compass className="w-8 h-8 text-[#F1B820]" />
              </div>
              <h3 className="text-2xl font-bold text-white font-en mb-2">Book Your Stay</h3>
              <p className="text-[#F1B820] font-en text-sm font-medium mb-6">Contact our European desk</p>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </div>
          
          <div className="w-full h-px bg-slate-200 mt-24"></div>
        </div>
      </section>

      {/* 3. Mediterranean Excursions (White Background) */}
      <section id="excursions-section" className="w-full bg-white relative z-20 pb-32 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          
          {/* تم إصلاح المسافة هنا mb-20 لتجنب أي تداخل مع الصور */}
          <div className="text-center mb-20 pt-10">
            <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">Mediterranean Excursions</h2>
            <p className="text-slate-500 font-en mt-4 text-lg">Discovering the hidden gems of Sicily and Sardinia.</p>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'sicily' || activeTab === 'hotels' ? (
              <motion.div key="sicily-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative group">
                {/* Top Section: Text & Main Image */}
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-12">
                  <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-5/12 flex flex-col justify-center">
                    <div className="w-16 h-1.5 bg-[#F1B820] mb-6 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-6">
                      <Wine className="w-8 h-8 text-[#157670]" />
                      <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">SICILY</h2>
                    </div>
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">{sicilyData.desc}</p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-7/12 relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                    <Image src={sicilyData.mainImg} alt="Sicily" fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F162A]/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 text-white font-bold font-en text-2xl flex items-center gap-3">
                      <MapPin className="text-[#F1B820] w-6 h-6" /> Discover SICILY
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Section: Landmarks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {sicilyData.places.map((place, pIdx) => (
                    <motion.div key={pIdx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: pIdx * 0.1 }} className="group cursor-pointer">
                      <div className="relative h-64 w-full rounded-[2rem] overflow-hidden shadow-md mb-6 border border-slate-100">
                        <Image src={place.img} alt={place.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-[#0F162A]/10 group-hover:bg-[#0F162A]/40 transition-colors duration-500"></div>
                      </div>
                      <h4 className="text-2xl font-bold text-[#157670] font-en mb-3 flex items-center gap-2">
                        {place.name} <ChevronRight className="w-5 h-5 text-[#F1B820] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </h4>
                      <p className="text-slate-600 font-en text-sm leading-relaxed">{place.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {activeTab === 'sardinia' || activeTab === 'hotels' ? (
              <motion.div key="sardinia-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative group pt-16">
                {/* Top Section: Text & Main Image */}
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16 mb-12">
                  <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-5/12 flex flex-col justify-center">
                    <div className="w-16 h-1.5 bg-[#F1B820] mb-6 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-6">
                      <Sun className="w-8 h-8 text-[#157670]" />
                      <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">SARDINIA</h2>
                    </div>
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">{sardiniaData.desc}</p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-7/12 relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                    <Image src={sardiniaData.mainImg} alt="Sardinia" fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F162A]/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 text-white font-bold font-en text-2xl flex items-center gap-3">
                      <MapPin className="text-[#F1B820] w-6 h-6" /> Discover SARDINIA
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Section: Landmarks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {sardiniaData.places.map((place, pIdx) => (
                    <motion.div key={pIdx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: pIdx * 0.1 }} className="group cursor-pointer">
                      <div className="relative h-64 w-full rounded-[2rem] overflow-hidden shadow-md mb-6 border border-slate-100">
                        <Image src={place.img} alt={place.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-[#0F162A]/10 group-hover:bg-[#0F162A]/40 transition-colors duration-500"></div>
                      </div>
                      <h4 className="text-2xl font-bold text-[#157670] font-en mb-3 flex items-center gap-2">
                        {place.name} <ChevronRight className="w-5 h-5 text-[#F1B820] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </h4>
                      <p className="text-slate-600 font-en text-sm leading-relaxed">{place.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

        </div>
      </section>

      <Footer />
    </main>
  );
}