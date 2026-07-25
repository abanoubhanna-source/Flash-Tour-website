// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MousePointerClick, Clock, BarChart3, 
  TrendingUp, Globe2, Building, Briefcase 
} from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ brands: 0, destinations: 0, services: 0 });

  // جلب أعداد الداتا عشان نعرضها في الإحصائيات زي ما كان في كودك
  useEffect(() => {
    Promise.all([
      fetch('/api/services').then(res => res.ok ? res.json() : []),
      fetch('/api/destinations').then(res => res.ok ? res.json() : []),
      fetch('/api/brands').then(res => res.ok ? res.json() : [])
    ]).then(([servicesRes, destRes, brandsRes]) => {
      setStats({
        services: servicesRes.length || 0,
        destinations: destRes.length || 0,
        brands: brandsRes.length || 0
      });
    }).catch(() => undefined); // عشان لو الـ API لسه مش شغال ميعملش كراش
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-8"
    >
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#157670]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[#157670]/10 text-[#157670] rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Total Visitors</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-[#0F162A]">24,592</span>
              <span className="text-emerald-500 text-sm font-bold flex items-center mb-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-4">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Page Views</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-[#0F162A]">89,201</span>
              <span className="text-emerald-500 text-sm font-bold flex items-center mb-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3 mr-1" /> +8%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Avg. Session</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-[#0F162A]">4m 12s</span>
            </div>
          </div>
        </motion.div>

        {/* Database Overview Card - Ultra Premium */}
        <motion.div variants={itemVariants} className="bg-[#0F162A] text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                <BarChart3 className="w-6 h-6 text-[#F1B820]" />
              </div>
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">System Records</h3>
            </div>
            
            <div className="flex items-end justify-between mt-2">
              <div className="text-center">
                <span className="block text-2xl font-black text-white">{stats.brands}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1"><Building className="w-3 h-3" /> Brands</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <span className="block text-2xl font-black text-white">{stats.destinations}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1"><Globe2 className="w-3 h-3" /> Dests</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <span className="block text-2xl font-black text-white">{stats.services}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1"><Briefcase className="w-3 h-3" /> Servs</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Regions Traffic */}
        <motion.div variants={itemVariants} className="col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-[#0F162A] uppercase tracking-tight mb-8 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#157670]" /> Traffic By Region
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Europe (Germany, Italy, UK)</span><span>45%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-[#157670] h-2 rounded-full" style={{ width: '45%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Middle East (UAE, KSA)</span><span>30%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-[#F1B820] h-2 rounded-full" style={{ width: '30%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Asia (India, China)</span><span>15%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Others</span><span>10%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-slate-300 h-2 rounded-full" style={{ width: '10%' }}></div></div>
            </div>
          </div>
        </motion.div>

        {/* Most Visited Pages */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-[#0F162A] uppercase tracking-tight mb-8 flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-[#F1B820]" /> Top Pages
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-[#157670]/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#157670]/10 text-[#157670] flex items-center justify-center font-bold text-xs">1</div>
                <span className="font-bold text-[#0F162A] text-sm">/brands</span>
              </div>
              <span className="text-sm font-bold text-[#157670]">12.4k</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-[#157670]/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F1B820]/10 text-[#F1B820] flex items-center justify-center font-bold text-xs">2</div>
                <span className="font-bold text-[#0F162A] text-sm">/destinations</span>
              </div>
              <span className="text-sm font-bold text-[#157670]">8.2k</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-[#157670]/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">3</div>
                <span className="font-bold text-[#0F162A] text-sm">/services</span>
              </div>
              <span className="text-sm font-bold text-[#157670]">5.1k</span>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-6 text-center">
            * Google Analytics Integration Pending
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}
