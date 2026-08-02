// src/components/hospitality/HospitalityRegionPageTemplate.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck, type LucideIcon } from 'lucide-react';
import { usePublishedPage } from '@/lib/cms/pages/use-published-page';
import Footer from '@/components/Footer';

export type HospitalityShowcaseItem = {
  id: string;
  slug?: string;
  name: string;
  tag: string;
  desc: string;
  img: string;
  icon: LucideIcon;
  specs: string[];
};

export type HospitalityRegionNavLink = { label: string; href: string; current?: boolean };

type CmsProperty = { slug: string; name: string; tag: string; desc: string; roomsOrCabins: number | null; facilities: string[]; diningOptions: string[] };

function buildSpecs(item: CmsProperty): string[] {
  const specs: string[] = [];
  if (item.roomsOrCabins) specs.push(`${item.roomsOrCabins} Rooms`);
  specs.push(...item.diningOptions.slice(0, 1), ...item.facilities.slice(0, 3));
  return specs.slice(0, 4);
}

export function useHospitalityShowcase(defaultItems: HospitalityShowcaseItem[]): HospitalityShowcaseItem[] {
  const [items, setItems] = useState(defaultItems);
  useEffect(() => {
    const slugs = defaultItems.map((item) => item.slug).filter(Boolean).join(',');
    if (!slugs) return;
    fetch(`/api/hospitality/properties?slugs=${slugs}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((cmsItems: CmsProperty[]) => {
        if (!cmsItems.length) return;
        const bySlug = new Map(cmsItems.map((cmsItem) => [cmsItem.slug, cmsItem]));
        setItems((current) => current.map((entry) => {
          const match = entry.slug ? bySlug.get(entry.slug) : undefined;
          if (!match) return entry;
          const specs = buildSpecs(match);
          return { ...entry, name: match.name, tag: match.tag || entry.tag, desc: match.desc || entry.desc, specs: specs.length ? specs : entry.specs };
        }));
      })
      .catch(() => undefined);
  }, [defaultItems]);
  return items;
}

type Props = {
  path: string;
  eyebrowIcon: LucideIcon;
  fallback: {
    eyebrow: string;
    title: string;
    accentTitle: string;
    subtitle: string;
    heroImage: string;
    introHeading: string;
    introBody: string;
    ctaHeading: string;
    ctaBody: string;
  };
  nav: HospitalityRegionNavLink[];
  showcase: HospitalityShowcaseItem[];
};

const trustBadges = ['B2B Rates Available', 'IATA & ASTA Licensed', 'Direct From The Owner'];

export function HospitalityRegionPageTemplate({ path, eyebrowIcon: EyebrowIcon, fallback, nav, showcase }: Props) {
  const cms = usePublishedPage(path);
  const hero = cms?.hero;

  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white overflow-hidden">

      {/* 1. Hero */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center bg-brand-navy">
        <div className="absolute inset-0 z-0">
          <Image
            src={hero?.image.url || fallback.heroImage}
            alt={hero?.image.alt || fallback.title}
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
              <EyebrowIcon className="w-4 h-4 text-brand-gold" /> {hero?.eyebrow || fallback.eyebrow}
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white font-en mb-6 tracking-tight drop-shadow-2xl uppercase">
              {hero?.title || fallback.title} <br /><span className="text-brand-gold">{hero?.accentTitle || fallback.accentTitle}</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-navy font-en leading-relaxed max-w-2xl mx-auto font-bold bg-white/70 backdrop-blur-md py-3 px-8 rounded-full shadow-lg">
              {hero?.subtitle || fallback.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Region sub-nav */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-wrap justify-center gap-2 px-4">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest font-en transition-colors ${
                link.current ? 'bg-brand-gold text-brand-navy' : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Intro + trust badges */}
      <section className="w-full py-20 bg-white relative z-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy font-en leading-tight mb-6">
              {hero?.introHeading || fallback.introHeading}
            </h2>
            <p className="text-lg text-slate-500 font-en leading-relaxed mb-8">
              {hero?.introBody || fallback.introBody}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {trustBadges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-2 rounded-full bg-brand-teal/8 border border-brand-teal/15 px-4 py-2 text-xs font-bold text-brand-teal font-en">
                  <ShieldCheck className="w-3.5 h-3.5" /> {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Showcase (Alternating Editorial Layout) */}
      <section className="w-full bg-white relative z-20 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          {showcase.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group">
                <div className={`flex flex-col lg:flex-row items-center gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}>

                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="w-full lg:w-5/12 flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center border border-brand-teal/20">
                        <Icon className="w-6 h-6 text-brand-teal" />
                      </div>
                      <span className="text-brand-gold font-bold uppercase tracking-widest text-sm font-en">
                        {item.tag}
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-brand-navy font-en tracking-tight uppercase mb-6">
                      {item.name}
                    </h2>

                    <p className="text-slate-600 font-en leading-relaxed text-lg mb-8">
                      {item.desc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 pt-6 border-t border-slate-100">
                      {item.specs.map((spec) => (
                        <div key={spec} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0" />
                          <span className="text-slate-700 font-en font-medium">{spec}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/partner-portal"
                      className="inline-flex w-fit items-center gap-3 bg-brand-navy text-white px-6 py-3.5 rounded-full font-bold font-en text-sm uppercase tracking-widest hover:bg-brand-teal transition-colors duration-300 shadow-lg"
                    >
                      Request B2B Rates <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="w-full lg:w-7/12 relative h-[500px] lg:h-[600px] rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_60px_rgba(21,118,112,0.15)] transition-all duration-700"
                  >
                    <Image
                      src={item.img}
                      alt={item.name}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>

                    <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-brand-teal font-bold text-xl font-en">{item.id}</span>
                    </div>

                    <div className="absolute bottom-8 left-8 text-white font-bold font-en text-xl">
                      {item.name}
                    </div>
                  </motion.div>

                </div>

                {idx !== showcase.length - 1 && (
                  <div className="w-full max-w-3xl mx-auto h-px bg-slate-200 mt-32"></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Grand CTA */}
      <section className="w-full bg-brand-teal py-24 relative z-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat z-0"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-bold text-white font-en tracking-tight uppercase mb-6">
              {hero?.ctaHeading || fallback.ctaHeading}
            </h2>
            <p className="text-teal-100 text-lg md:text-xl font-medium leading-relaxed mb-10 font-en max-w-2xl mx-auto">
              {hero?.ctaBody || fallback.ctaBody}
            </p>
            <Link href="/partner-portal" className="inline-flex items-center gap-3 bg-brand-navy text-white px-10 py-5 rounded-full font-bold font-en text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 shadow-xl hover:shadow-2xl">
              Access B2B Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
