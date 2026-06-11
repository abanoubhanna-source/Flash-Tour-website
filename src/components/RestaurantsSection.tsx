// src/components/RestaurantsSection.tsx
'use client';

import { motion } from 'framer-motion';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function RestaurantsSection() {
  return (
    <section className="w-full py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-en tracking-tight mb-4">
              Fine <span className="text-teal-700">Dining</span>
            </h2>
            <p className="text-lg text-slate-500 font-en max-w-xl">
              Award-winning culinary experiences catering to Egypt's elite.
            </p>
          </motion.div>
          <motion.button initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-2 font-en font-bold text-teal-700 hover:text-slate-900 transition-colors">
            View All Restaurants <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Rossini Restaurant */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col md:flex-row bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="relative w-full md:w-1/2 min-h-[300px]">
              <Image src="/images/rossini.jpg" alt="Rossini Restaurant" fill className="object-cover" />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <UtensilsCrossed className="w-6 h-6 text-amber-500 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 font-en mb-2">Rossini</h3>
              <p className="text-sm font-bold text-teal-700 tracking-widest uppercase mb-4 font-en">Est. 1993</p>
              <p className="text-slate-600 font-en text-sm leading-relaxed mb-6">
                A landmark in fine dining in Cairo[cite: 390]. Renowned for Italian/Mediterranean delicacies and certified by Chaine des Rotisseurs[cite: 378, 400].
              </p>
            </div>
          </motion.div>

          {/* Carlo's Heliopolis */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className="relative w-full md:w-1/2 min-h-[300px]">
              <Image src="/images/carlos.jpg" alt="Carlo's Heliopolis" fill className="object-cover" />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <UtensilsCrossed className="w-6 h-6 text-teal-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 font-en mb-2">Carlo's Heliopolis</h3>
              <p className="text-sm font-bold text-teal-700 tracking-widest uppercase mb-4 font-en">Middle Eastern & Int.</p>
              <p className="text-slate-600 font-en text-sm leading-relaxed mb-6">
                Nestled in a beautiful 1920s villa garden, serving a wide variety of Oriental, Asian, and Italian dishes[cite: 436, 448].
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}