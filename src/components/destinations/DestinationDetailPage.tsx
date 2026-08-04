// src/components/destinations/DestinationDetailPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Loader2, MapPin } from 'lucide-react';
import Footer from '@/components/Footer';

type HierarchyAttraction = { slug: string; title: string; desc: string; image: string };
type HierarchyPlace = { slug: string; title: string; desc: string; image: string; attractions: HierarchyAttraction[] };

type Props = {
  countrySlug: string;
  placeSlug: string;
  attractionSlug?: string;
};

export function DestinationDetailPage({ countrySlug, placeSlug, attractionSlug }: Props) {
  const [loading, setLoading] = useState(true);
  const [countryName, setCountryName] = useState('');
  const [place, setPlace] = useState<HierarchyPlace | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/destinations?slug=${countrySlug}`).then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch(`/api/destinations/hierarchy?slug=${countrySlug}`).then((r) => (r.ok ? r.json() : { places: [] })).catch(() => ({ places: [] })),
    ]).then(([country, hierarchy]) => {
      setCountryName(country?.name || countrySlug);
      const foundPlace = (hierarchy.places || []).find((p: HierarchyPlace) => p.slug === placeSlug) || null;
      setPlace(foundPlace);
      setLoading(false);
    });
  }, [countrySlug, placeSlug]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-en">
        <Loader2 className="w-10 h-10 animate-spin text-brand-teal" />
      </div>
    );
  }

  const attraction = attractionSlug ? place?.attractions.find((a) => a.slug === attractionSlug) : undefined;
  const current = attractionSlug ? attraction : place;
  const countryHref = `/destinations/${countrySlug}`;
  const placeHref = `/destinations/${countrySlug}/${placeSlug}`;

  if (!place || (attractionSlug && !attraction)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center w-full bg-slate-50 px-6 text-center">
        <h1 className="text-3xl font-bold text-brand-navy font-en mb-4">
          {attractionSlug ? 'Attraction not found' : 'Destination not found'}
        </h1>
        <p className="text-slate-500 font-en mb-8">This page may have been renamed or removed.</p>
        <Link href={countryHref} className="inline-flex items-center gap-2 text-brand-teal font-bold font-en hover:text-brand-gold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to {countryName}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white overflow-hidden">
      {/* Hero */}
      <section className="relative w-full h-[70vh] flex flex-col items-center justify-center bg-brand-navy">
        <div className="absolute inset-0 z-0">
          {current?.image ? (
            <Image src={current.image} alt={current.title} sizes="100vw" fill className="object-cover opacity-50" loading="eager" fetchPriority="high" />
          ) : (
            <div className="absolute inset-0 bg-brand-navy-deep" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-navy/70 to-white z-10" />
        </div>

        <div className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/70 font-en text-xs font-bold uppercase tracking-widest">
          <Link href={countryHref} className="hover:text-brand-gold transition-colors">{countryName}</Link>
          {attractionSlug && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={placeHref} className="hover:text-brand-gold transition-colors">{place.title}</Link>
            </>
          )}
        </div>

        <div className="relative z-20 text-center px-6 mt-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-brand-gold font-bold tracking-[0.25em] uppercase text-xs md:text-sm block mb-6 font-en flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" /> {attractionSlug ? place.title : countryName}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-en mb-6 tracking-tight drop-shadow-2xl uppercase">
              {current?.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="w-full bg-white relative z-20 py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-slate-600 font-en leading-relaxed text-lg">
              {current?.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Attractions grid — only on the place-level page */}
      {!attractionSlug && place.attractions.length > 0 && (
        <section className="w-full bg-slate-50 border-t border-slate-100 relative z-20 py-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-brand-navy font-en tracking-tight uppercase">Explore {place.title}</h2>
              <div className="w-24 h-1.5 bg-brand-gold mx-auto mt-6 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {place.attractions.map((item) => (
                <Link key={item.slug} href={`${placeHref}/${item.slug}`} className="group cursor-pointer block">
                  <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-md mb-6 border border-slate-100">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 bg-brand-navy-deep" />
                    )}
                    <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/30 transition-colors duration-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-teal font-en mb-3 flex items-center gap-2">
                    {item.title} <ChevronRight className="w-5 h-5 text-brand-gold opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </h3>
                  <p className="text-slate-600 font-en text-sm leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
