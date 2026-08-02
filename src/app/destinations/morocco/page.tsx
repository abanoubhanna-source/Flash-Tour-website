// src/app/destinations/morocco/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Compass, Mountain, Building2 } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/Footer";
import { trackDestinationView } from '@/lib/analytics';
import { usePublishedDestination } from '@/lib/cms/destinations/use-published-destination';

// الداتا الموحدة للمغرب (بأسلوب B2B فخم)
const defaultMoroccoData = [
  {
    id: "marrakech",
    slug: "marrakech",
    name: "MARRAKECH",
    icon: Building2,
    desc: "Known as the 'Red City', Marrakech is a sensory masterpiece where ancient traditions meet modern luxury. From the bustling souks and the historic Medina to our exclusive, meticulously restored luxury Riads, we offer your elite clients an authentic yet highly sophisticated Moroccan experience.",
    // TODO: no photograph assets exist for Marrakech yet — add real ones once available.
    mainImg: "",
    places: [
      { name: "Luxury Riads", desc: "Experience ultimate privacy and authentic Moroccan hospitality in our curated selection of high-end Riads located in the heart of the Medina.", img: "" },
      { name: "Jemaa el-Fnaa", desc: "The vibrant heartbeat of the city. A UNESCO Masterpiece of the Oral and Intangible Heritage of Humanity, offering an unforgettable cultural immersion.", img: "" },
      { name: "Bahia Palace", desc: "A 19th-century palace reflecting the true essence of Islamic and Moroccan architectural brilliance, surrounded by lush, tranquil gardens.", img: "" }
    ]
  },
  {
    id: "atlas-mountains",
    name: "ATLAS MOUNTAINS",
    icon: Mountain,
    desc: "Just a short drive from the vibrant cities lies the serene majesty of the Atlas Mountains. Perfect for exclusive corporate retreats and VIP leisure, offering breathtaking valleys, authentic Berber villages, and luxury eco-lodges that blend seamlessly with nature.",
    // TODO: no photograph assets exist for the Atlas Mountains yet — add real ones once available.
    mainImg: "",
    places: [
      { name: "Luxury Eco-Lodges", desc: "Unwind in high-end mountain retreats offering panoramic views, premium spa services, and absolute tranquility away from the city.", img: "" },
      { name: "Ourika Valley", desc: "A stunning valley offering exclusive guided excursions, pristine waterfalls, and a chance to experience the authentic lifestyle of the Berber people.", img: "" },
      { name: "Mount Toubkal", desc: "The highest peak in North Africa. We organize bespoke, fully-serviced hiking and climbing expeditions for the adventurous elite.", img: "" }
    ]
  },
  {
    id: "sahara",
    name: "THE SAHARA DESERT",
    icon: Compass,
    desc: "A journey into the endless golden dunes. We redefine desert exploration by providing ultra-luxury glamping experiences. Imagine dining under a canopy of stars with world-class service, private nomadic tents, and VIP mobility across the majestic Sahara.",
    // TODO: no photograph assets exist for the Sahara yet — add real ones once available.
    mainImg: "",
    places: [
      { name: "Luxury Glamping", desc: "Bespoke desert camps featuring king-size beds, en-suite facilities, and gourmet dining, ensuring 5-star comfort in the heart of the dunes.", img: "" },
      { name: "Merzouga Dunes", desc: "Famous for the towering Erg Chebbi dunes. Experience private sunset camel treks and exclusive 4x4 dune bashing adventures.", img: "" },
      { name: "Ait Benhaddou", desc: "A historic fortified village (Ksar) and UNESCO World Heritage site, famous as a backdrop for numerous Hollywood masterpieces.", img: "" }
    ]
  }
];

export default function MoroccoDestinationPage() {
  const cms = usePublishedDestination('morocco');
  useEffect(() => { trackDestinationView('Morocco'); }, []);
  const [moroccoData, setMoroccoData] = useState(defaultMoroccoData);
  useEffect(() => {
    fetch(`/api/destinations/hierarchy?slug=morocco`)
      .then((r) => (r.ok ? r.json() : { places: [] }))
      .then(({ places }) => {
        if (!places || !places.length) return;
        setMoroccoData((current) => current.map((city) => {
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
          {cms?.hero?.image.url ? (
            <Image
              src={cms.hero.image.url}
              alt={cms.hero.image.alt || "Enchanting Morocco"}
              sizes="100vw"
              fill
              className="object-cover opacity-50"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            // TODO: no photograph asset exists for Morocco's hero yet — replace with a real photo once available.
            <div className="absolute inset-0 bg-brand-navy" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-navy/70 to-white z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-brand-gold font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-6 font-en flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-brand-gold/70" /> {cms?.hero?.eyebrow || "THE GATEWAY TO AFRICA"} <span className="h-px w-8 bg-brand-gold/70" />
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-en mb-6 tracking-tight drop-shadow-2xl uppercase">
              {cms?.hero?.title || "Enchanting"} <br/> <span className="text-brand-gold">{cms?.hero?.accentTitle || "Morocco"}</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-navy font-en leading-relaxed max-w-2xl mx-auto font-bold bg-white/60 backdrop-blur-md py-3 px-8 rounded-full shadow-lg">
              {cms?.hero?.subtitle || "Immerse yourself in vibrant colors, rich traditions, and unparalleled North African luxury."}
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
                    {region.mainImg ? (
                      <Image src={region.mainImg} alt={region.name} sizes="(max-width: 1024px) 100vw, 58vw" fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                    ) : (
                      <div className="absolute inset-0 bg-brand-navy-deep" />
                    )}
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
                        {place.img ? (
                          <Image src={place.img} alt={place.name} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="absolute inset-0 bg-brand-navy-deep" />
                        )}
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
