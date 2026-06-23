// src/app/dashboard/page.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Users, MousePointerClick, Clock, BarChart3, 
  TrendingUp, Globe2, Building, Briefcase 
} from 'lucide-react';

export default function DashboardOverview() {
  
  // أنيميشن لدخول الكروت
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      
      {/* 1. Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Visitors Card */}
        <motion.div variants={item} className="bg-white p-6 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#157670]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Total Visitors</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-[#0F162A]">24,592</span>
              <span className="text-emerald-600 text-xs font-black flex items-center mb-1.5">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Page Views Card */}
        <motion.div variants={item} className="bg-white p-6 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#F1B820]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                <MousePointerClick className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Page Views</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-[#0F162A]">89,201</span>
              <span className="text-emerald-600 text-xs font-black flex items-center mb-1.5">
                <TrendingUp className="w-3 h-3 mr-1" /> +8%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Session Card */}
        <motion.div variants={item} className="bg-white p-6 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Avg. Session</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-[#0F162A]">4m 12s</span>
            </div>
          </div>
        </motion.div>

        {/* System Records Card (Dark) */}
        <motion.div variants={item} className="bg-[#1c2331] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.png')] bg-repeat mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 text-[#F1B820] rounded-full flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-300 font-bold text-xs uppercase tracking-widest mb-4">System Records</h3>
            
            <div className="flex items-center justify-between">
              <div className="text-center">
                <span className="block text-2xl font-black">4</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 flex justify-center gap-1"><Building className="w-3 h-3" /> Brands</span>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center">
                <span className="block text-2xl font-black">4</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 flex justify-center gap-1"><Globe2 className="w-3 h-3" /> Dests</span>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center">
                <span className="block text-2xl font-black">13</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 flex justify-center gap-1"><Briefcase className="w-3 h-3" /> Servs</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Charts & Lists Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Traffic By Region */}
        <motion.div variants={item} className="col-span-2 bg-white p-8 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100">
          <h3 className="text-sm font-black text-[#0F162A] uppercase tracking-widest mb-8 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#157670]" /> Traffic By Region
          </h3>
          <div className="space-y-8">
            {/* Europe */}
            <div>
              <div className="flex justify-between text-xs font-black text-[#0F162A] mb-3">
                <span>Europe <span className="text-slate-400 font-medium">(Germany, Italy, UK)</span></span>
                <span>45%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#157670] h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            {/* Middle East */}
            <div>
              <div className="flex justify-between text-xs font-black text-[#0F162A] mb-3">
                <span>Middle East <span className="text-slate-400 font-medium">(UAE, KSA)</span></span>
                <span>30%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#F1B820] h-full rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            {/* Asia */}
            <div>
              <div className="flex justify-between text-xs font-black text-[#0F162A] mb-3">
                <span>Asia <span className="text-slate-400 font-medium">(India, China)</span></span>
                <span>15%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            {/* Others */}
            <div>
              <div className="flex justify-between text-xs font-black text-[#0F162A] mb-3">
                <span>Others</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-slate-300 h-full rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Pages */}
        <motion.div variants={item} className="bg-white p-8 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
          <h3 className="text-sm font-black text-[#0F162A] uppercase tracking-widest mb-8 flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-[#F1B820]" /> Top Pages
          </h3>
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-[#157670]/10 text-[#157670] flex items-center justify-center font-black text-[10px]">1</div>
                <span className="font-bold text-[#0F162A] text-xs">/brands</span>
              </div>
              <span className="text-xs font-black text-[#157670]">12.4k</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-[#F1B820]/10 text-[#F1B820] flex items-center justify-center font-black text-[10px]">2</div>
                <span className="font-bold text-[#0F162A] text-xs">/destinations</span>
              </div>
              <span className="text-xs font-black text-[#157670]">8.2k</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-[10px]">3</div>
                <span className="font-bold text-[#0F162A] text-xs">/services</span>
              </div>
              <span className="text-xs font-black text-[#157670]">5.1k</span>
            </div>
          </div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mt-6 text-center font-bold">
            * Google Analytics Integration Pending
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}