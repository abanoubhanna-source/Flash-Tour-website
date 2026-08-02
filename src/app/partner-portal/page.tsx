// src/app/partner-portal/page.tsx
'use client';

import { motion } from 'framer-motion';
import { useActionState, useEffect, useRef } from 'react';
import { Briefcase, Building2, Mail, Phone, MapPin, Send, ShieldCheck, UserCheck } from 'lucide-react';
import Footer from "@/components/Footer";
import { trackPartnerInquirySubmit } from '@/lib/analytics';
import { usePublishedPage } from "@/lib/cms/pages/use-published-page";
import { submitPartnerInquiry, type PartnerFormState } from './actions';

const initialPartnerState: PartnerFormState = { status: "idle" };

export default function PartnerPortal() {
  const cms = usePublishedPage('/partner-portal');
  const [state, formAction, isPending] = useActionState(submitPartnerInquiry, initialPartnerState);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);
  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-slate-50 overflow-hidden">
      {/* 1. Header Section */}
      <section className="relative w-full py-24 bg-brand-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-brand-teal) 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-sm block mb-4 font-en flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5" /> {cms?.hero?.eyebrow || "Global B2B Network"}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white font-en mb-6 tracking-tight">
              {cms?.hero?.title || "Partner With"} <span className="text-brand-teal">{cms?.hero?.accentTitle || "The Empire"}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-en max-w-2xl mx-auto leading-relaxed">
              {cms?.hero?.subtitle || "Join an elite network of global travel agencies and corporate event organizers. Gain direct access to our contracted rates, owned assets, and unparalleled DMC expertise."}
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
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                <h3 className="text-2xl font-bold text-brand-navy font-en mb-6">Why Partner With Us?</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="bg-brand-teal/10 p-3 rounded-xl mt-1"><Building2 className="w-6 h-6 text-brand-teal" /></div>
                    <div>
                      <h4 className="font-bold text-brand-navy font-en text-lg">Asset Ownership</h4>
                      <p className="text-slate-500 text-sm font-en mt-1">Direct access to our owned hotels, Nile cruises, and VIP fleets without third-party markups.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-brand-gold/10 p-3 rounded-xl mt-1"><ShieldCheck className="w-6 h-6 text-brand-gold" /></div>
                    <div>
                      <h4 className="font-bold text-brand-navy font-en text-lg">Financial Security</h4>
                      <p className="text-slate-500 text-sm font-en mt-1">Fully insured operations, flexible corporate credit lines, and IATA certified financial stability.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-brand-navy/5 p-3 rounded-xl mt-1"><UserCheck className="w-6 h-6 text-brand-navy" /></div>
                    <div>
                      <h4 className="font-bold text-brand-navy font-en text-lg">Dedicated Account Manager</h4>
                      <p className="text-slate-500 text-sm font-en mt-1">A single point of contact available 24/7 to manage your VIP clients and MICE events.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Quick Contact Info */}
              <div className="bg-brand-navy p-8 rounded-2xl text-white shadow-xl">
                <h3 className="text-xl font-bold font-en mb-6 text-brand-gold">Corporate Desks</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300 font-en">
                    <MapPin className="w-5 h-5 text-brand-teal" /> <span>HQ: 30 Thawra St., Heliopolis, Cairo</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 font-en">
                    <Mail className="w-5 h-5 text-brand-teal" /> <span>b2b@flashtour.travel</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 font-en">
                    <Phone className="w-5 h-5 text-brand-teal" /> <span>+202 26904654 (Global Desk)</span>
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
              <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-bl-full pointer-events-none"></div>
                
                <h2 className="text-3xl font-bold text-brand-navy font-en mb-2">Request a Proposal (RFP)</h2>
                <p className="text-slate-500 font-en mb-8">Fill out the details below. Our corporate relations team will respond with a tailored proposal within 24 hours.</p>

                <form action={formAction} ref={formRef} className="space-y-6" onSubmit={() => trackPartnerInquirySubmit()}>
                  {/* Row 1: Names */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="rfp-first-name" className="text-sm font-bold text-slate-700 font-en">First Name *</label>
                      <input id="rfp-first-name" name="firstName" type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="rfp-last-name" className="text-sm font-bold text-slate-700 font-en">Last Name *</label>
                      <input id="rfp-last-name" name="lastName" type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" placeholder="Doe" />
                    </div>
                  </div>

                  {/* Row 2: Company Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="rfp-company-name" className="text-sm font-bold text-slate-700 font-en">Company Name *</label>
                      <input id="rfp-company-name" name="companyName" type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" placeholder="Flash Partners LLC" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="rfp-email" className="text-sm font-bold text-slate-700 font-en">Corporate Email *</label>
                      <input id="rfp-email" name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" placeholder="john@company.com" />
                    </div>
                  </div>

                  {/* Row 3: Inquiry Type & Destination */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="rfp-inquiry-type" className="text-sm font-bold text-slate-700 font-en">Inquiry Type *</label>
                      <select id="rfp-inquiry-type" name="inquiryType" required defaultValue="DMC Partnership" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors bg-white appearance-none">
                        <option>DMC Partnership</option>
                        <option>MICE / Corporate Event</option>
                        <option>VIP Fleet & Mobility</option>
                        <option>Hotel Contracting</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="rfp-destination" className="text-sm font-bold text-slate-700 font-en">Target Destination</label>
                      <select id="rfp-destination" name="destination" defaultValue="Egypt" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors bg-white appearance-none">
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
                    <label htmlFor="rfp-message" className="text-sm font-bold text-slate-700 font-en">Project Details / Message *</label>
                    <textarea
                      id="rfp-message"
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors resize-none"
                      placeholder="Please provide details such as expected group size, tentative dates, or specific services required..."
                    ></textarea>
                  </div>

                  {state.status !== "idle" && (
                    <p role="status" className={`rounded-xl px-4 py-3 text-sm font-en ${state.status === "success" ? "bg-teal-50 text-teal-800" : "bg-red-50 text-red-700"}`}>
                      {state.message}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-brand-navy hover:bg-brand-teal disabled:opacity-60 text-white font-bold font-en text-lg py-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group"
                  >
                    {isPending ? "Sending..." : "Submit Proposal Request"}
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