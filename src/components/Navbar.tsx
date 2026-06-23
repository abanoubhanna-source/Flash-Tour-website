// src/components/Navbar.tsx  (أو Header.tsx حسب اسم الملف عندك)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const pathname = usePathname();

  // تأثير تغيير لون الناف بار مع السكرول
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // الروابط الأساسية
  const mainLinks = [
    { name: 'Home', href: '/' },
    { name: 'The Group', href: '/about' },
    { name: 'Hospitality', href: '/hospitality' },
    { name: 'Enterprise Solutions', href: '/services' },
  ];

  // روابط القائمة المنسدلة للعمليات العالمية
  const globalOperationsLinks = [
    { name: 'Egypt', href: '/destinations/egypt' },
    { name: 'United Arab Emirates', href: '/destinations/uae' },
    { name: 'Zanzibar', href: '/destinations/zanzibar' },
    { name: 'Italy', href: '/destinations/italy' },
    { name: 'Morocco', href: '/destinations/morocco' }, // لو ضفت صفحة المغرب لاحقاً
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-slate-200 py-3 shadow-sm' 
          : 'bg-[#eef2f3] md:bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="relative z-50 flex items-center gap-2">
          <span className={`text-2xl font-black font-en tracking-tighter ${isScrolled ? 'text-[#0F162A]' : 'text-[#0F162A]'}`}>
            FLASH<span className="text-[#157670]">GROUP</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {mainLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-[15px] font-bold font-en transition-colors hover:text-[#157670] ${
                pathname === link.href ? 'text-[#157670]' : 'text-[#0F162A]'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Global Operations Dropdown */}
          <div className="relative group flex items-center h-full py-2">
            <div className="flex items-center gap-1 cursor-pointer">
              {/* الكلمة نفسها بتودي للصفحة الرئيسية للوجهات */}
              <Link 
                href="/destinations"
                className={`text-[15px] font-bold font-en transition-colors hover:text-[#157670] ${
                  pathname.startsWith('/destinations') ? 'text-[#157670]' : 'text-[#0F162A]'
                }`}
              >
                Global Operations
              </Link>
              {/* السهم بس للعرض وفتح القائمة */}
              <ChevronDown className="w-4 h-4 text-[#0F162A] group-hover:text-[#157670] transition-transform duration-300 group-hover:rotate-180" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-slate-100 flex flex-col z-50 transform origin-top-left group-hover:translate-y-0 translate-y-2">
              <div className="p-2 space-y-1">
                {globalOperationsLinks.map((subLink) => (
                  <Link
                    key={subLink.name}
                    href={subLink.href}
                    className="block px-4 py-3 text-sm font-bold font-en text-slate-600 hover:text-[#157670] hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    {subLink.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Partner With Us Button (Desktop) */}
        <div className="hidden lg:block">
          <Link 
            href="/contact" 
            className="bg-[#0F162A] text-white px-8 py-3.5 rounded-full font-bold font-en text-[15px] hover:bg-[#157670] transition-colors shadow-lg hover:shadow-xl"
          >
            Partner With Us
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden relative z-50 text-[#0F162A] p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-100 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col px-6 py-8 space-y-6">
              {mainLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-black font-en ${
                    pathname === link.href ? 'text-[#157670]' : 'text-[#0F162A]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Dropdown for Global Operations */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <Link 
                    href="/destinations"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl font-black font-en ${
                      pathname.startsWith('/destinations') ? 'text-[#157670]' : 'text-[#0F162A]'
                    }`}
                  >
                    Global Operations
                  </Link>
                  <button 
                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    className="p-2 bg-slate-50 rounded-full"
                  >
                    <ChevronDown className={`w-6 h-6 text-[#0F162A] transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                <AnimatePresence>
                  {isMobileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col pl-4 mt-4 border-l-2 border-slate-100 space-y-4 overflow-hidden"
                    >
                      {globalOperationsLinks.map((subLink) => (
                        <Link
                          key={subLink.name}
                          href={subLink.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-lg font-bold font-en text-slate-500 hover:text-[#157670]"
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full bg-[#0F162A] text-white px-8 py-4 rounded-full font-bold font-en text-lg"
                >
                  Partner With Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}