// src/components/StatsSection.tsx
'use client';

import { motion } from 'framer-motion';

const stats = [
  { id: 1, value: "40+", label: "Years of Excellence", desc: "Crafting legendary journeys since 1985." },
  { id: 2, value: "1000+", label: "Global Experts", desc: "A dedicated team passionate about hospitality." },
  { id: 3, value: "100+", label: "Luxury Fleet", desc: "Premium vehicles ensuring absolute comfort." },
  { id: 4, value: "4", label: "Global Destinations", desc: "Operating in Egypt, UAE, Zanzibar, and Europe." }
];

export default function StatsSection() {
  return (
    // واخدة الشاشة كلها w-full
    <section className="w-full pt-32 pb-16 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* العناوين */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-en mb-6 tracking-tight">
            Our Legacy in <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-amber-500">Numbers</span>
          </h2>
          <div className="w-24 h-1.5 bg-teal-700 mx-auto rounded-full"></div>
        </motion.div>

        {/* الكروت: بدون حدود (No Borders) ومع ظل ناعم */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-10 rounded-3xl bg-white shadow-[0_4px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_60px_rgba(15,118,110,0.1)] hover:-translate-y-2 transition-all duration-500"
            >
              {/* رقم متدرج اللون */}
              <h3 className="text-6xl font-black font-en mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-500">
                {stat.value}
              </h3>
              <h4 className="text-xl font-bold text-slate-900 font-en mb-3">
                {stat.label}
              </h4>
              <p className="text-slate-500 font-en text-sm leading-relaxed">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* الإضافة الجديدة: شريط الجوائز والشهادات (Awards Marquee) */}
        <div className="border-t border-slate-100 pt-16">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-10 font-en">
            Recognized & Certified By Global Standards
          </p>
          
          {/* شريط بيتحرك لا نهائي */}
          <div className="relative flex overflow-x-hidden group">
            <motion.div 
              className="flex items-center gap-24 whitespace-nowrap px-12"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            >
              {/* اللوجوهات متكررة مرتين عشان الحركة متقفش */}
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-24">
                  {/* استخدمنا أسماء الجوائز من البروفايل [cite: 399, 400, 401] */}
                  <span className="text-2xl font-bold text-slate-300 font-en">Chaine des Rotisseurs 1950</span>
                  <span className="text-2xl font-bold text-slate-300 font-en">E. Cristal Certified</span>
                  <span className="text-2xl font-bold text-slate-300 font-en">Ministry of Tourism Award</span>
                  <span className="text-2xl font-bold text-slate-300 font-en">IATA Licensed</span>
                  <span className="text-2xl font-bold text-slate-300 font-en">ASTA Certified</span>
                </div>
              ))}
            </motion.div>
            
            {/* Fade effect على الأطراف */}
            <div className="absolute inset-0 bg-gradient-to-r from-white w-32 left-0 z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-white w-32 left-auto right-0 z-10 pointer-events-none"></div>
          </div>
        </div>

      </div>
    </section>
  );
}