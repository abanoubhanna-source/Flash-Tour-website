'use client';

import { motion } from 'framer-motion';
import { PlaneLanding, Car, Map, ShieldCheck, FileCheck, Building2 } from 'lucide-react';

const stepIcons = [FileCheck, Building2, PlaneLanding, Car, Map, ShieldCheck];
const defaultTitle = "The Flawless Process";
const defaultSteps = ["Visa Processing", "Hotel Booking", "Airport Meet & Transfer", "VIP Transfer", "Guided Excursions", "Safe Journey Home"];

type FlawlessProcessProps = {
  title?: string;
  steps?: string[];
};

export default function FlawlessProcess({ title = defaultTitle, steps = defaultSteps }: FlawlessProcessProps) {
  return (
    <section className="w-full bg-white py-24 relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-navy font-en tracking-tight">
            {title}
          </h2>
        </div>

        {/* Desktop Layout (Horizontal Line) */}
        <div className="relative hidden md:flex justify-between items-start">
          {/* Connecting Line */}
          <div className="absolute top-10 left-[5%] right-[5%] h-px bg-slate-200 z-0"></div>

          {steps.map((step, idx) => {
            const Icon = stepIcons[idx % stepIcons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative z-10 flex flex-col items-center w-32 lg:w-40 group cursor-default"
              >
                <div className="w-20 h-20 rounded-full border-4 border-brand-gold bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <Icon className="w-8 h-8 text-brand-teal" />
                </div>
                <h3 className="text-center font-bold text-brand-navy font-en text-sm lg:text-base leading-snug">
                  {step}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Layout (Vertical Timeline) */}
        <div className="md:hidden flex flex-col items-center space-y-10 relative">
          {/* Connecting Line Vertical */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-200 z-0"></div>

          {steps.map((step, idx) => {
            const Icon = stepIcons[idx % stepIcons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10 flex flex-col items-center bg-white py-2"
              >
                <div className="w-20 h-20 rounded-full border-4 border-brand-gold bg-white flex items-center justify-center mb-3 shadow-sm">
                  <Icon className="w-8 h-8 text-brand-teal" />
                </div>
                <h3 className="text-center font-bold text-brand-navy font-en text-base">
                  {step}
                </h3>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}