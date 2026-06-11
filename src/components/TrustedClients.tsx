// src/components/TrustedClients.tsx
'use client';

import { ShieldCheck } from 'lucide-react';

const trustedClients = [
  "Central Bank of Egypt", 
  "Ministry of Youth & Sports", 
  "Vodafone Corporate", 
  "Emirates NBD", 
  "Saudi Aramco", 
  "Samsung Middle East"
];

export default function TrustedClients() {
  return (
    <section className="w-full bg-slate-50 py-10 border-b border-slate-200 relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 overflow-hidden">
        <p className="text-center text-slate-400 font-en text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-8">
          Trusted by Global Leaders & Ministries
        </p>
        
        {/* في المستقبل ممكن تبدل الأسماء دي بصور لوجوهات (img) بنفس الـ Classes دي */}
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {trustedClients.map((client, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2 text-slate-700 font-bold font-en text-lg hover:text-[#157670] transition-colors cursor-default"
            >
              <ShieldCheck className="w-6 h-6 text-[#157670]" /> 
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}