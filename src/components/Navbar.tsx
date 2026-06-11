// src/components/Navbar.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const operations = [
  { name: 'Egypt Operations', href: '/destinations#egypt' },
  { name: 'UAE Corporate Hub', href: '/destinations#uae' },
  { name: 'Zanzibar Assets', href: '/destinations#zanzibar' },
  { name: 'Italy Collection', href: '/destinations#italy' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOperationsHovered, setIsOperationsHovered] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          <Link href="/" className="flex-shrink-0 relative w-56 h-14 cursor-pointer">
            <Image src="/images/logo.png" alt="Flash Group" fill className="object-contain object-left" priority />
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className="font-en text-slate-800 hover:text-teal-700 transition-colors font-medium">Home</Link>
            <Link href="/about" className="font-en text-slate-800 hover:text-teal-700 transition-colors font-medium">The Group</Link>
            <Link href="/hospitality" className="font-en text-slate-800 hover:text-teal-700 transition-colors font-medium">Hospitality</Link>
            <Link href="/services" className="font-en text-slate-800 hover:text-teal-700 transition-colors font-medium">Enterprise Solutions</Link>
            
            {/* Operations Dropdown */}
            <div 
              className="relative h-24 flex items-center"
              onMouseEnter={() => setIsOperationsHovered(true)}
              onMouseLeave={() => setIsOperationsHovered(false)}
            >
              <Link href="/destinations" className="font-en text-slate-800 hover:text-teal-700 transition-colors font-medium flex items-center gap-1">
                Global Operations <ChevronDown className={`w-4 h-4 transition-transform ${isOperationsHovered ? 'rotate-180' : ''}`} />
              </Link>

              <AnimatePresence>
                {isOperationsHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                    className="absolute top-24 -left-8 w-72 bg-white shadow-2xl border border-slate-100 rounded-2xl overflow-hidden py-2"
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
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-900">
              {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-b border-slate-100 px-6 py-6 flex flex-col space-y-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium">Home</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium">The Group</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium">Enterprise Solutions</Link>
            <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium">Global Operations</Link>
            <Link href="/brands" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium">Portfolio</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-6 py-3 bg-slate-900 text-white rounded-full font-medium">Partner With Us</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}