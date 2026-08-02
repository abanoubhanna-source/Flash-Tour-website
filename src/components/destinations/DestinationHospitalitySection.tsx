// src/components/destinations/DestinationHospitalitySection.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Ship, Building2, ArrowUpRight } from 'lucide-react';

type HospitalityItem = {
  id: string;
  slug: string;
  type: 'hospitality' | 'cruise';
  name: string;
  region: string;
  description: string;
  image: string;
};

export default function DestinationHospitalitySection({ country }: { country: string }) {
  const [items, setItems] = useState<HospitalityItem[]>([]);

  useEffect(() => {
    fetch(`/api/destinations/hospitality?country=${encodeURIComponent(country)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: HospitalityItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => undefined);
  }, [country]);

  if (!items.length) return null;

  return (
    <section className="w-full bg-slate-50 relative z-20 py-24 border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy font-en mb-3">
            Our Hospitality &amp; Cruises in <span className="text-brand-teal">{country}</span>
          </h2>
          <p className="text-slate-500 font-en max-w-2xl mx-auto">
            The owned properties and vessels Flash Group operates directly in {country}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
            >
              {item.image ? (
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 bg-brand-navy-deep" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />

              <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                {item.type === 'cruise' ? <Ship className="w-4 h-4 text-brand-gold" /> : <Building2 className="w-4 h-4 text-brand-gold" />}
              </div>

              <div className="absolute bottom-0 left-0 w-full p-5">
                <h3 className="text-lg font-bold text-white font-en mb-1 group-hover:text-brand-gold transition-colors">{item.name}</h3>
                {item.region && <p className="text-xs text-slate-300 font-en">{item.region}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/hospitality" className="inline-flex items-center gap-2 text-brand-teal font-bold font-en text-sm hover:text-brand-gold transition-colors">
            Explore All Hospitality &amp; Cruises <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
