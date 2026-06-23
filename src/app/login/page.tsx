// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا هنربط الـ API بعدين، دلوقتي هنعمل توجيه وهمي للداش بورد
    console.log('Logging in with:', email, password);
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#0F162A] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image src="/images/hospitality-hero.jpg" alt="Background" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#0F162A]/80 backdrop-blur-sm"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/10"
      >
        <div className="text-center mb-10">
          <ShieldCheck className="w-12 h-12 text-[#157670] mx-auto mb-4" />
          <h1 className="text-3xl font-black text-[#0F162A] font-en uppercase tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 font-en text-sm mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0F162A] font-en uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors font-en text-slate-800"
                placeholder="admin@flashgroup.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0F162A] font-en uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors font-en text-slate-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#0F162A] text-white py-4 rounded-xl font-bold font-en uppercase tracking-widest hover:bg-[#157670] transition-colors flex items-center justify-center gap-2 group"
          >
            Secure Login
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400 font-en">
            Protected by Flash Group Security Systems.
          </p>
        </div>
      </motion.div>
    </main>
  );
}