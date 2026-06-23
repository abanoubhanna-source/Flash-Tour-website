// src/app/destinations/uae/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, ChevronRight, Building2, Landmark, Mountain, Waves, Library } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";

// الداتا الأصلية للإمارات
const uaeData = [
  {
    id: "dubai",
    name: "DUBAI",
    desc: "Dubai is the most populated city in the UAE, and gained a solid reputation for its ultramodern lifestyle. Our clients would expect no less than a luxurious lifestyle to surround them everywhere they go.",
    mainImg: "/images/dubai-main.jpg",
    icon: Building2,
    places: [
      { name: "Burj Khalifa", desc: "The tallest skyscraper where you can enjoy the spectacular view of Dubai's skyline from the observatory, and delight yourself with upscale dining.", img: "/images/burj-khalifa.jpg" },
      { name: "Palm Jumeirah", desc: "The famous palm in the middle of the sea hosts top notch hotels and resorts. It is dedicated to convey the upscale luxury that the UAE aspires to introduce to the world.", img: "/images/palm-jumeirah.jpg" },
      { name: "Burj Al Arab", desc: "The global Icon of Arabian luxury which is set on an island in a striking sail-shaped building. It is the first choice for presidents and royal families.", img: "/images/burj-al-arab.jpg" }
    ]
  },
  {
    id: "abudhabi",
    name: "ABU DHABI",
    desc: "Abu Dhabi is the capital city of the UAE that has made it all real. Its business oriented nature has led the strategy that transformed the country in such a short time. Our Clients Will Get To Explore The Culture And History Of This Prosperous Nation.",
    mainImg: "/images/abudhabi-main.jpg",
    icon: Landmark,
    places: [
      { name: "Emirates Palace", desc: "The place where Emirati luxury is defined. This is where presidents and royalty stay upon visiting the UAE, so one can only expect perfection.", img: "/images/emirates-palace.jpg" },
      { name: "Sheikh Zayed Grand Mosque", desc: "One of the largest mosques in the world, and designed to have traditional Islamic architecture meet the modern world.", img: "/images/zayed-mosque.jpg" },
      { name: "Yas Island", desc: "The famous Island featuring Ferrari World is where you get to enjoy the history of Ferrari, and also test-drive your favorite car.", img: "/images/yas-island.jpg" }
    ]
  },
  {
    id: "rak",
    name: "RAS EL KHEIMAH",
    desc: "The Emirate is well known for its beautiful nature. Several mountain ranges fill the landscape, with Jebel Jais being the most famous; moreover our clients get to experience the world's longest zipline adventure amongst the mountains.",
    mainImg: "/images/rak-main.jpg",
    icon: Mountain,
    places: [
      { name: "Jebel Jais", desc: "Located within other surrounding mountain ranges, Jebel Jais is the most famous mountain in Ras Al Khaimah where several desert activities take place.", img: "/images/jebel-jais.jpg" },
      { name: "Longest Zip-Line", desc: "The longest zip-line in the world offers a spectacular view of the mountain ranges. With an average of 60 Km/h, one will have a unique experience.", img: "/images/zip-line.jpg" }
    ]
  },
  {
    id: "fujairah",
    name: "FUJAIRAH",
    desc: "Regarded as one of the top destinations in the UAE for its beaches and coral reefs, the city is a must go for those seeking to destress and unwind; moreover our clients can go back further in time when the ruling family was living there by visiting the oldest fort in the UAE.",
    mainImg: "/images/fujairah-main.jpg",
    icon: Waves,
    places: [
      { name: "Fujairah Fort", desc: "A 300 year old fort, one of oldest forts in the UAE; moreover, very few forts and castles are well preserved as Fujairah fort is. It has served as a major post for anti-colonialism.", img: "/images/fujairah-fort.jpg" },
      { name: "Musandam Dibba", desc: "One of the most beautiful fjords in the region. Sailing the fjord with a dhow provides an amazing experience for guests who enjoy being in nature's company.", img: "/images/musandam.jpg" }
    ]
  },
  {
    id: "sharjah",
    name: "SHARJAH",
    desc: "The third most populated emirate in the UAE is renowned as a family-friendly emirate. It offers a laid back atmosphere where you can immerse yourself into Emirati culture. It is a well-known destination amongst scholars and travelers seeking to dig deeper into Islamic history.",
    mainImg: "/images/sharjah-main.jpg",
    icon: Library,
    places: [
      { name: "Museum of Islamic Civilization", desc: "The museum is dedicated to Islamic civilization, offering guests to experience the history and culture. One can expect ceramics, coins, glass objects, and manuscripts.", img: "/images/islamic-museum.jpg" },
      { name: "King Faisal Mosque", desc: "One of the largest mosques in Sharjah Emirate is one of the most beautiful mosques in the UAE due to its amazing architecture.", img: "/images/king-faisal-mosque.jpg" }
    ]
  }
];

