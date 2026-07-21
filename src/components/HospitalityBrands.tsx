// src/components/HospitalityBrands.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Ship, Building2, Star, Anchor, Palmtree, Building } from 'lucide-react';

const iconMap: { [key: string]: any } = {
  Anchor: Anchor,
  Palmtree: Palmtree,
  Building: Building,
  Ship: Ship,
  Star: Star,
  Building2: Building2
};

export default function HospitalityBrands() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => {
        if(data && !data.error) setBrands(data);
      });
  }, []);

  // بناخد أول 3 براندات لعرضهم في الرئيسية
  const displayBrands = brands.slice(0, 3);

  return (
    <section className="w-full bg-white py-24 relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-navy font-en mb-4">
              Owned <span className="text-brand-teal">Hospitality</span>
            </h2>
            <p className="text-slate-500 font-en text-lg leading-relaxed">
              By owning our supply chain, we guarantee our B2B partners priority allocation, strict quality control, and unbeatable contracted rates.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-2 bg-brand-gold rounded-full"></div>
          </div>
        </div>

        {displayBrands.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:auto-rows-[210px] gap-8">
            {displayBrands.map((asset, idx) => {
              const IconComp = iconMap[asset.icon] || Star;
              const isFeatured = idx === 0;
              return (
                <motion.div
                  key={asset.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative h-[450px] lg:h-auto rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-all duration-500 ${isFeatured ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    style={{ backgroundImage: `url(${asset.image || '/images/hospitality-cruise.jpg'})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold uppercase tracking-widest font-en mb-3">
                        <IconComp className="w-3 h-3 text-brand-gold" /> Flash Property
                      </span>
                      <h3 className={`${isFeatured ? 'text-4xl' : 'text-2xl'} font-bold text-white font-en mb-2 group-hover:text-brand-gold transition-colors`}>
                        {asset.name}
                      </h3>
                      <p className="text-slate-300 flex items-center gap-2 text-sm font-en font-medium mb-4">
                        <MapPin className="w-4 h-4 text-brand-teal" /> {asset.subtitle}
                      </p>
                    </div>

                    <div className="overflow-hidden h-0 group-hover:h-20 transition-all duration-500 ease-in-out">
                      <p className="text-white/80 font-en text-sm leading-relaxed border-t border-white/20 pt-4 line-clamp-3">
                        {asset.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}