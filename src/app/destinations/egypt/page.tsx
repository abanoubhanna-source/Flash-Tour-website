// src/app/destinations/egypt/page.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";

// Destinations Data
const destinationsData = [
  {
    id: "sharm",
    name: "SHARM EL SHEIKH",
    desc: "Located in South Sinai, Sharm El-Sheikh is a coastal destination. It is warm and sunny all year long and has the most famous coral reef sites. If you are a diving enthusiast, this is the best place to go. For some adrenaline rush you can try different kinds of water sports. If you are a marine passionate you will discover so many marine species and be astonished by the underwater colored reefs. For those wanting to relax, they can enjoy refreshments while tanning on a sunbed by the beach. Nightlife in Sharm is very lively, and this aesthetically beautiful town offers all sorts of activities from early morning to late at night.",
    mainImg: "/images/sharm-main.jpg",
    places: [
      { name: "Tiran Island", desc: "One of the most astonishing spots in the Red Sea with enchanting aquatic wonders. It is one of the best preserved diving sites.", img: "/images/tiran-island.jpg" },
      { name: "Mt. Moses", desc: "The biblical site where Moses received the 10 commandments. Nearby the mountain at St. Catherine’s village, accommodation is offered for adventurers.", img: "/images/mt-moses.jpg" },
      { name: "Ras Mohamed", desc: "A natural preservation where diving enthusiasts will be dazzled by the beauty of its coral reefs. It is protected under Egyptian law to never be polluted.", img: "/images/ras-mohamed.jpg" }
    ]
  },
  {
    id: "hurghada",
    name: "HURGHADA",
    desc: "Located along the Red Sea, Hurghada offers a wide variety of activities. In this city you can go on an adventure, you can snorkel, you can enjoy a boat day and relax. Hurghada is very famous for its laidback lifestyle, for fish lovers you will enjoy the freshest seafood. Hurghada ranks amongst the top destinations for those seeking a relaxing holiday.",
    mainImg: "/images/hurghada-main.jpg",
    places: [
      { name: "Dream Island", desc: "A very special site to explore the under-water gardens of the coral reefs and colorful fish; moreover, enjoy your sunbathe by the beach.", img: "/images/dream-island.jpg" },
      { name: "Giftun Island", desc: "A truly magnificent island with its offshore reefs providing spectacular drop-offs for experienced divers, hiding moray eels and fish amongst the corals.", img: "/images/giftun-island.jpg" },
      { name: "Red Sea Monasteries", desc: "Hidden amid the arid Red Sea Hills, far from the hustle and bustle of the cities, lies Egypt’s two oldest Coptic monasteries: St Paul’s and St Anthony’s.", img: "/images/monasteries.jpg" }
    ]
  },
  {
    id: "marsaalam",
    name: "MARSA ALAM",
    desc: "Marsa Alam, a very well preserved protectorate where nature is intact, far away from urbanization and in the heart of nature. This destination is so authentic that the main activity there is exploring the marine life, the birds. This tranquil destination has white sandy beaches, lagoons, and top sites for diving.",
    mainImg: "/images/marsa-main.jpg",
    places: [
      { name: "Abu Dabab", desc: "A chance to spot the seaweeds gracing dugongs and turtles within their natural habitat. In addition to abundance of colored fish.", img: "/images/abu-dabab.jpg" },
      { name: "Hamata Islands", desc: "The shallow waters are home to the black and orange striped fish and marine delicate species within the vicinity of the coral reefs.", img: "/images/hamata.jpg" },
      { name: "Sataya Dolphin Reef", desc: "An extraordinary site with a steep wall at the outer reef... It provides an opportunity to encounter large schools of fish such as dolphins, tunas, Napoleon, and occasionally passing turtles.", img: "/images/sataya.jpg" }
    ]
  },
  {
    id: "luxor",
    name: "LUXOR",
    desc: "Located on the Eastern bank of the Nile, where the ancient capital of Egypt, Thebes, stood. Due to the city’s historical significance, it is abundant with numerous artifacts from several eras in Egyptian history; moreover, the city is renowned as an open-air museum.",
    mainImg: "/images/luxor-main.jpg",
    places: [
      { name: "Mummification Museum", desc: "An archeological museum, dedicated to the art of Ancient Egyptian mummification. It displays related artifacts and mummies.", img: "/images/mummification.jpg" },
      { name: "Karnak Temple", desc: "Karnak is viewed as the biggest antiquated site on the planet. Around thirty pharaohs have contributed to the structures, permitting it to arrive at a size, intricacy, and variety not discovered elsewhere in Egypt.", img: "/images/karnak.jpg" },
      { name: "Valley of the Kings", desc: "The massive site of royal burials since around 2100 BC with more than 63 magnificent royal tombs. It is one of the most prominent sites.", img: "/images/valley-kings.jpg" }
    ]
  },
  {
    id: "aswan",
    name: "ASWAN",
    desc: "Located in Southern Egypt, it has served as a strategic location since ancient times for commercial activities. Nowadays, the city hosts several ancient temples from different eras; furthermore, the Nubian villages are where you observe well preserved cultures still practicing ancient practices.",
    mainImg: "/images/aswan-main.jpg",
    places: [
      { name: "Nubian Village", desc: "Explore the Traditional Nubian village with vividly colored houses, spice shops, and cafes overlooking the Nile River. It is an experience that no one should miss.", img: "/images/nubian-village.jpg" },
      { name: "Abu Simbel", desc: "Built by the Egyptian king Ramses II and the largest temple carved in rocks in the world. Sun lights up the face of Ramses II in Abu Simbel in biannual illumination.", img: "/images/abu-simbel.jpg" },
      { name: "Philae Temple", desc: "Egypt’s ancient center for the cult of Isis. The temple complex was rescued and moved to nearby Agilkia Island as part of the UNESCO Nubia Campaign project.", img: "/images/philae.jpg" }
    ]
  }
];

