// src/components/HospitalityBrands.tsx
'use client';

import { motion } from 'framer-motion';
import { MapPin, Ship, Building2, Star } from 'lucide-react';

const hospitalityAssets = [
  {
    id: 'serenity',
    category: 'Nile Cruises',
    title: 'Serenity Fleet',
    location: 'Luxor & Aswan, Egypt',
    desc: '5 luxury floating hotels offering unparalleled 5-star experiences along the legendary Nile River.',
    img: '/images/hospitality-cruise.jpg',
    icon: Ship
  },
  {
    id: 'kiwengwa',
    category: 'Beach Resort',
    title: 'Kiwengwa Resort',
    location: 'Zanzibar, Tanzania',
    desc: 'Our flagship 200-room tropical sanctuary on the pristine eastern coast of the Indian Ocean.',
    img: '/images/hospitality-zanzibar.jpg',
    icon: Building2
  },
  {
    id: 'italy-hotels',
    category: 'European Portfolio',
    title: 'Italian Collection',
    location: 'Sardinia & Sicily, Italy',
    desc: '7 exclusive 5-star properties catering to the elite European corporate and leisure markets.',
    img: '/images/hospitality-italy.jpg',
    icon: Star
  }
];

export default function HospitalityBrands() {
  return (
    <section className="w-full bg-white py-24 relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en mb-4">
              Owned <span className="text-[#157670]">Hospitality</span>
            </h2>
            <p className="text-slate-500 font-en text-lg leading-relaxed">
              By owning our supply chain, we guarantee our B2B partners priority allocation, strict quality control, and unbeatable contracted rates.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-2 bg-[#F1B820] rounded-full"></div>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {hospitalityAssets.map((asset, idx) => (
            <motion.div 
              key={asset.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative h-[450px] rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                style={{ backgroundImage: `url(${asset.img})` }}
              ></div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F162A] via-[#0F162A]/50 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest font-en mb-3">
                    <asset.icon className="w-3 h-3 text-[#F1B820]" /> {asset.category}
                  </span>
                  <h3 className="text-3xl font-bold text-white font-en mb-2 group-hover:text-[#F1B820] transition-colors">
                    {asset.title}
                  </h3>
                  <p className="text-slate-300 flex items-center gap-2 text-sm font-en font-medium mb-4">
                    <MapPin className="w-4 h-4 text-[#157670]" /> {asset.location}
                  </p>
                </div>
                
                {/* Description appears on hover */}
                <div className="overflow-hidden h-0 group-hover:h-20 transition-all duration-500 ease-in-out">
                  <p className="text-white/80 font-en text-sm leading-relaxed border-t border-white/20 pt-4">
                    {asset.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}