// src/app/destinations/egypt/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Anchor, Building2, UtensilsCrossed, Ship, Waves, ArrowRight, MapPin, Car, Star, Compass } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";

// 1. Nile Cruises Fleet (The Royal Fleet)
const cruises = [
  { name: "Nile Serenity", type: "Ultra-Luxury Flagship", desc: "Redefining river hospitality with unmatched suite spaces, fine dining, and panoramic views.", image: "/images/nile-serenity.jpg", cols: "lg:col-span-2" },
  { name: "Nile Excellence", type: "Boutique Luxury", desc: "An exclusive boutique vessel featuring 30 premium suites for discerning travelers seeking intimacy.", image: "/images/nile-excellence.jpg", cols: "lg:col-span-1" },
  { name: "Magic I", type: "Premium Cruise", desc: "Renovated in 2021, offering a premium boutique experience with 70 luxury cabins and 2 magnificent suites.", image: "/images/magic1.jpg", cols: "lg:col-span-1" },
  { name: "Magic II", type: "Premium Cruise", desc: "Designed for ultimate relaxation, featuring 72 newly renovated cabins and 2 majestic suites.", image: "/images/magic2.jpg", cols: "lg:col-span-1" },
  { name: "Lady Mary", type: "Classic Luxury", desc: "Experience the timeless elegance with 72 beautifully appointed cabins.", image: "/images/lady-mary.jpg", cols: "lg:col-span-1" },
];

// 2. Hotels (Sanctuaries)
const hotels = [
  { name: "True Beach Resort", location: "Marsa Alam", desc: "5-Star serenity on the pristine Red Sea coastline. Divided into a family-friendly resort and an exclusive adults-only village with private beaches.", image: "/images/true-beach.jpg" },
  { name: "1920s Boutique Hotel", location: "Heliopolis, Cairo", desc: "Step back in time in our beautifully restored 100-year-old historic villa. Combining classic architecture with modern sophistication.", image: "/images/1920s-hotel.jpg" }
];

// 3. Fine Dining
const dining = [
  { name: "Rossini", type: "Italian & Mediterranean", desc: "A landmark in Cairo's fine dining since 1993. Proud bearer of the Chaine des Rotisseurs certification.", image: "/images/rossini.jpg" },
  { name: "Carlo's", type: "Premium Casual", desc: "Nestled in a beautiful historic villa garden, serving a wide variety of Oriental, Asian, and international dishes.", image: "/images/carlos.jpg" }
];

// 4. Destinations Data (Added from your text)
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
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

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

        {/* Quick Navigation Pills */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="absolute -bottom-6 left-0 right-0 z-30 flex justify-center px-4">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full shadow-2xl border border-white/20 flex gap-2 overflow-x-auto max-w-full no-scrollbar">
            <button onClick={() => scrollToSection('hospitality')} className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-[#F1B820] hover:text-[#0F162A] text-white font-bold font-en text-sm transition-colors whitespace-nowrap"><Building2 className="w-4 h-4" /> Hospitality</button>
            <button onClick={() => scrollToSection('destinations')} className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-[#F1B820] hover:text-[#0F162A] text-white font-bold font-en text-sm transition-colors whitespace-nowrap"><Compass className="w-4 h-4" /> Destinations</button>
            <button onClick={() => scrollToSection('transportation')} className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-[#F1B820] hover:text-[#0F162A] text-white font-bold font-en text-sm transition-colors whitespace-nowrap"><Car className="w-4 h-4" /> Transportation</button>
          </div>
        </motion.div>
      </section>

  
      {/* =========================================
          PART 2: DESTINATIONS (White Background)
      ========================================= */}
      <section id="destinations" className="w-full bg-white relative z-20 pt-24 pb-32 border-t border-slate-200">
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

      {/* =========================================
          PART 3: TRANSPORTATION (Teal Background)
      ========================================= */}
      <section id="transportation" className="w-full bg-[#157670] py-24 relative z-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat z-0"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 bg-[#0d4a46]/30 p-10 md:p-16 rounded-[3rem] border border-white/10 backdrop-blur-sm shadow-2xl">
            
            {/* Texts */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2 text-white space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Car className="w-8 h-8 text-[#F1B820]" />
                <h2 className="text-4xl md:text-5xl font-black text-white font-en tracking-tight">Transportation</h2>
              </div>
              <p className="font-en leading-relaxed text-lg text-white/90">
                Our team takes care of all our client's transportation. Our fleet is equipped with a variety of vehicles that serve all purposes; moreover, We handle transportation services for both leisure and business travelers.
              </p>
              <div className="bg-[#0F162A]/40 p-8 rounded-3xl border-l-4 border-[#F1B820] shadow-xl">
                <p className="font-en text-base leading-relaxed text-slate-200">
                  With a fleet of more than <strong className="text-[#F1B820]">100 vehicles</strong>, we guarantee our clients a wide variety of transports that exceed international standards. Whether our clients are seeking leisure or a professional atmosphere, Flash Transportation is ready. 
                  <br/><br/>
                  We offer a variety of Private VIP cars, Limousines, coasters, shuttles, to 50 seater buses.
                </p>
              </div>
            </motion.div>

            {/* Cinematic Fleet Gallery */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="relative h-40 md:h-56 w-full rounded-2xl overflow-hidden shadow-lg"><Image src="/images/egypt-transport-1.jpg" alt="Fleet 1" fill className="object-cover" /></div>
              <div className="relative h-40 md:h-56 w-full rounded-2xl overflow-hidden shadow-lg"><Image src="/images/egypt-transport-2.jpg" alt="Fleet 2" fill className="object-cover" /></div>
              <div className="relative h-40 md:h-56 w-full rounded-2xl overflow-hidden shadow-lg"><Image src="/images/egypt-transport-3.jpg" alt="Fleet 3" fill className="object-cover" /></div>
              <div className="relative h-40 md:h-56 w-full rounded-2xl overflow-hidden shadow-lg bg-[#0F162A] flex flex-col items-center justify-center p-4 text-center border border-white/10">
                <h3 className="text-[#F1B820] font-black text-3xl font-en mb-1">100+</h3>
                <p className="text-white text-xs font-en uppercase tracking-widest">Premium Vehicles</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}