export default function EgyptComprehensivePage() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white overflow-hidden">
      
      {/* 1. The Empire Hero (Sleek & Immersive) */}
      <section className="relative w-full h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/egypt-hospitality-bg.jpg" 
            alt="Flash Group Egypt" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F162A]/70 to-[#0F162A] z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-[#F1B820]"></div>
              <p className="text-[#F1B820] font-bold tracking-[0.3em] uppercase text-xs md:text-sm font-en">The Heart of The Empire</p>
              <div className="h-px w-12 bg-[#F1B820]"></div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white font-en mb-6 tracking-tight leading-none drop-shadow-2xl">
              Mystical <span className="text-[#157670]">EGYPT</span>
            </h1>
            <p className="text-xl text-slate-200 font-en max-w-2xl mx-auto leading-relaxed font-light">
              We do not just organize your journey; we own every aspect of it. Explore our private fleet, 5-star resorts, and unparalleled destinations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          PART 2: EXPLORE DESTINATIONS
      ========================================= */}
      <section className="w-full bg-white relative z-20 pt-24 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          
          <div className="text-center mb-10">
            <h2 className="text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">Explore Destinations</h2>
            <div className="w-24 h-1.5 bg-[#F1B820] mx-auto mt-6 rounded-full"></div>
          </div>

          {destinationsData.map((city, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={city.id} className="relative group">
                
                {/* Top Section: Text & Main Image */}
                <div className={`flex flex-col lg:flex-row items-center gap-16 mb-12 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Text */}
                  <motion.div initial={{ opacity: 0, x: isEven ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-5/12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="w-8 h-8 text-[#157670]" />
                      <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en tracking-tight uppercase">{city.name}</h2>
                    </div>
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">{city.desc}</p>
                  </motion.div>

                  {/* Main Large Image */}
                  <motion.div initial={{ opacity: 0, x: isEven ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-7/12 relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                    <Image src={city.mainImg} alt={city.name} fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F162A]/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 text-white font-bold font-en text-2xl flex items-center gap-3">
                      <Star className="text-[#F1B820] w-6 h-6 fill-[#F1B820]" /> Discover {city.name}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Section: The 3 Landmarks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {city.places.map((place, pIdx) => (
                    <motion.div key={pIdx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: pIdx * 0.1 }} className="group cursor-pointer">
                      <div className="relative h-64 w-full rounded-[2rem] overflow-hidden shadow-md mb-6 border border-slate-100">
                        <Image src={place.img} alt={place.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-[#0F162A]/10 group-hover:bg-[#0F162A]/40 transition-colors duration-500"></div>
                      </div>
                      <h4 className="text-2xl font-bold text-[#157670] font-en mb-3 flex items-center gap-2">
                        {place.name} <ArrowRight className="w-5 h-5 text-[#F1B820] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
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

      <Footer />
    </main>
  );
}