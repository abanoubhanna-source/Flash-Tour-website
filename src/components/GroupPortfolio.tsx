// src/components/GroupPortfolio.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Building2, Ship, Utensils, Car, Waves, Hotel } from 'lucide-react';
import Link from 'next/link';

const portfolio = [
  { title: 'Flash Tour', desc: 'Destination management, inbound travel, corporate trips, and leisure operations.', icon: Building2, href: '/services' },
  { title: 'Serenity Nile Cruises', desc: 'Owned luxury Nile cruise experiences across Luxor and Aswan.', icon: Ship, href: '/cruises' },
  { title: 'Hotels & Resorts', desc: 'Boutique, beach, and international hospitality assets under group control.', icon: Hotel, href: '/hospitality' },
  { title: 'Flash Yachting', desc: 'Private marine, diving, and Red Sea experiences for premium travelers.', icon: Waves, href: '/brands' },
  { title: 'Restaurants', desc: 'Fine dining concepts supporting the group’s luxury hospitality ecosystem.', icon: Utensils, href: '/brands' },
  { title: 'Flash Transport', desc: 'Premium mobility infrastructure for VIP, MICE, and large-scale operations.', icon: Car, href: '/services' },
];

export default function GroupPortfolio() {
  return (
    <section className="w-full py-24 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <div>
            <p className="text-[#037373] font-en font-black tracking-[0.28em] uppercase text-xs mb-4">The Group Portfolio</p>
            <h2 className="text-4xl md:text-6xl font-black text-[#081427] font-en tracking-[-0.045em] max-w-3xl">
              One Group. <span className="text-[#F4C300]">Integrated Assets.</span> Endless Journeys.
            </h2>
          </div>
          <p className="max-w-xl text-slate-600 font-en leading-relaxed text-lg">
            Flash Group is not a booking platform. It is an operational ecosystem owning and managing the assets that make premium travel possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="group bg-white rounded-[2rem] border border-slate-200 p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#037373]/10 flex items-center justify-center mb-8 group-hover:bg-[#081427] transition-colors">
                <item.icon className="w-7 h-7 text-[#037373] group-hover:text-[#F4C300] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-[#081427] font-en mb-4">{item.title}</h3>
              <p className="text-slate-600 font-en leading-relaxed mb-8">{item.desc}</p>
              <Link href={item.href} className="inline-flex items-center gap-2 text-[#037373] font-en font-black group-hover:text-[#081427] transition-colors">
                Explore Asset <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
