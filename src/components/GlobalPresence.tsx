// src/components/GlobalPresence.tsx
'use client';

import { motion } from 'framer-motion';

// نجمة فلاش جروب
const FlashStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C12 0 14.5 9.5 24 12C24 12 14.5 14.5 12 24C12 24 9.5 14.5 0 12C0 12 9.5 9.5 12 0Z" />
  </svg>
);

// تم توسيع الإحداثيات بشكل كبير لتباعد النجوم
const offices = [
  { id: 1, city: 'Sicily', country: 'Italy', top: '25%', left: '48%' },
  { id: 2, city: 'Agadir', country: 'Morocco', top: '42%', left: '25%' }, // رحنا يسار أكتر
  { id: 3, city: 'Cairo', country: 'Egypt', top: '48%', left: '55%' }, // نزلنا تحت شوية
  { id: 4, city: 'Dubai', country: 'UAE', top: '52%', left: '68%' }, // رحنا يمين أكتر
  { id: 5, city: 'Zanzibar', country: 'Tanzania', top: '78%', left: '58%' }, // نزلنا تحت خالص
];

export default function GlobalPresence() {
  return (
    <section className="w-full py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-en mb-4 tracking-tight">
            Global <span className="text-teal-700">Presence</span>
          </h2>
          <p className="text-slate-500 font-en max-w-2xl mx-auto text-lg">
            Strategic offices across three continents ensure seamless operations and world-class service delivery.
          </p>
        </motion.div>

        {/* الحاوية الأساسية للخريطة */}
        <div className="relative w-full max-w-6xl mx-auto aspect-[16/9] md:aspect-[2/1] flex items-center justify-center">
          
          {/* هنا استدعينا الخريطة. 
            أفضل حل: نزل خريطة شفافة وحطها في فولدر images باسم map.png 
            عشان تتجنب حظر الروابط الخارجية من المتصفح 
          */}
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              // استخدم صورة محلية لضمان الظهور 100% (يفضل توفيرها)
              backgroundImage: 'url("/images/map.png")', 
              
              // لو مفيش صورة محلية، ده رابط بديل ومضمون أكتر
              //backgroundImage: 'url("https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@gh-pages/world-map.svg")',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* النجوم وأسماء الدول */}
          {offices.map((office, index) => (
            <motion.div
              key={office.id}
              style={{ top: office.top, left: office.left }}
              className="absolute group cursor-pointer flex items-center gap-2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-4 bg-amber-500/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FlashStar className="w-6 h-6 md:w-8 md:h-8 text-amber-500 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
              </div>

              {/* اسم الدولة */}
              <div className="absolute left-full ml-2 flex flex-col z-20">
                <span className="text-teal-900 font-bold font-en text-sm md:text-lg tracking-wide drop-shadow-sm group-hover:text-teal-600 transition-colors duration-300">
                  {office.country}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}