// src/components/InteractiveMap.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

// دي الإحداثيات، ممكن تحتاج تظبطها تظبيطة أخيرة بسيطة جداً بعد التعديل ده
// وبمجرد ما تظبطها، مستحيل تتحرك تاني في أي شاشة
const globalFootprint = [
  { 
    id: 'italy', 
    name: 'Italy', 
    top: '34%', 
    left: '37%', 
    details: '7 Exclusive 5-Star Resorts • European Desk' 
  },
  { 
    id: 'morocco', 
    name: 'Morocco', 
    top: '43%', 
    left: '26%', 
    details: 'Strategic Regional Operations & B2B Partnerships' 
  },
  { 
    id: 'egypt', 
    name: 'Egypt', 
    top: '45%', 
    left: '43.5%', 
    details: 'Global HQ • 7 Nile Cruises • 100+ VIP Fleet' 
  },
  { 
    id: 'uae', 
    name: 'UAE', 
    top: '47%', 
    left: '55%', 
    details: 'Corporate Hub • 50+ VIP Fleet • MICE Experts' 
  },
  { 
    id: 'zanzibar', 
    name: 'Zanzibar (Tanzania)', 
    top: '68%', 
    left: '46%', 
    details: 'Kiwengwa Beach Resort • Safari Logistics' 
  },
];

export default function InteractiveMap() {
  return (
    <section className="w-full py-28 bg-brand-navy relative z-20 overflow-hidden">
      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-brand-teal) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/3 text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-en mb-6 leading-tight">
            Our Global <br/><span className="text-brand-teal">Infrastructure</span>
          </h2>
          <div className="w-16 h-1 bg-brand-gold mb-8 rounded-full"></div>
          
          <p className="text-slate-400 font-en leading-relaxed mb-10 text-lg">
            We do not outsource luxury. Flash Group owns and operates a massive network of hotels, vehicle fleets, and river cruises across Europe, Africa, and the Middle East, giving our B2B partners absolute control over quality and pricing.
          </p>
          
          <ul className="space-y-5">
            <li className="flex items-center gap-4 font-en text-slate-200 font-medium">
              <div className="bg-brand-teal/20 p-2 rounded-full"><CheckCircle className="text-brand-gold w-5 h-5"/></div> 
              Global Headquarters & Hubs
            </li>
            <li className="flex items-center gap-4 font-en text-slate-200 font-medium">
              <div className="bg-brand-teal/20 p-2 rounded-full"><CheckCircle className="text-brand-gold w-5 h-5"/></div> 
              Owned Luxury Resorts
            </li>
            <li className="flex items-center gap-4 font-en text-slate-200 font-medium">
              <div className="bg-brand-teal/20 p-2 rounded-full"><CheckCircle className="text-brand-gold w-5 h-5"/></div> 
              VIP Transport Fleets
            </li>
          </ul>
        </motion.div>

        {/* Right Side: The Interactive Map with Frame */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-2/3 relative p-6 md:p-10 flex items-center justify-center"
        >
          {/* الإطار الزجاجي الخارجي */}
          <div className="absolute inset-0 bg-white/[0.02] border border-white/10 rounded-[1.75rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm pointer-events-none"></div>

          {/* الكونتينر اللي واخد نفس مقاس الصورة بالظبط عشان النقط متتحركش */}
          <div 
            className="relative w-full max-w-full"
            style={{
              maskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)'
            }}
          >
            {/* استخدام صورة حقيقية بدل الخلفية */}
            <img 
              src="/images/Screenshot-Map.png" 
              alt="Global Map" 
              className="w-full h-auto opacity-80 block"
            />
            
            {/* توليد النقاط التفاعلية على الخريطة */}
            {globalFootprint.map((loc, idx) => (
              <div key={idx} className="absolute group cursor-crosshair z-20" style={{ top: loc.top, left: loc.left }}>
                
                {/* النبض الأخضر والأصفر */}
                <div className="relative flex items-center justify-center w-5 h-5 md:w-6 md:h-6 -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-brand-gold border-[1.5px] border-brand-navy"></span>
                </div>
                
                {/* الكارت اللي بيظهر لما تقف بالماوس */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 md:mb-4 w-48 md:w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 md:p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-2 pointer-events-none z-50">
                  <h4 className="font-bold text-brand-navy font-en border-b border-slate-100 pb-2 md:pb-3 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                    <span className="w-2 h-2 rounded-full bg-brand-teal"></span>
                    {loc.name}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 font-en leading-relaxed font-medium">
                    {loc.details}
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 md:border-8 border-transparent border-t-white"></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}