export default function UAEDestinationPage() {
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
            src="/images/uae-hero.jpg" 
            alt="Luxury UAE" 
            fill 
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F162A]/70 to-white z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#F1B820] font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-6 font-en flex items-center justify-center gap-2">
              <Star className="w-4 h-4 fill-[#F1B820]" /> 5-STAR CORPORATE & LEISURE <Star className="w-4 h-4 fill-[#F1B820]" />
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white font-en mb-6 tracking-tight drop-shadow-2xl">
              Luxury <span className="text-[#F1B820]">UAE</span>
            </h1>
            <p className="text-lg md:text-xl text-[#0F162A] font-en leading-relaxed max-w-2xl mx-auto font-bold bg-white/60 backdrop-blur-md py-3 px-8 rounded-full shadow-lg">
              Where luxury comes directly to you. Elevating corporate travel, VIP mobility, and elite leisure across the Emirates.
            </p>
          </motion.div>
        </div>

        {/* Floating Pill Navigation (No Transportation) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="absolute -bottom-6 left-0 right-0 z-30 flex justify-center px-4 w-full max-w-[1200px] mx-auto"
        >
          <div className="bg-white p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex gap-2 overflow-x-auto max-w-full no-scrollbar">
            {uaeData.map((emirate, idx) => (
              <button 
                key={idx} onClick={() => scrollToSection(emirate.id)}
                className="flex items-center gap-2 px-8 py-4 rounded-full hover:bg-[#157670] hover:text-white text-[#0F162A] font-black font-en text-sm tracking-wide uppercase transition-colors whitespace-nowrap"
              >
                <emirate.icon className="w-5 h-5" strokeWidth={2} /> {emirate.name}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 2. Main Content - Editorial White Background Layout */}
      <section className="w-full bg-white relative z-20 pt-32 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          
          {uaeData.map((emirate, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={emirate.id} id={emirate.id} className="relative scroll-mt-32 group">
                
                {/* Top Section: Text & Main Image */}
                <div className={`flex flex-col lg:flex-row items-center gap-16 mb-12 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Text */}
                  <motion.div initial={{ opacity: 0, x: isEven ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-5/12 flex flex-col justify-center">
                    <div className="w-16 h-1.5 bg-[#F1B820] mb-6 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-6">
                      <emirate.icon className="w-8 h-8 text-[#157670]" />
                      <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">{emirate.name}</h2>
                    </div>
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">{emirate.desc}</p>
                  </motion.div>

                  {/* Main Large Image */}
                  <motion.div initial={{ opacity: 0, x: isEven ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-7/12 relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                    <Image src={emirate.mainImg} alt={emirate.name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F162A]/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 text-white font-bold font-en text-2xl flex items-center gap-3">
                      <MapPin className="text-[#F1B820] w-6 h-6" /> Explore {emirate.name}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Section: Landmarks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {emirate.places.map((place, pIdx) => (
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
                {idx !== uaeData.length - 1 && (
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