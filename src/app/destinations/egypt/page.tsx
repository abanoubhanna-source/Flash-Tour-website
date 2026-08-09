// src/app/destinations/egypt/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Palmtree, Waves, Fish, Landmark, Ship } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";
import DestinationHospitalitySection from "@/components/destinations/DestinationHospitalitySection";
import { trackDestinationView } from '@/lib/analytics';
import { usePublishedDestination } from '@/lib/cms/destinations/use-published-destination';

// الداتا الأصلية لمصر مع إضافة الأيقونات المخصصة لكل مدينة
const defaultEgyptData = [
  {
    id: "sharm",
    slug: "sharm-el-sheikh",
    name: "SHARM EL SHEIKH",
    desc: "Located in South Sinai, Sharm El-Sheikh is a coastal destination. It is warm and sunny all year long and has the most famous coral reef sites. If you are a diving enthusiast, this is the best place to go. For some adrenaline rush you can try different kinds of water sports. If you are a marine passionate you will discover so many marine species and be astonished by the underwater colored reefs. For those wanting to relax, they can enjoy refreshments while tanning on a sunbed by the beach. Nightlife in Sharm is very lively, and this aesthetically beautiful town offers all sorts of activities from early morning to late at night.",
    mainImg: "/images/sharm-main.jpg",
    icon: Palmtree,
    places: [
      { name: "Tiran Island", slug: "tiran-island", desc: "One of the most astonishing spots in the Red Sea with enchanting aquatic wonders. It is one of the best preserved diving sites.", img: "/images/tiran-island.jpg" },
      { name: "Mt. Moses", slug: "mount-moses", desc: "The biblical site where Moses received the 10 commandments. Nearby the mountain at St. Catherine’s village, accommodation is offered for adventurers.", img: "/images/mt-moses.jpg" },
      { name: "Ras Mohamed", slug: "ras-mohammed-national-park", desc: "A natural preservation where diving enthusiasts will be dazzled by the beauty of its coral reefs. It is protected under Egyptian law to never be polluted.", img: "/images/ras-mohamed.jpg" }
    ]
  },
  {
    id: "hurghada",
    slug: "hurghada",
    name: "HURGHADA",
    desc: "Located along the Red Sea, Hurghada offers a wide variety of activities. In this city you can go on an adventure, you can snorkel, you can enjoy a boat day and relax. Hurghada is very famous for its laidback lifestyle, for fish lovers you will enjoy the freshest seafood. Hurghada ranks amongst the top destinations for those seeking a relaxing holiday.",
    mainImg: "/images/hurghada-main.jpg",
    icon: Waves,
    places: [
      { name: "Dream Island", slug: "dream-island", desc: "A very special site to explore the under-water gardens of the coral reefs and colorful fish; moreover, enjoy your sunbathe by the beach.", img: "/images/dream-island.jpg" },
      { name: "Giftun Island", slug: "giftun-island", desc: "A truly magnificent island with its offshore reefs providing spectacular drop-offs for experienced divers, hiding moray eels and fish amongst the corals.", img: "/images/giftun-island.jpg" },
      { name: "Red Sea Monasteries", slug: "red-sea-monasteries", desc: "Hidden amid the arid Red Sea Hills, far from the hustle and bustle of the cities, lies Egypt’s two oldest Coptic monasteries: St Paul’s and St Anthony’s.", img: "/images/monasteries.jpg" }
    ]
  },
  {
    id: "marsaalam",
    slug: "marsa-alam",
    name: "MARSA ALAM",
    desc: "Marsa Alam, a very well preserved protectorate where nature is intact, far away from urbanization and in the heart of nature. This destination is so authentic that the main activity there is exploring the marine life, the birds. This tranquil destination has white sandy beaches, lagoons, and top sites for diving.",
    mainImg: "/images/marsa-main.jpg",
    icon: Fish,
    places: [
      { name: "Abu Dabab", slug: "abu-dabbab", desc: "A chance to spot the seaweeds gracing dugongs and turtles within their natural habitat. In addition to abundance of colored fish.", img: "/images/abu-dabab.jpg" },
      { name: "Hamata Islands", slug: "hamata-islands", desc: "The shallow waters are home to the black and orange striped fish and marine delicate species within the vicinity of the coral reefs.", img: "/images/hamata.jpg" },
      { name: "Sataya Dolphin Reef", slug: "sataya-dolphin-reef", desc: "An extraordinary site with a steep wall at the outer reef... It provides an opportunity to encounter large schools of fish such as dolphins, tunas, Napoleon, and occasionally passing turtles.", img: "/images/sataya.jpg" }
    ]
  },
  {
    id: "luxor",
    slug: "luxor",
    name: "LUXOR",
    desc: "Located on the Eastern bank of the Nile, where the ancient capital of Egypt, Thebes, stood. Due to the city’s historical significance, it is abundant with numerous artifacts from several eras in Egyptian history; moreover, the city is renowned as an open-air museum.",
    mainImg: "/images/luxor-main.jpg",
    icon: Landmark,
    places: [
      { name: "Mummification Museum", slug: "mummification-museum", desc: "An archeological museum, dedicated to the art of Ancient Egyptian mummification. It displays related artifacts and mummies.", img: "/images/mummification.jpg" },
      { name: "Karnak Temple", slug: "karnak-temple", desc: "Karnak is viewed as the biggest antiquated site on the planet. Around thirty pharaohs have contributed to the structures, permitting it to arrive at a size, intricacy, and variety not discovered elsewhere in Egypt.", img: "/images/karnak.jpg" },
      { name: "Valley of the Kings", slug: "valley-of-the-kings", desc: "The massive site of royal burials since around 2100 BC with more than 63 magnificent royal tombs. It is one of the most prominent sites.", img: "/images/valley-kings.jpg" }
    ]
  },
  {
    id: "aswan",
    slug: "aswan",
    name: "ASWAN",
    desc: "Located in Southern Egypt, it has served as a strategic location since ancient times for commercial activities. Nowadays, the city hosts several ancient temples from different eras; furthermore, the Nubian villages are where you observe well preserved cultures still practicing ancient practices.",
    mainImg: "/images/aswan-main.jpg",
    icon: Ship,
    places: [
      { name: "Nubian Village", slug: "nubian-village", desc: "Explore the Traditional Nubian village with vividly colored houses, spice shops, and cafes overlooking the Nile River. It is an experience that no one should miss.", img: "/images/nubian-village.jpg" },
      { name: "Abu Simbel", slug: "abu-simbel-temple", desc: "Built by the Egyptian king Ramses II and the largest temple carved in rocks in the world. Sun lights up the face of Ramses II in Abu Simbel in biannual illumination.", img: "/images/abu-simbel.jpg" },
      { name: "Philae Temple", slug: "philae-temple", desc: "Egypt’s ancient center for the cult of Isis. The temple complex was rescued and moved to nearby Agilkia Island as part of the UNESCO Nubia Campaign project.", img: "/images/philae.jpg" }
    ]
  }
];

