// src/components/StatsAndCerts.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const stats = [
  { number: "40+", label: "Years of Excellence" },
  { number: "1000+", label: "Global Experts" },
  { number: "100+", label: "Owned Fleet Assets" },
  { number: "5", label: "Strategic Markets" },
];

// TODO: confirm public/images/certifications/iso-9001.png and iata.png are the final official logo files before shipping.
const certifications = [
  { name: "ISO 9001:2015", desc: "Quality Management System", logo: "/images/certifications/iso-9001.png" },
  { name: "IATA Accredited", desc: "International Air Transport Association", logo: "/images/certifications/iata.png" },
];

export default function StatsAndCerts() {
  return (
    <section className="w-full bg-white pt-20 pb-24 relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* الجزء الأول: الأرقام (Stats) */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy font-en mb-2">
            Scale That <span className="text-brand-teal">Builds Trust</span>
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-24">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-5xl md:text-6xl font-bold text-brand-teal font-en mb-3 drop-shadow-sm">
                {stat.number}
              </span>
              <span className="text-sm md:text-base text-slate-600 font-en font-bold uppercase tracking-wider text-center">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* الجزء الثاني: الاعتمادات (Certifications) */}
        <div className="relative p-10 md:p-16 rounded-[1.5rem] bg-brand-navy overflow-hidden shadow-2xl">
          {/* لمسة خلفية خفيفة */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-brand-gold) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h3 className="text-3xl font-bold text-white font-en mb-4">Certified <br/><span className="text-brand-gold">Excellence</span></h3>
              <p className="text-slate-400 font-en leading-relaxed">
                Operating under certified international standards to give partners uncompromised quality, safety, and operational confidence.
              </p>
            </div>

            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certifications.map((cert, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: 20 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: idx * 0.1 }} 
                  className="flex items-start gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-16 h-16 shrink-0 bg-white rounded-xl p-2 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image src={cert.logo} alt={`${cert.name} certification logo`} fill className="object-contain" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-en mb-1">{cert.name}</h4>
                    <p className="text-xs text-slate-400 font-en tracking-wide">{cert.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}