// src/app/destinations/italy/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, ChevronRight, Wine, Sun } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";

// الداتا الموحدة لإيطاليا
const italyData = [
  {
    id: "sicily",
    name: "SICILY",
    desc: "Sicily, the beauty of Italy. It is one of the most renowned islands in Europe due to its greenery, its endless beaches and locally grown products; moreover, its history and lots of films and movies have been shot there. Sicily has astonishing landscapes, views and some UNESCO world heritage places. Whether you are visiting Ortigia Old town exploring a thousand year old church, or strolling around Marzamemi discovering the biggest tuna factories while tasting local products, you will witness landscapes that you have never seen, and beaches that are as clear as the sky.",
    mainImg: "/images/sicily-main.jpg",
    icon: Wine,
    places: [
      { name: "Palermo", desc: "The city is well known for its downtown markets where local merchants sell their merchandise and pass on the profession to the next generation. The capital city, known for its narrow streets and traditional street markets.", img: "/images/palermo.jpg" },
      { name: "Olive Oil Farms", desc: "Sicilian olive oil is renowned as the best olive oil made in Italy, and the olive farms provide an amazing experience to explore the process of how this delicacy is produced. Experience Sicilian cuisine at its best.", img: "/images/olive-oil.jpg" },
      { name: "Ortigia", desc: "An old city built in the Baroque style, and well maintained by the locals. It is regarded as a UNESCO site as it is one of the few places that still features a full Baroque experience and a beautiful World Heritage site.", img: "/images/ortigia.jpg" }
    ]
  },
  {
    id: "sardinia",
    name: "SARDINIA",
    desc: "Sardinia, famous for its Turquoise waters, is the perfect destination to completely relax by the beach. It is the right place to just spend an unforgettable holiday swimming everyday in transparent waters, while enjoying their wine and excellent Italian delicacies such as the fresh sea food and home grown vegetables. Famous for its emerald waters, Sardinia is the perfect destination for an unforgettable luxury stay.",
    mainImg: "/images/sardinia-main.jpg",
    icon: Sun,
    places: [
      { name: "Porto Cervo", desc: "A magnificent marina that hosts several yachts voyaging the Mediterranean. Financed and created by Prince Karim Aga Khan along with other investors, it is a destination for those who seek an extravagant holiday.", img: "/images/porto-cervo.jpg" },
      { name: "Costa Smeralda", desc: "A stretch of land surrounded by turquoise water and sandy beaches. The main town of the area is very famous for its upscale hotels and luxury shopping sites. It is a must go destination for everyone visiting Sardinia.", img: "/images/costa-smeralda.jpg" },
      { name: "Cagliari", desc: "The capital city of the Island, and the place where most tourists seeking knowledge about history will stop first; moreover, the hilltop castello, a wall quarter built during the medieval era, is a top attraction.", img: "/images/cagliari.jpg" }
    ]
  }
];

export default function ItalyDestinationPage() {
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
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center bg-[#0F162A]">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/italy-hero.jpg" 
            alt="Classic Italy" 
            fill 
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F162A]/70 to-white z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#F1B820] font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-6 font-en flex items-center justify-center gap-2">
              <Star className="w-4 h-4 fill-[#F1B820]" /> DOLCE FAR NIENTE <Star className="w-4 h-4 fill-[#F1B820]" />
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white font-en mb-6 tracking-tight drop-shadow-2xl">
              Classic <span className="text-[#F1B820]">ITALY</span>
            </h1>
            <p className="text-lg md:text-xl text-[#0F162A] font-en leading-relaxed max-w-2xl mx-auto font-bold bg-white/60 backdrop-blur-md py-3 px-8 rounded-full shadow-lg">
              With a warm and friendly nature, a Dolce Vita lifestyle, and a passion for fine cuisine. Unparalleled Mediterranean luxury.
            </p>
          </motion.div>
        </div>

        {/* Floating Pill Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="absolute -bottom-6 left-0 right-0 z-30 flex justify-center px-4 w-full max-w-[1200px] mx-auto"
        >
          <div className="bg-white p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex gap-2 overflow-x-auto max-w-full no-scrollbar">
            {italyData.map((city, idx) => (
              <button 
                key={idx} onClick={() => scrollToSection(city.id)}
                className="flex items-center gap-2 px-8 py-4 rounded-full hover:bg-[#157670] hover:text-white text-[#0F162A] font-black font-en text-sm tracking-wide uppercase transition-colors whitespace-nowrap"
              >
                <city.icon className="w-5 h-5" strokeWidth={2} /> {city.name}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 2. Main Content - Editorial White Background Layout */}
      <section className="w-full bg-white relative z-20 pt-32 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          
          <div className="text-center mb-10">
            <h2 className="text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">Explore Destinations</h2>
            <div className="w-24 h-1.5 bg-[#F1B820] mx-auto mt-6 rounded-full"></div>
          </div>

          {italyData.map((city, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={city.id} id={city.id} className="relative scroll-mt-32 group">
                
                {/* Top Section: Text & Main Image */}
                <div className={`flex flex-col lg:flex-row items-center gap-16 mb-12 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Text */}
                  <motion.div initial={{ opacity: 0, x: isEven ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-5/12 flex flex-col justify-center">
                    <div className="w-16 h-1.5 bg-[#F1B820] mb-6 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-6">
                      <city.icon className="w-8 h-8 text-[#157670]" />
                      <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">{city.name}</h2>
                    </div>
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">{city.desc}</p>
                  </motion.div>

                  {/* Main Large Image */}
                  <motion.div initial={{ opacity: 0, x: isEven ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-7/12 relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                    <Image src={city.mainImg} alt={city.name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F162A]/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 text-white font-bold font-en text-2xl flex items-center gap-3">
                      <MapPin className="text-[#F1B820] w-6 h-6" /> Explore {city.name}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Section: Landmarks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {city.places.map((place, pIdx) => (
                    <motion.div key={pIdx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: pIdx * 0.1 }} className="group cursor-pointer">
                      <div className="relative h-64 w-full rounded-[2rem] overflow-hidden shadow-md mb-6 border border-slate-100">
                        <Image src={place.img} alt={place.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-[#0F162A]/10 group-hover:bg-[#0F162A]/30 transition-colors duration-500"></div>
                      </div>
                      <h4 className="text-2xl font-bold text-[#157670] font-en mb-3 flex items-center gap-2">
                        {place.name} <ChevronRight className="w-5 h-5 text-[#F1B820] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </h4>
                      <p className="text-slate-600 font-en text-sm leading-relaxed">{place.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Separator Line */}
                {idx !== italyData.length - 1 && (
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