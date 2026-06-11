// src/app/destinations/zanzibar/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Car, Star, MapPin, ChevronRight, Compass, Trees, Sun, Home, Coffee, Waves } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";

// 1. بيانات المنتجع بالتفصيل زي ما كتبتها في الكود بتاعك
const kiwengwaResort = {
  name: "Kiwengwa Beach Resort",
  type: "5-Star Luxury Resort",
  location: "Kiwengwa Beach District (50 KM from Airport)",
  desc: "A 5-star resort for those who seek luxury amidst natural beauty. Situated to offer convenience as well as a retreat for you to unwind in a tropical green scenery full of coconut trees.",
  img: "/images/zanzibar-main.jpg", 
  features: [
    { text: "223 Modern African Style Units", icon: Home },
    { text: "4 Premium Restaurants & 3 Bars", icon: Coffee },
    { text: "3 Swimming Pools & A Lagoon", icon: Waves },
    { text: "Fully Equipped Recreation Center", icon: Sun },
  ]
};

// 2. داتا زنجبار والسفاري المدمجة
const destinationsData = [
  {
    id: "zanzibar",
    name: "ZANZIBAR",
    icon: Sun,
    desc: "In Zanzibar, our own resort Kiwengwa Beach has more than 200 rooms. It is directly located on the beach and offers a wide range of activities. The island itself has the most famous beaches in Africa, where we will organize your private boat Safaris to sand banks located in the middle of the ocean. A visit to the forest with a guide taking you on a spice tour, and a day of relaxation sipping on coconut by the beach.",
    mainImg: "/images/zanzibar-island.jpg",
    places: [
      { name: "National Park", desc: "A vast lagoon blessed with a spectacular landscape of striped sand. The mangrove trees surround the lagoon adding to its natural beauty.", img: "/images/zanzibar-national-park.jpg" },
      { name: "Stone Town", desc: "The ancient capital city, where travelers enter the daily life of locals. A visit is never complete without seeing Freddie Mercury’s home museum.", img: "/images/stone-town.jpg" },
      { name: "Jozani Forest", desc: "Home to the Red Colobus: a rare species of monkey regarded as the national symbol of Zanzibar. Perfect for those who seek adventure.", img: "/images/jozani.jpg" }
    ]
  },
  {
    id: "safari",
    name: "SAFARI",
    icon: Trees,
    desc: "Africa, the land of the wildlife. The most famous Safari’s in the world are in the biggest Savannas located in Africa. Luckily, we are here to make your experience unforgettable. Yes, you read it right. We organize Safari excursions with a private car, and accommodation. You can stay in the Savannah for a couple of days or you can enjoy the best of both worlds, because we have now launched an overday Safari from Zanzibar Island to Mikumi or Selous.",
    mainImg: "/images/safari-main.jpg",
    places: [
      { name: "Selous Reserve", desc: "Africa’s largest protected reserve and home to the largest concentration of elephants in the world. Announced as a world heritage site by UNESCO.", img: "/images/selous.jpg" },
      { name: "Ngorongoro Conservation", desc: "A safe haven for globally threatened species to thrive in their natural habitat free of poachers. Also serves as settlements for semi-nomadic Massai tribes.", img: "/images/ngorongoro.jpg" },
      { name: "Mikumi Park", desc: "A wild park featuring a variety of wild animals and home to the tree-climbing lions. A resting spot for several migratory wildlife.", img: "/images/mikumi.jpg" }
    ]
  }
];

