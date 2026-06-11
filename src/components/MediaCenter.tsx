// src/components/MediaCenter.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// بيانات افتراضية لأخبار الشركة (تقدر تعدلها بسهولة بعدين)
const latestNews = [
  { 
    id: 1,
    date: "Oct 12, 2025", 
    title: "Flash Group Acquires Two New 5-Star Properties in Sardinia, Italy", 
    category: "Acquisitions",
    img: "/images/news-1.jpg"
  },
  { 
    id: 2,
    date: "Sep 28, 2025", 
    title: "Expanding the VIP Fleet: 50 New Mercedes-Benz V-Class Added in Dubai", 
    category: "Fleet & Mobility",
    img: "/images/news-2.jpg"
  },
  { 
    id: 3,
    date: "Aug 15, 2025", 
    title: "Awarded 'Best DMC in the Middle East' at the Global MICE Awards", 
    category: "Awards",
    img: "/images/news-3.jpg"
  },
];

export default function MediaCenter() {
  return (
    <section className="w-full bg-slate-50 py-24 border-t border-slate-200 relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[#157670] font-bold tracking-[0.2em] uppercase text-sm block mb-3 font-en flex items-center gap-2">
              <Newspaper className="w-5 h-5" /> Corporate Updates
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0F162A] font-en mb-2">
              Media <span className="text-[#157670]">Center</span>
            </h2>
            <p className="text-slate-500 font-en text-lg mt-4 max-w-xl">
              Stay informed with our latest press releases, strategic acquisitions, and industry insights.
            </p>
          </div>
          
          <Link 
            href="/media" 
            className="group px-6 py-3 rounded-full border-2 border-slate-300 font-bold font-en text-[#0F162A] hover:border-[#157670] hover:bg-[#157670] hover:text-white transition-all duration-300 flex items-center gap-2 w-fit"
          >
            View Press Room 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestNews.map((news, idx) => (
            <motion.div 
              key={news.id} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.15 }} 
              className="group cursor-pointer bg-white rounded-[2rem] p-4 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="h-56 bg-slate-100 rounded-[1.5rem] mb-6 overflow-hidden relative">
                <Image 
                  src={news.img} 
                  alt={news.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#157670] uppercase tracking-wider font-en shadow-sm">
                  {news.category}
                </div>
              </div>
              
              {/* Content */}
              <div className="px-2 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-en mb-3 font-bold uppercase tracking-wider">
                  <span>{news.date}</span> 
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span> 
                  <span>Press Release</span>
                </div>
                
                <h4 className="text-xl font-bold text-[#0F162A] font-en leading-snug group-hover:text-[#157670] transition-colors line-clamp-3 mb-6">
                  {news.title}
                </h4>
                
                {/* Read More Link (pushes to bottom) */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <span className="text-[#F1B820] font-bold font-en flex items-center gap-2 text-sm group-hover:translate-x-2 transition-transform duration-300">
                    Read Full Story <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}