export default function EgyptComprehensivePage() {
  const cms = usePublishedDestination('egypt');
  useEffect(() => { trackDestinationView('Egypt'); }, []);
  const [egyptData, setEgyptData] = useState(defaultEgyptData);
  useEffect(() => {
    fetch(`/api/destinations/hierarchy?slug=egypt`)
      .then((r) => (r.ok ? r.json() : { places: [] }))
      .then(({ places }) => {
        if (!places || !places.length) return;
        setEgyptData((current) => current.map((city) => {
          const cmsCity = 'slug' in city ? places.find((p: { slug: string }) => p.slug === (city as { slug?: string }).slug) : undefined;
          if (!cmsCity) return city;
          return {
            ...city,
            name: cmsCity.title ? cmsCity.title.toUpperCase() : city.name,
            desc: cmsCity.desc || city.desc,
            mainImg: cmsCity.image || city.mainImg,
            places: cmsCity.attractions && cmsCity.attractions.length
              ? cmsCity.attractions.map((a: { slug: string; title: string; desc: string; image: string }) => ({ slug: a.slug, name: a.title, desc: a.desc, img: a.image }))
              : city.places,
          };
        }));
      })
      .catch(() => undefined);
  }, []);

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
            src={cms?.hero?.image.url || "/images/egypt-hospitality-bg.jpg"}
            alt={cms?.hero?.image.alt || "Mystical Egypt"}
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
              <span className="h-px w-8 bg-brand-gold/70" /> {cms?.hero?.eyebrow || "THE HEART OF THE EMPIRE"} <span className="h-px w-8 bg-brand-gold/70" />
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-en mb-6 tracking-tight drop-shadow-2xl">
              {cms?.hero?.title || "Mystical"} <span className="text-brand-gold">{cms?.hero?.accentTitle || "EGYPT"}</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-navy font-en leading-relaxed max-w-2xl mx-auto font-bold bg-white/60 backdrop-blur-md py-3 px-8 rounded-full shadow-lg">
              {cms?.hero?.subtitle || "We do not just organize your journey; we own every aspect of it. Unparalleled destinations crafted for the elite."}
            </p>
          </motion.div>
        </div>

        {/* Floating Pill Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="absolute -bottom-6 left-0 right-0 z-30 flex justify-center px-4 w-full max-w-[1200px] mx-auto"
        >
          <div className="bg-white p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex gap-2 overflow-x-auto max-w-full no-scrollbar">
            {egyptData.map((city, idx) => (
              <button 
                key={idx} onClick={() => scrollToSection(city.id)}
                className="flex items-center gap-2 px-8 py-4 rounded-full hover:bg-brand-teal hover:text-white text-brand-navy font-bold font-en text-sm tracking-wide uppercase transition-colors whitespace-nowrap"
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
          
          {egyptData.map((city, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={city.id} id={city.id} className="relative scroll-mt-32 group">
                
                {/* Top Section: Text & Main Image */}
                <div className={`flex flex-col lg:flex-row items-center gap-16 mb-12 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Text */}
                  <motion.div initial={{ opacity: 0, x: isEven ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-5/12 flex flex-col justify-center">
                    <div className="w-16 h-1.5 bg-brand-gold mb-6 rounded-full"></div>
                    <div className="flex items-center gap-3 mb-6">
                      <city.icon className="w-8 h-8 text-brand-teal" />
                      <h2 className="text-4xl md:text-5xl font-bold text-brand-navy font-en tracking-tight uppercase">{city.name}</h2>
                    </div>
                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">{city.desc}</p>
                  </motion.div>

                  {/* Main Large Image */}
                  <motion.div initial={{ opacity: 0, x: isEven ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-7/12 relative h-[400px] rounded-[1.5rem] overflow-hidden shadow-2xl group">
                    <Link href={`/destinations/egypt/${city.slug}`} className="absolute inset-0 z-10" aria-label={`Explore ${city.name}`} />
                    <Image src={city.mainImg} alt={city.name} sizes="(max-width: 1024px) 100vw, 58vw" fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 text-white font-bold font-en text-2xl flex items-center gap-3">
                      <MapPin className="text-brand-gold w-6 h-6" /> Explore {city.name}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Section: Landmarks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {city.places.map((place, pIdx) => (
                    <motion.div key={pIdx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: pIdx * 0.1 }}>
                      <Link href={`/destinations/egypt/${city.slug}/${place.slug}`} className="group cursor-pointer block">
                        <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-md mb-6 border border-slate-100">
                          <Image src={place.img} alt={place.name} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/30 transition-colors duration-500"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-brand-teal font-en mb-3 flex items-center gap-2">
                          {place.name} <ChevronRight className="w-5 h-5 text-brand-gold opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </h3>
                        <p className="text-slate-600 font-en text-sm leading-relaxed">{place.desc}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Separator Line */}
                {idx !== egyptData.length - 1 && (
                  <div className="w-full max-w-3xl mx-auto h-px bg-slate-200 mt-32"></div>
                )}
              </div>
            );
          })}

        </div>
      </section>

      <DestinationHospitalitySection country="Egypt" />

      <Footer />
    </main>
  );
}
