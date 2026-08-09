// src/components/Navbar.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// تم تحديث المسميات والروابط لتوجيه المستخدم للصفحات الفرعية الصحيحة
const operations = [
  { name: 'Egypt', href: '/destinations/egypt' },
  { name: 'United Arab Emirates', href: '/destinations/uae' },
  { name: 'Zanzibar', href: '/destinations/zanzibar' },
  { name: 'Italy', href: '/destinations/italy' },
  { name: 'Morocco', href: '/destinations/morocco' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOperationsHovered, setIsOperationsHovered] = useState(false);

  const isCmsRoute =
    pathname.startsWith('/dashboard') ||
    pathname === '/login' ||
    pathname.startsWith('/login/') ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/auth/');

  if (isCmsRoute) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          <Link href="/" aria-label="Flash Group — Home" className="flex-shrink-0 relative w-56 h-14 cursor-pointer">
            <Image src="/images/logo.png" alt="Flash Group" fill sizes="224px" className="object-contain object-left" loading="eager" fetchPriority="high" />
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className="font-en text-slate-800 hover:text-teal-700 transition-colors font-medium">Home</Link>
            <Link href="/about" className="font-en text-slate-800 hover:text-teal-700 transition-colors font-medium">About Us</Link>
            <Link href="/hospitality" className="font-en text-slate-800 hover:text-teal-700 transition-colors font-medium">Hospitality</Link>
            <Link href="/services" className="font-en text-slate-800 hover:text-teal-700 transition-colors font-medium">Service</Link>
            
            {/* Operations Dropdown */}
            <div 
              className="relative h-24 flex items-center"
              onMouseEnter={() => setIsOperationsHovered(true)}
              onMouseLeave={() => setIsOperationsHovered(false)}
            >
              <Link href="/destinations" className="font-en text-slate-800 hover:text-teal-700 transition-colors font-medium flex items-center gap-1">
                Destinations <ChevronDown className={`w-4 h-4 transition-transform ${isOperationsHovered ? 'rotate-180' : ''}`} />
              </Link>

              <AnimatePresence>
                {isOperationsHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                    className="absolute top-24 -left-8 w-60 bg-white shadow-2xl border border-slate-100 rounded-2xl overflow-hidden py-2"
                  >
                    {operations.map((op, idx) => (
                      <Link key={idx} href={op.href} className="block px-6 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-en font-medium transition-colors">
                        {op.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/contact" className="font-en px-8 py-3 bg-slate-900 text-white rounded-full hover:bg-teal-700 transition-all shadow-lg font-medium">
              Partner With Us
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              className="text-slate-900"
            >
              {isMobileMenuOpen ? <X className="w-8 h-8" aria-hidden="true" /> : <Menu className="w-8 h-8" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div id="mobile-nav-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-b border-slate-100 px-6 py-6 flex flex-col space-y-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium">Home</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium">About Us</Link>
            {/* تم إضافة Hospitality وتعديل المسميات لتطابق نسخة الديسكتوب */}
            <Link href="/hospitality" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium">Hospitality</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium">Services</Link>
            <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium">Destinations</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-6 py-3 bg-slate-900 text-white rounded-full font-medium">Partner With Us</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