export default function ZanzibarDestinationPage() {
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
      
      {/* 1. Epic Hero Section (Dark Luxury) */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center bg-[#0F162A]">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/zanzibar-hero.jpg" 
            alt="Exotic Zanzibar & Safari" 
            fill 
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F162A]/70 to-[#0F162A] z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#F1B820] font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-6 font-en flex items-center justify-center gap-2">
              <Star className="w-4 h-4 fill-[#F1B820]" /> EXOTIC ESCAPES & WILDLIFE <Star className="w-4 h-4 fill-[#F1B820]" />
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white font-en mb-6 tracking-tight drop-shadow-2xl">
              Exotic <span className="text-[#F1B820]">ZANZIBAR</span>
            </h1>
            <p className="text-xl text-slate-300 font-en leading-relaxed max-w-2xl mx-auto font-light drop-shadow-md">
              Africa, the land of the wildlife. Enjoy the best of both worlds with pristine beaches and unforgettable Savanna Safaris.
            </p>
          </motion.div>
        </div>

        {/* Floating Pill Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="absolute -bottom-8 left-0 right-0 z-30 flex justify-center px-4"
        >
          <div className="bg-white p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 flex gap-2 overflow-x-auto max-w-full no-scrollbar">
            <button onClick={() => scrollToSection('resort')} className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-[#157670] hover:text-white text-[#0F162A] font-bold font-en text-sm transition-colors whitespace-nowrap">
              <Home className="w-4 h-4" /> The Resort
            </button>
            <button onClick={() => scrollToSection('zanzibar')} className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-[#157670] hover:text-white text-[#0F162A] font-bold font-en text-sm transition-colors whitespace-nowrap">
              <Sun className="w-4 h-4" /> Zanzibar
            </button>
            <button onClick={() => scrollToSection('safari')} className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-[#157670] hover:text-white text-[#0F162A] font-bold font-en text-sm transition-colors whitespace-nowrap">
              <Trees className="w-4 h-4" /> Safari
            </button>
            <button onClick={() => scrollToSection('transportation')} className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-[#157670] hover:text-white text-[#0F162A] font-bold font-en text-sm transition-colors whitespace-nowrap">
              <Car className="w-4 h-4" /> Transportation
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. Kiwengwa Beach Resort Showcase (Added back powerfully) */}
      <section id="resort" className="w-full bg-white relative z-20 pt-32 pb-16 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Resort Image */}
            <motion.div 
              className="lg:w-1/2 w-full relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group"
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <Image src={kiwengwaResort.img} alt={kiwengwaResort.name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
              <div className="absolute inset-0 bg-[#0F162A]/10 hover:bg-transparent transition-colors duration-500"></div>
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100">
                <p className="font-bold text-[#157670] font-en text-lg">Flash Hospitality</p>
                <p className="text-sm text-slate-500 font-en">Exclusive Property</p>
              </div>
            </motion.div>

            {/* Resort Details */}
            <motion.div 
              className="lg:w-1/2 space-y-8"
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#157670]/10 flex items-center justify-center border border-[#157670]/20">
                    <Sun className="w-6 h-6 text-[#157670]" />
                  </div>
                  <span className="text-[#157670] font-bold uppercase tracking-widest text-sm font-en">{kiwengwaResort.type}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en leading-tight mb-4 tracking-tight">
                  {kiwengwaResort.name}
                </h2>
                <p className="text-lg text-slate-600 font-en leading-relaxed">
                  {kiwengwaResort.desc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                {kiwengwaResort.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 bg-[#157670]/10 p-2 rounded-lg border border-[#157670]/20">
                      <feature.icon className="w-5 h-5 text-[#157670]" />
                    </div>
                    <span className="text-slate-700 font-en font-medium leading-snug">{feature.text}</span>
                  </div>
                ))}
              </div>

              <button className="mt-4 bg-[#0F162A] text-white px-8 py-4 rounded-full font-bold font-en hover:bg-[#157670] transition-colors shadow-xl flex items-center gap-2 group">
                Discover Resort <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="w-full max-w-[1000px] mx-auto h-px bg-slate-200"></div>

      {/* 3. Zanzibar & Safari Excursions (Editorial Layout) */}
      <section className="w-full bg-white relative z-20 pt-24 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">African Excursions</h2>
            <p className="text-slate-500 font-en mt-4 text-lg">Discovering the hidden gems of Zanzibar and the wild Savannas.</p>
          </div>

          {destinationsData.map((region, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={region.id} id={region.id} className="relative scroll-mt-32 group">
                
                {/* Top Section: Text & Main Image */}
                <div className={`flex flex-col lg:flex-row items-center gap-16 mb-12 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Text */}
                  <motion.div initial={{ opacity: 0, x: isEven ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-5/12 flex flex-col justify-center">
                    <div className="w-16 h-1.5 bg-[#F1B820] mb-6 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-6">
                      <region.icon className="w-8 h-8 text-[#157670]" />
                      <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">{region.name}</h2>
                    </div>
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">{region.desc}</p>
                  </motion.div>

                  {/* Main Large Image */}
                  <motion.div initial={{ opacity: 0, x: isEven ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-7/12 relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                    <Image src={region.mainImg} alt={region.name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F162A]/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 text-white font-bold font-en text-2xl flex items-center gap-3">
                      <MapPin className="text-[#F1B820] w-6 h-6" /> Discover {region.name}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Section: Landmarks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {region.places.map((place, pIdx) => (
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
              </div>
            );
          })}

        </div>
      </section>

      {/* 4. Transportation Section (Teal Background #157670) */}
      <section id="transportation" className="w-full bg-[#157670] py-24 relative z-20 overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat z-0"></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-[#F1B820] font-en tracking-wider drop-shadow-md">
              Transportation
            </h2>
            <div className="w-24 h-1.5 bg-white/20 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Text Side */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-5/12 text-white space-y-6">
              <p className="font-en leading-relaxed text-lg text-white/90">
                There is a lot to explore in Zanzibar, and one destination is not enough to explore the island. 
              </p>
              <div className="bg-[#0F162A]/40 p-8 rounded-3xl border-l-4 border-[#F1B820] shadow-xl">
                <p className="font-en text-base leading-relaxed text-slate-200">
                  We provide our clients with transportation that serve both large groups commuting together and adventurous individuals looking to explore the forest.
                </p>
              </div>
            </motion.div>

            {/* Cinematic Fleet Gallery */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-7/12 grid grid-cols-2 gap-4">
              <div className="relative h-48 md:h-64 w-full rounded-2xl overflow-hidden shadow-lg"><Image src="/images/zanzibar-transport-1.jpg" alt="Fleet 1" fill className="object-cover" /></div>
              <div className="relative h-48 md:h-64 w-full rounded-2xl overflow-hidden shadow-lg"><Image src="/images/zanzibar-transport-2.jpg" alt="Fleet 2" fill className="object-cover" /></div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}