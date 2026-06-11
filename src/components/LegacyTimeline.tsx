// src/components/LegacyTimeline.tsx
'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const milestones = [
  { year: '1985', title: 'Flash Tour Founded', desc: 'The group begins as a specialized Egyptian travel agency with a clear service-first philosophy.' },
  { year: '1998', title: 'Transport Division', desc: 'Operational capability expands with premium ground handling and mobility services.' },
  { year: '2005', title: 'Nile Cruise Expansion', desc: 'The group strengthens its owned hospitality assets with luxury Nile cruise operations.' },
  { year: '2011', title: 'Hotels & Resorts', desc: 'Strategic hospitality investments add resorts and boutique properties to the portfolio.' },
  { year: '2016', title: 'Indian Ocean Growth', desc: 'Zanzibar operations evolve into a premium tropical hospitality and logistics base.' },
  { year: '2026', title: 'Global Partner Network', desc: 'Flash Group stands as an integrated B2B tourism and hospitality infrastructure provider.' },
];

export default function LegacyTimeline() {
  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(#037373 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="inline-flex items-center gap-2 text-[#037373] font-en font-black tracking-[0.28em] uppercase text-xs mb-4">
            <Sparkles className="w-4 h-4 text-[#F4C300]" /> The Flash Legacy
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-[#081427] font-en tracking-[-0.04em]">
            Four Decades of <span className="text-[#037373]">Evolution</span>
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 md:-translate-x-1/2" />
          <div className="space-y-12">
            {milestones.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`relative grid md:grid-cols-2 gap-8 md:gap-16 ${idx % 2 === 0 ? '' : 'md:[&>div:first-child]:col-start-2'}`}
              >
                <div className={`pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="absolute left-4 md:left-1/2 top-2 w-5 h-5 -translate-x-1/2 rounded-full bg-[#037373] border-4 border-white shadow-[0_0_0_6px_rgba(3,115,115,0.12)]" />
                  <span className="text-6xl md:text-7xl font-black text-slate-100 font-en leading-none">{item.year}</span>
                  <h3 className="text-2xl font-black text-[#037373] font-en uppercase tracking-[0.12em] -mt-3 mb-3">{item.title}</h3>
                  <p className="text-slate-600 font-en leading-relaxed max-w-md md:ml-auto">{item.desc}</p>
                </div>
                <div className="hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
