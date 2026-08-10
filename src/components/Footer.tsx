// src/components/Footer.tsx
'use client';

import { SendHorizontal, MapPin, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
// ضفنا FaFacebookF هنا
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import { trackEmailClick, trackPhoneClick } from '@/lib/analytics';

export default function Footer() {
  const [settings, setSettings] = useState({ phone: '+20226904654', email: 'info@flashtour.travel', address: '30 Thawra St., Heliopolis, Cairo, Egypt', instagram: 'https://www.instagram.com/flash.tour/', facebook: 'https://www.facebook.com/Flashtour.Egypt' });
  useEffect(() => { fetch('/api/settings').then((response) => response.ok ? response.json() : {}).then((value) => { if (value && typeof value === 'object') setSettings((current) => ({ ...current, ...value })); }).catch(() => undefined); }, []);
  return (
    <footer className="w-full bg-brand-navy-deep text-white pt-24 pb-8 font-en relative overflow-hidden border-t border-white/10">
      
      {/* Watermark */}
      <div aria-hidden="true" className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-bold text-white/[0.02] pointer-events-none select-none z-0 whitespace-nowrap">
        FLASH GROUP
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b border-white/10">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="relative w-56 h-14">
              <Image src="/images/logo.png" alt="Flash Group" fill sizes="224px" className="object-contain object-left" />
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Crafting world-class hospitality standards since 1985. Join our global network and let&apos;s redefine the future of tourism together.
            </p>
            <div className="flex gap-4">
              <Link href={settings.facebook || '#'} target="_blank" rel="noopener noreferrer" aria-label="Flash Group on Facebook" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-teal-700 hover:border-teal-700 transition-all duration-300 group">
                <FaFacebookF aria-hidden="true" className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </Link>
              <Link href="https://www.linkedin.com/company/flash-tour/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="Flash Group on LinkedIn" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-teal-700 hover:border-teal-700 transition-all duration-300 group">
                <FaLinkedinIn aria-hidden="true" className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </Link>
              <Link href={settings.instagram || '#'} target="_blank" rel="noopener noreferrer" aria-label="Flash Group on Instagram" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-teal-700 hover:border-teal-700 transition-all duration-300 group">
                <FaInstagram aria-hidden="true" className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-teal-500 font-bold uppercase tracking-[0.2em] text-sm">Headquarters</h4>
            <ul className="space-y-6">
              
              {/* 2. تفعيل العنوان ليفتح خريطة جوجل */}
              <li>
                <a 
                  href="https://maps.app.goo.gl/ytXkNaYWkXZxe3P56" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex gap-4 items-start text-slate-300 hover:text-teal-500 transition-colors group"
                >
                  <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                  <span>{settings.address}</span>
                </a>
              </li>

              {/* 3. تفعيل الإيميل ليفتح تطبيق البريد */}
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  onClick={() => trackEmailClick({ location: 'footer' })}
                  className="flex gap-4 items-center text-slate-300 hover:text-teal-500 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-teal-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{settings.email}</span>
                </a>
              </li>

              {/* 4. تفعيل التليفون ليفتح لوحة الاتصال */}
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  onClick={() => trackPhoneClick({ location: 'footer' })}
                  className="flex gap-4 items-center text-slate-300 hover:text-teal-500 transition-colors group"
                >
                  <Phone className="w-5 h-5 text-teal-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{settings.phone}</span>
                </a>
              </li>

            </ul>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-white font-bold text-2xl">Partner with <span className="text-teal-500">Flash Group</span></h4>
            <div className="relative group">
              <label htmlFor="footer-newsletter-email" className="sr-only">Your corporate email</label>
              <input
                id="footer-newsletter-email"
                type="email"
                placeholder="Your corporate email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-teal-500 transition-all text-white placeholder:text-slate-500"
              />
              <button type="button" aria-label="Subscribe" className="absolute right-3 top-1/2 -translate-y-1/2 bg-teal-700 hover:bg-teal-600 p-3 rounded-xl transition-all shadow-lg">
                <SendHorizontal aria-hidden="true" className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              By submitting, you agree to our corporate privacy policy and partnership terms.
            </p>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Flash Group. All rights reserved.</p>
          <p className="text-xs text-slate-500">Designed &amp; Developed by Flash Software Solutions</p>
        </div>

      </div>
    </footer>
  );
}
