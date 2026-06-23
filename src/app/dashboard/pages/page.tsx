// src/app/dashboard/pages/page.tsx
'use client';


import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, ImageIcon, FileText, Eye, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PagesContentCMS() {
  const [activeSubTab, setActiveSubTab] = useState('home');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // داتا وهمية تحاكي محتوى الصفحة الرئيسية (Home Page) اللي الأدمن بيتحكم فيها
  const [homeContent, setHomeContent] = useState({
    heroTitle: 'Everywhere You Seek Excellence.',
    heroSubtitle: 'Our hospitality is a different breed. We are not just a service provider; we are the destination.',
    heroBtnText: 'Partner With Us',
    heroImage: '/images/hospitality-hero.jpg',
    
    introTitle: 'Hospitality Without Borders',
    introDesc: 'From the majestic Nile and the vibrant Red Sea to the exotic Indian Ocean—wherever luxury is demanded, we are there.',
  });

  // دالة التعامل مع تغيير النصوص
  const handleTextChange = (key: string, value: string) => {
    setHomeContent(prev => ({ ...prev, [key]: value }));
  };

  // دالة التعامل مع رفع وتغيير الصور (زرار الـ Upload الذكي)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // تحويل الملف لرابط وهمي مؤقت (Object URL) عشان يظهر في المعاينة فوراً
      const previewUrl = URL.createObjectURL(file);
      setHomeContent(prev => ({ ...prev, heroImage: previewUrl }));
    }
  };

  // دالة الحفظ
  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // محاكاة الاتصال بالـ API لحفظ البيانات
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 relative">
      
      {/* Success Alert */}
      {showSuccessAlert && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="fixed top-28 right-8 z-50 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-[#F1B820]" />
          Website content updated successfully!
        </motion.div>
      )}

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0F162A] uppercase tracking-tight">Pages Content</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Control every word, title, and media asset displayed on the website.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-3 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors">
            <Eye className="w-4 h-4" /> Live Preview
          </Link>
          <button 
            onClick={handleSavePage}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#0F162A] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#157670] transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      {/* Pages Selection Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveSubTab('home')} className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeSubTab === 'home' ? 'border-[#157670] text-[#157670]' : 'border-transparent text-slate-400 hover:text-[#0F162A]'}`}>
          Home Page
        </button>
        <button onClick={() => setActiveSubTab('about')} className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeSubTab === 'about' ? 'border-[#157670] text-[#157670]' : 'border-transparent text-slate-400 hover:text-[#0F162A]'}`}>
          About (The Group)
        </button>
        <button onClick={() => setActiveSubTab('services')} className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeSubTab === 'services' ? 'border-[#157670] text-[#157670]' : 'border-transparent text-slate-400 hover:text-[#0F162A]'}`}>
          Enterprise Solutions
        </button>
      </div>

      {/* Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Forms Management */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
          
          {/* Section 1: Hero Section Control */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-[#157670]" />
              <h3 className="text-base font-black text-[#0F162A] uppercase tracking-wider">Main Hero Section</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hero Main Title</label>
                <input 
                  type="text" 
                  value={homeContent.heroTitle}
                  onChange={(e) => handleTextChange('heroTitle', e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors font-en text-[#0F162A] font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hero Subtitle / Description</label>
                <textarea 
                  value={homeContent.heroSubtitle}
                  onChange={(e) => handleTextChange('heroSubtitle', e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors font-en text-slate-600 leading-relaxed h-28 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Call-To-Action Button Text</label>
                  <input 
                    type="text" 
                    value={homeContent.heroBtnText}
                    onChange={(e) => handleTextChange('heroBtnText', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#157670] font-en text-sm font-bold text-slate-800"
                  />
                </div>

                {/* زرار اختيار الصورة الذكي (Smart Image Upload Input) */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hero Background Image</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="hero-bg-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden" // مخفي عشان نتحكم في الستايل براحتنا
                    />
                    <label 
                      htmlFor="hero-bg-upload"
                      className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-200 border-dashed rounded-2xl cursor-pointer hover:border-[#157670] hover:bg-[#157670]/5 transition-all font-en font-bold text-sm text-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                        Choose / Change Image
                      </span>
                      <Upload className="w-4 h-4 text-[#157670]" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Welcome Intro */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileText className="w-5 h-5 text-[#157670]" />
              <h3 className="text-base font-black text-[#0F162A] uppercase tracking-wider">Welcome Intro Section</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Intro Section Tag</label>
                <input 
                  type="text" 
                  value={homeContent.introTitle}
                  onChange={(e) => handleTextChange('introTitle', e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-en text-sm text-slate-800 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Intro Main Paragraph</label>
                <textarea 
                  value={homeContent.introDesc}
                  onChange={(e) => handleTextChange('introDesc', e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-en text-sm text-slate-600 h-24 resize-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Realtime UI Device Preview */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Realtime CMS Preview</p>
          
          <div className="bg-[#0F162A] w-full rounded-[2.5rem] p-3 shadow-2xl border border-slate-800 sticky top-28">
            {/* Mock Header */}
            <div className="bg-white/10 h-8 rounded-t-[1.8rem] mb-2 flex items-center px-4 justify-between">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
              <div className="w-24 h-2 bg-white/20 rounded-full"></div>
            </div>

            {/* Mock Hero Component Screen */}
            <div className="relative h-[400px] w-full rounded-[1.5rem] overflow-hidden flex flex-col items-center justify-center text-center p-6 bg-slate-950">
              {/* الصورة بتتغير ديناميكياً هنا بناءً على اختيار اليوزر من الزرار */}
              <Image 
                src={homeContent.heroImage} 
                alt="Preview Back" 
                fill 
                className="object-cover opacity-40 transition-all duration-500"
                unoptimized={homeContent.heroImage.startsWith('blob:')} // لتفادي مشاكل الأوبجكت url في Next Image
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F162A]/90"></div>
              
              {/* التكست بيتغير ديناميكياً فوراً مع الكتابة */}
              <div className="relative z-10 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#157670]/20 text-[#157670] border border-[#157670]/30 text-[9px] font-bold uppercase tracking-widest">
                  {homeContent.introTitle}
                </span>
                <h4 className="text-xl font-black text-white font-en leading-tight line-clamp-2">
                  {homeContent.heroTitle}
                </h4>
                <p className="text-[11px] text-slate-300 font-en leading-relaxed max-w-xs mx-auto line-clamp-3">
                  {homeContent.heroSubtitle}
                </p>
                <div className="inline-block bg-[#157670] text-white text-[10px] font-bold px-5 py-2.5 rounded-full shadow-md">
                  {homeContent.heroBtnText}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}