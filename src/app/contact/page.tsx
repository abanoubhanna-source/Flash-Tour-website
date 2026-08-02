// src/app/contact/page.tsx
'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe2, SendHorizontal, Building2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";
import { trackContactFormSubmit, trackEmailClick } from '@/lib/analytics';
import { usePublishedPage } from "@/lib/cms/pages/use-published-page";

const defaultOffices = [
  { id: "cairo", region: "Global Headquarters", city: "Cairo, Egypt", address: "30 Thawra St., Heliopolis", email: "info@flashtour.travel", phone: "+202 26904654" },
  { id: "dubai", region: "Gulf Region", city: "Dubai, UAE", address: "Business Bay, Executive Towers", email: "uae@flashtour.travel", phone: "+971 4 123 4567" },
  { id: "zanzibar", region: "Indian Ocean", city: "Zanzibar, Tanzania", address: "Stone Town, Coastal Road", email: "zanzibar@flashtour.travel", phone: "+255 24 123 456" },
];

const defaultTrustBadges = [
  { label: "Global Reach", value: "Operating in 5+ countries" },
  { label: "Certified Excellence", value: "ISO & IATA Certified" },
];

export default function ContactPage() {
  const cms = usePublishedPage('/contact');
  const offices = cms?.hero?.contactOffices?.length ? cms.hero.contactOffices : defaultOffices;
  const panel = cms?.hero?.contactPanel;
  const trustBadges = panel?.trustBadges?.length ? panel.trustBadges : defaultTrustBadges;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full bg-slate-50 overflow-hidden">

      {/* 1. Elegant Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center bg-slate-950">
        <div className="absolute inset-0 z-0">
          <Image
            src={cms?.hero?.image.url || "/images/office-1.jpg"}
            alt={cms?.hero?.image.alt || "Flash Group Headquarters"}
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold font-bold text-xs uppercase tracking-[0.2em] mb-6 font-en">
              <span className="h-px w-4 bg-brand-gold" /> {cms?.hero?.eyebrow || "Global Presence"}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-en mb-4 tracking-tight">
              {cms?.hero?.title || "Partner With"} <span className="text-teal-500">{cms?.hero?.accentTitle || "Flash Group"}</span>
            </h1>
            <p className="text-xl text-slate-300 font-en leading-relaxed">
              {cms?.hero?.subtitle || "For tour operators, corporate entities, event planners, and hospitality partners seeking direct access to Flash Group infrastructure."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Contact Cards */}
      <section className="w-full py-20 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, idx) => (
              <motion.div
                key={office.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-teal-700 transition-colors duration-300">
                  <Building2 className="w-6 h-6 text-teal-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest font-en mb-2">{office.region}</h2>
                <h3 className="text-2xl font-bold text-slate-900 font-en mb-6">{office.city}</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-600 font-en text-sm">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>{office.address}</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-en text-sm">
                    <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                    <a href={`mailto:${office.email}`} onClick={() => trackEmailClick({ location: 'contact_office_card', office: office.city })} className="hover:text-teal-700 transition-colors">{office.email}</a>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-en text-sm">
                    <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>{office.phone}</span>
                  </li>
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Partnership Form Section */}
      <section className="w-full py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-[1.75rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
            
            {/* Left Side: Info & Trust */}
            <div className="lg:w-5/12 bg-slate-900 p-12 md:p-16 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-bold font-en mb-6">{panel?.heading || "Access the Group Network"}</h2>
                <p className="text-slate-400 font-en leading-relaxed mb-10 text-lg">
                  {panel?.intro || "Tell us what your organization needs. Our corporate relations team will route your inquiry to the right business unit within 24 hours."}
                </p>

                <div className="space-y-6">
                  {trustBadges.map((badge, index) => {
                    const Icon = index === 0 ? Globe2 : ShieldCheck;
                    return (
                      <div key={badge.label} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <Icon className={`w-5 h-5 ${index === 0 ? "text-teal-400" : "text-amber-400"}`} />
                        </div>
                        <div>
                          <p className="font-en font-bold">{badge.label}</p>
                          <p className="text-sm text-slate-400 font-en">{badge.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link href="/partner-portal" className="mt-10 inline-flex items-center gap-2 text-sm font-bold font-en text-teal-400 hover:text-white transition-colors">
                  Looking for a full B2B proposal? Access the Partner Portal
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Side: The Form */}
            <div className="lg:w-7/12 p-12 md:p-16">
              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); trackContactFormSubmit(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="contact-first-name" className="text-sm font-bold text-slate-700 font-en">First Name *</label>
                    <input id="contact-first-name" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-en text-slate-900" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-last-name" className="text-sm font-bold text-slate-700 font-en">Last Name *</label>
                    <input id="contact-last-name" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-en text-slate-900" placeholder="Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-sm font-bold text-slate-700 font-en">Corporate Email *</label>
                    <input id="contact-email" type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-en text-slate-900" placeholder="john@company.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-phone" className="text-sm font-bold text-slate-700 font-en">Phone Number</label>
                    <input id="contact-phone" type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-en text-slate-900" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-inquiry-type" className="text-sm font-bold text-slate-700 font-en">Inquiry Type *</label>
                  <select id="contact-inquiry-type" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-en text-slate-900 appearance-none">
                    <option value="">Select a topic...</option>
                    <option value="partnership">B2B Partnership</option>
                    <option value="booking">Corporate Booking (Cruises/Hotels)</option>
                    <option value="fleet">Fleet & Transportation Services</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-sm font-bold text-slate-700 font-en">Message *</label>
                  <textarea id="contact-message" required rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-en text-slate-900 resize-none" placeholder="Tell us about your business needs..."></textarea>
                </div>

                <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-3 group shadow-xl shadow-teal-700/20 font-en text-lg">
                  Submit Inquiry 
                  <SendHorizontal className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}