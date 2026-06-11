// src/app/partner-portal/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Briefcase, Building2, Globe2, Mail, Phone, MapPin, Send, ShieldCheck, Star } from 'lucide-react';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar"; // افترضت إن عندك كومبوننت للنافبار

export default function PartnerPortal() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-slate-50 overflow-hidden">
      {/* 1. Header Section */}
      <section className="relative w-full py-24 bg-[#0F162A] overflow-hidden mt-16 md:mt-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#157670 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#F1B820] font-bold tracking-[0.2em] uppercase text-sm block mb-4 font-en flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5" /> Global B2B Network
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white font-en mb-6 tracking-tight">
              Partner With <span className="text-[#157670]">The Empire</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-en max-w-2xl mx-auto leading-relaxed">
              Join an elite network of global travel agencies and corporate event organizers. Gain direct access to our contracted rates, owned assets, and unparalleled DMC expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Portal Area (Form & Info) */}
      <section className="w-full py-16 relative z-20 -mt-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Benefits & Contacts */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 flex flex-col gap-8"
            >
              {/* Value Proposition Box */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl">
                <h3 className="text-2xl font-bold text-[#0F162A] font-en mb-6">Why Partner With Us?</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="bg-[#157670]/10 p-3 rounded-xl mt-1"><Building2 className="w-6 h-6 text-[#157670]" /></div>
                    <div>
                      <h4 className="font-bold text-[#0F162A] font-en text-lg">Asset Ownership</h4>
                      <p className="text-slate-500 text-sm font-en mt-1">Direct access to our owned hotels, Nile cruises, and VIP fleets without third-party markups.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-[#F1B820]/10 p-3 rounded-xl mt-1"><ShieldCheck className="w-6 h-6 text-[#F1B820]" /></div>
                    <div>
                      <h4 className="font-bold text-[#0F162A] font-en text-lg">Financial Security</h4>
                      <p className="text-slate-500 text-sm font-en mt-1">Fully insured operations, flexible corporate credit lines, and IATA certified financial stability.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-[#0F162A]/5 p-3 rounded-xl mt-1"><Star className="w-6 h-6 text-[#0F162A]" /></div>
                    <div>
                      <h4 className="font-bold text-[#0F162A] font-en text-lg">Dedicated Account Manager</h4>
                      <p className="text-slate-500 text-sm font-en mt-1">A single point of contact available 24/7 to manage your VIP clients and MICE events.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Quick Contact Info */}
              <div className="bg-[#0F162A] p-8 rounded-[2rem] text-white shadow-xl">
                <h3 className="text-xl font-bold font-en mb-6 text-[#F1B820]">Corporate Desks</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300 font-en">
                    <MapPin className="w-5 h-5 text-[#157670]" /> <span>HQ: 30 Thawra St., Heliopolis, Cairo</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 font-en">
                    <Mail className="w-5 h-5 text-[#157670]" /> <span>b2b@flashtour.travel</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 font-en">
                    <Phone className="w-5 h-5 text-[#157670]" /> <span>+202 26904654 (Global Desk)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: The RFP Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-7"
            >
              <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#157670]/5 rounded-bl-full pointer-events-none"></div>
                
                <h2 className="text-3xl font-black text-[#0F162A] font-en mb-2">Request a Proposal (RFP)</h2>
                <p className="text-slate-500 font-en mb-8">Fill out the details below. Our corporate relations team will respond with a tailored proposal within 24 hours.</p>

                <form className="space-y-6">
                  {/* Row 1: Names */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 font-en">First Name *</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 font-en">Last Name *</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors" placeholder="Doe" />
                    </div>
                  </div>

                  {/* Row 2: Company Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 font-en">Company Name *</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors" placeholder="Flash Partners LLC" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 font-en">Corporate Email *</label>
                      <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors" placeholder="john@company.com" />
                    </div>
                  </div>

                  {/* Row 3: Inquiry Type & Destination */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 font-en">Inquiry Type *</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors bg-white appearance-none">
                        <option>DMC Partnership</option>
                        <option>MICE / Corporate Event</option>
                        <option>VIP Fleet & Mobility</option>
                        <option>Hotel Contracting</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 font-en">Target Destination</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors bg-white appearance-none">
                        <option>Egypt</option>
                        <option>United Arab Emirates</option>
                        <option>Italy (Sardinia / Sicily)</option>
                        <option>Zanzibar</option>
                        <option>Multi-Destination</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Area */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 font-en">Project Details / Message *</label>
                    <textarea 
                      rows={5} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#157670] focus:ring-1 focus:ring-[#157670] transition-colors resize-none" 
                      placeholder="Please provide details such as expected group size, tentative dates, or specific services required..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="button" 
                    className="w-full bg-[#0F162A] hover:bg-[#157670] text-white font-bold font-en text-lg py-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group"
                  >
                    Submit Proposal Request 
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>

                  <p className="text-xs text-slate-400 font-en text-center mt-4">
                    By submitting this form, you agree to our Corporate Privacy Policy. Your data is secure.
                  </p>
                </form>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}