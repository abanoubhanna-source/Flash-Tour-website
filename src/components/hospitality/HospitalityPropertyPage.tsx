// src/components/hospitality/HospitalityPropertyPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import { regionNav } from '@/components/hospitality/region-nav';

type CmsShowcaseItem = { id: string; slug: string; name: string; tag: string; desc: string; img: string; iconKey: string; specs: string[] };

export type HospitalityRegionKey = 'coastal-sanctuaries' | 'tropical-retreats' | 'nile-cruises' | 'european-elegance' | 'urban-centers';

const regionLabels: Record<HospitalityRegionKey, string> = {
  'coastal-sanctuaries': 'Coastal Sanctuaries',
  'tropical-retreats': 'Tropical Retreats',
  'nile-cruises': 'Nile Cruises',
  'european-elegance': 'European Elegance',
  'urban-centers': 'Urban Centers',
};

export function HospitalityPropertyPage({ region, propertySlug }: { region: HospitalityRegionKey; propertySlug: string }) {
  const [items, setItems] = useState<CmsShowcaseItem[] | null>(null);

  useEffect(() => {
    fetch(`/api/hospitality/showcase?region=${region}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CmsShowcaseItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, [region]);

  if (items === null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-en">
        <Loader2 className="w-10 h-10 animate-spin text-brand-teal mb-4" />
      </div>
    );
  }

  const item = items.find((entry) => entry.slug === propertySlug);
  const regionHref = `/hospitality/${region}`;
  const regionLabel = regionLabels[region] || 'Hospitality';

  if (!item) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center w-full bg-slate-50 px-6 text-center">
        <h1 className="text-3xl font-bold text-brand-navy font-en mb-4">Property not found</h1>
        <p className="text-slate-500 font-en mb-8">This property may have been renamed or removed.</p>
        <Link href={regionHref} className="inline-flex items-center gap-2 text-brand-teal font-bold font-en hover:text-brand-gold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to {regionLabel}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white overflow-hidden">
      {/* Hero */}
      <section className="relative w-full h-[70vh] flex flex-col items-center justify-center bg-brand-navy">
        <div className="absolute inset-0 z-0">
          {item.img ? (
            <Image src={item.img} alt={item.name} sizes="100vw" fill className="object-cover opacity-50" loading="eager" fetchPriority="high" />
          ) : (
            <div className="absolute inset-0 bg-brand-navy-deep" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-navy/70 to-white z-10" />
        </div>

        <div className="absolute top-8 left-8 z-20">
          <Link href={regionHref} className="inline-flex items-center gap-2 text-white/80 hover:text-brand-gold font-en text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to {regionLabel}
          </Link>
        </div>

        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-brand-gold font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-6 font-en">
              {item.tag}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-en mb-6 tracking-tight drop-shadow-2xl uppercase">
              {item.name}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Detail */}
      <section className="w-full bg-white relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-slate-600 font-en leading-relaxed text-lg mb-10">
              {item.desc}
            </p>

            {item.specs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 pt-8 border-t border-slate-100">
                {item.specs.map((spec) => (
                  <div key={spec} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0" />
                    <span className="text-slate-700 font-en font-medium">{spec}</span>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/partner-portal"
              className="inline-flex w-fit items-center gap-3 bg-brand-navy text-white px-6 py-3.5 rounded-full font-bold font-en text-sm uppercase tracking-widest hover:bg-brand-teal transition-colors duration-300 shadow-lg"
            >
              Request B2B Rates <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Other properties nav */}
      <section className="w-full bg-slate-50 border-t border-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-brand-navy font-en mb-6">Explore {regionLabel}</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {regionNav(region).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest font-en bg-white border border-slate-200 text-brand-navy hover:border-brand-teal/40 hover:text-brand-teal transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
