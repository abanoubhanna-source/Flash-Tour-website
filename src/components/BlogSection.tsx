// src/components/BlogSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// بيانات تجريبية للمقالات مبنية على خدمات الشركة لتفيد الـ SEO
const articles = [
  {
    id: 1,
    title: "The Ultimate Guide to Zanzibar's Hidden Gems",
    excerpt: "Discover the pristine beaches and cultural heritage of the Indian Ocean's pearl with Flash Zanzibar.",
    category: "Destinations",
    date: "May 15, 2026",
    image: "/images/zanzibar-bg.jpg", // استخدم صورة من صور زنجبار
    slug: "zanzibar-hidden-gems"
  },
  {
    id: 2,
    title: "A Culinary Journey: Inside Rossini's Menu",
    excerpt: "Explore the award-winning Italian and Mediterranean delicacies that have made Rossini a landmark in Cairo.",
    category: "Fine Dining",
    date: "May 10, 2026",
    image: "/images/rossini.jpg", // استخدم صورة لمطعم روسيني
    slug: "rossini-culinary-journey"
  },
  {
    id: 3,
    title: "Why Serenity Nile Cruises Redefine Luxury",
    excerpt: "Experience 7,000 years of living history aboard our premium fleet, blending modern comfort with pharaonic elegance.",
    category: "Cruises",
    date: "May 2, 2026",
    image: "/images/serenity-card.jpg", // استخدم صورة للبواخر
    slug: "serenity-nile-cruises-luxury"
  }
];

export default function BlogSection() {
  return (
    <section className="w-full py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-en tracking-tight mb-4">
              Latest <span className="text-teal-700">Insights</span>
            </h2>
            <p className="text-lg text-slate-500 font-en max-w-xl">
              Travel inspirations, company news, and expert guides from Flash Group.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
            <Link href="/blog" className="group flex items-center gap-2 font-en font-bold text-teal-700 hover:text-slate-900 transition-colors">
              View All Articles 
              <span className="bg-teal-50 text-teal-700 group-hover:bg-slate-100 group-hover:text-slate-900 p-2 rounded-full transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* Article Image */}
              <Link href={`/blog/${article.slug}`} className="relative w-full h-64 overflow-hidden block">
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300"></div>
                {/* Category Tag */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-teal-800 text-xs font-bold font-en px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                  {article.category}
                </div>
              </Link>

              {/* Article Content */}
              <div className="flex flex-col flex-1 p-8">
                {/* Date */}
                <div className="flex items-center gap-2 text-slate-400 mb-4">
                  <CalendarDays className="w-4 h-4" />
                  <time className="text-sm font-en font-medium">{article.date}</time>
                </div>

                {/* Title */}
                <Link href={`/blog/${article.slug}`}>
                  <h3 className="text-2xl font-bold text-slate-900 font-en mb-3 line-clamp-2 group-hover:text-teal-700 transition-colors">
                    {article.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-slate-600 font-en text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>

                {/* Read More */}
                <Link 
                  href={`/blog/${article.slug}`} 
                  className="mt-auto flex items-center gap-2 font-en font-bold text-teal-700 group-hover:text-amber-500 transition-colors"
                >
                  Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}