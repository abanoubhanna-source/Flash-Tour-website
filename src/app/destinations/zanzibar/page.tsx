// src/app/destinations/zanzibar/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Trees, Sun } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";
import DestinationHospitalitySection from "@/components/destinations/DestinationHospitalitySection";
import { trackDestinationView } from '@/lib/analytics';
import { usePublishedDestination } from '@/lib/cms/destinations/use-published-destination';

// الداتا الموحدة لزنجبار والسفاري
type ZanzibarPlace = { name: string; slug?: string; desc: string; img: string };
type ZanzibarCity = { id: string; slug?: string; name: string; icon: typeof Sun; desc: string; mainImg: string; places: ZanzibarPlace[] };

const defaultZanzibarData: ZanzibarCity[] = [
  {
    id: "zanzibar",
    slug: "zanzibar-island",
    name: "ZANZIBAR",
    icon: Sun,
    desc: "In Zanzibar, our own resort Kiwengwa Beach has more than 200 rooms. It is directly located on the beach and offers a wide range of activities. The island itself has the most famous beaches in Africa, where we will organize your private boat Safaris to sand banks located in the middle of the ocean. A visit to the forest with a guide taking you on a spice tour, and a day of relaxation sipping on coconut by the beach.",
    mainImg: "/images/zanzibar-island.jpg",
    places: [
      { name: "National Park", slug: "national-park", desc: "A vast lagoon blessed with a spectacular landscape of striped sand. The mangrove trees surround the lagoon adding to its natural beauty.", img: "/images/zanzibar-national-park.jpg" },
      { name: "Stone Town", slug: "stone-town", desc: "The ancient capital city, where travelers enter the daily life of locals. A visit is never complete without seeing Freddie Mercury’s home museum.", img: "/images/stone-town.jpg" },
      { name: "Jozani Forest", slug: "jozani-forest", desc: "Home to the Red Colobus: a rare species of monkey regarded as the national symbol of Zanzibar. Perfect for those who seek adventure.", img: "/images/jozani.jpg" }
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
  const cms = usePublishedDestination('zanzibar');
  useEffect(() => { trackDestinationView('Zanzibar'); }, []);
  const [zanzibarData, setZanzibarData] = useState(defaultZanzibarData);
  useEffect(() => {
    fetch(`/api/destinations/hierarchy?slug=zanzibar`)
      .then((r) => (r.ok ? r.json() : { places: [] }))
      .then(({ places }) => {
        if (!places || !places.length) return;
        setZanzibarData((current) => current.map((city) => {
          const cmsCity = 'slug' in city ? places.find((p: { slug: string }) => p.slug === (city as { slug?: string }).slug) : undefined;
          if (!cmsCity) return city;
          return {
            ...city,
            name: cmsCity.title ? cmsCity.title.toUpperCase() : city.name,
            desc: cmsCity.desc || city.desc,
            mainImg: cmsCity.image || city.mainImg,
            places: city.places.map((spot) => {
              const spotSlug = 'slug' in spot ? (spot as { slug?: string }).slug : undefined;
              const cmsSpot = spotSlug ? cmsCity.attractions.find((a: { slug: string }) => a.slug === spotSlug) : undefined;
              return cmsSpot ? { ...spot, name: cmsSpot.title || spot.name, desc: cmsSpot.desc || spot.desc, img: cmsSpot.image || spot.img } : spot;
            }),
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
            src={cms?.hero?.image.url || "/images/zanzibar-hero.jpg"}
            alt={cms?.hero?.image.alt || "Exotic Zanzibar & Safari"}
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
              <span className="h-px w-8 bg-brand-gold/70" /> {cms?.hero?.eyebrow || "EXOTIC ESCAPES & WILDLIFE"} <span className="h-px w-8 bg-brand-gold/70" />
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-en mb-6 tracking-tight drop-shadow-2xl">
              {cms?.hero?.title || "Exotic"} <span className="text-brand-gold">{cms?.hero?.accentTitle || "ZANZIBAR"}</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-navy font-en leading-relaxed max-w-2xl mx-auto font-bold bg-white/60 backdrop-blur-md py-3 px-8 rounded-full shadow-lg">
              {cms?.hero?.subtitle || "Africa, the land of the wildlife. Enjoy the best of both worlds with pristine beaches and unforgettable Savanna Safaris."}
            </p>
          </motion.div>
        </div>

        {/* Floating Pill Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="absolute -bottom-6 left-0 right-0 z-30 flex justify-center px-4 w-full max-w-[1200px] mx-auto"
        >
          <div className="bg-white p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex gap-2 overflow-x-auto max-w-full no-scrollbar">
            {zanzibarData.map((region, idx) => (
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

          {zanzibarData.map((region, idx) => {
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
                    <Image src={region.mainImg} alt={region.name} sizes="(max-width: 1024px) 100vw, 58vw" fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 text-white font-bold font-en text-2xl flex items-center gap-3">
                      <MapPin className="text-brand-gold w-6 h-6" /> Discover {region.name}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Section: Landmarks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {region.places.map((place, pIdx) => (
                    <motion.div key={pIdx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: pIdx * 0.1 }} className="group cursor-pointer">
                      <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-md mb-6 border border-slate-100">
                        <Image src={place.img} alt={place.name} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/30 transition-colors duration-500"></div>
                      </div>
                      <h3 className="text-2xl font-bold text-brand-teal font-en mb-3 flex items-center gap-2">
                        {place.name} <ChevronRight className="w-5 h-5 text-brand-gold opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </h3>
                      <p className="text-slate-600 font-en text-sm leading-relaxed">{place.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Separator Line */}
                {idx !== zanzibarData.length - 1 && (
                  <div className="w-full max-w-3xl mx-auto h-px bg-slate-200 mt-32"></div>
                )}
              </div>
            );
          })}

        </div>
      </section>

      <DestinationHospitalitySection country="Tanzania" />

      <Footer />
    </main>
  );
}
