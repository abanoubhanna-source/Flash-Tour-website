// src/app/services/page.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Briefcase, Globe2, Car, Plane, CheckCircle, ArrowUpRight, ShieldCheck, Cog, 
  Building2, Compass, Users, Star, Map as MapIcon, Moon, PlaneLanding, FileText, Flag, Globe 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";

// 1. Core Enterprise Solutions (The Big 4)
const coreServices = [
  {
    id: "mice",
    title: "MICE Management",
    subtitle: "Meetings, Incentives, Conferences & Exhibitions",
    desc: "In the UAE we manage large-scale business trips and corporate travels as a different ball game altogether. We have a specialized in-house team for all MICE industry segments. Meetings, incentives, conferences, or events.",
    icon: Briefcase,
    features: ["Venue Sourcing & Contracting", "Delegate Logistics & Registration", "Gala Dinners & Themed Events", "On-site Event Management"],
    img: "/images/service-mice.jpg",
    color: "text-[#157670]",
    bg: "bg-[#157670]"
  },
  {
    id: "dmc",
    title: "DMC Operations",
    subtitle: "Destination Management Company",
    desc: "Unrivaled local expertise across Egypt, UAE, Italy, and Zanzibar. We craft exclusive itineraries, including private Red Sea diving expeditions on our owned yachts, VIP cultural tours, and seamless ground handling.",
    icon: Globe2,
    features: ["Airport Meet & Assist (VIP)", "Private Diving Yachts", "Multilingual Certified Guides", "Exclusive Cultural Excursions"],
    img: "/images/service-dmc.jpg",
    color: "text-[#F1B820]",
    bg: "bg-[#F1B820]"
  },
  {
    id: "mobility",
    title: "Transportation",
    subtitle: "Owned Executive Transport",
    desc: "We offer a variety of Private VIP cars, limousines, coasters, shuttles, up to 50 seater buses. With a fleet of more than 100 vehicles, we guarantee our clients a wide variety of transports that exceed international standards.",
    icon: Car,
    features: ["100+ Owned Luxury Vehicles", "24/7 GPS Dispatch & Tracking", "Highly Trained Chauffeurs", "Comprehensive Insurance"],
    img: "/images/service-fleet.jpg",
    color: "text-[#020617]",
    bg: "bg-[#020617]"
  },
  {
    id: "ticketing",
    title: "Flight Reservations",
    subtitle: "IATA Certified Flight Operations",
    desc: "Our team will handle all ticketing procedures as we have partnered up with IATA. Via the Amadeus system, we are able to view and reserve airline tickets for our clients after analyzing the best options available.",
    icon: Plane,
    features: ["IATA Accredited Agency", "Amadeus System Integration", "Global Corporate Rates", "24/7 Emergency Support"],
    img: "/images/service-flight.jpg",
    color: "text-slate-500",
    bg: "bg-slate-500"
  }
];

// 2. Comprehensive Portfolio (The Rest of the Services)
const additionalServices = [
  {
    title: "Inbound & Outbound Tourism",
    desc: "With many years of experience in the industry, we have diversified our portfolio in hospitality. From Indian Ocean resorts to Nile river cruises.",
    icon: Globe
  },
  {
    title: "Hotel Reservations",
    desc: "We have contracted most of the hotels in the region across all categories. Our partners will be spoiled for choice combined with exclusive offers.",
    icon: Building2
  },
  {
    title: "Tour Guiding Services",
    desc: "We have a professional team that offers full guidance in several languages. All our team members are bilingual and certified.",
    icon: Compass
  },
  {
    title: "Leisure: Individuals & Groups",
    desc: "We provide high quality tailor-made solutions for niche-markets and customized services for mass-markets in the FIT and Leisure Group segments.",
    icon: Users
  },
  {
    title: "Premium FIT & Family Travel",
    desc: "Our experts handcraft packages for your FIT clients and families. We organize every aspect of the trip, tailored to specific needs.",
    icon: Star
  },
  {
    title: "Fully Escorted Group Tours",
    desc: "For those who love to travel with company, we offer an exceptional solution with our Small Group Tours with just 12 to 24 guests to off-the-beaten paths.",
    icon: MapIcon
  },
  {
    title: "Hajj and Umrah",
    desc: "For our Egyptian clients we plan and handle Hajj and Umrah services. Our team arranges transportation, flights, hotel reservations, and special requests.",
    icon: Moon
  },
  {
    title: "Airport Services",
    desc: "We provide Marhaba services and lounge access. Our team is available 24/7 at the airport to meet, assist our valued clients, and provide shuttle services.",
    icon: PlaneLanding
  },
  {
    title: "Visa Services",
    desc: "Entry visa to the UAE is one of our services offered at very attractive rates to our valued clients for both vacations or business purposes.",
    icon: FileText
  },
  {
    title: "Golf",
    desc: "Since The UAE is a very popular destination for golf enthusiasts, our Flash Horizon Golf team has limitless experience to make sure any package is perfection.",
    icon: Flag
  }
];

export default function ServicesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-slate-50 overflow-hidden selection:bg-[#157670] selection:text-white">
      
      {/* 1. Cinematic Corporate Hero */}
      <section className="relative w-full h-[80vh] flex flex-col items-center justify-center bg-[#020617] pt-16 md:pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/services-hero.jpg" alt="Flash Group Corporate Services" fill className="object-cover opacity-40 mix-blend-luminosity scale-105 animate-[pulse_15s_ease-in-out_infinite_alternate]" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/50 to-[#020617] z-10"></div>
          <div className="absolute inset-0 opacity-[0.03] z-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto w-full mt-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F1B820]/30 bg-[#F1B820]/10 text-[#F1B820] font-bold text-xs uppercase tracking-[0.2em] mb-8 font-en">
              <ShieldCheck className="w-4 h-4" /> Enterprise Grade Solutions
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white font-en mb-6 tracking-tight uppercase leading-[0.9]">
              Operational <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#157670] to-[#F1B820]">Excellence.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-en leading-relaxed max-w-3xl mx-auto font-light">
              Delivering flawless logistics, elite corporate travel, and world-class event management through our globally owned infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Quick Stats Bar */}
      <div className="w-full bg-white border-b border-slate-200 relative z-20 py-8 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap md:flex-nowrap justify-between items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex items-center gap-4 w-full md:w-1/3 pt-4 md:pt-0 pl-0 md:pl-4 justify-center md:justify-start">
            <Cog className="w-8 h-8 text-[#157670]" />
            <div>
              <div className="font-black text-xl text-slate-900 font-en">24/7</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 font-en">Operations</div>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-1/3 pt-4 md:pt-0 pl-0 md:pl-8 justify-center md:justify-start">
            <Globe2 className="w-8 h-8 text-[#F1B820]" />
            <div>
              <div className="font-black text-xl text-slate-900 font-en">40+ Years</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 font-en">Local Expertise</div>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-1/3 pt-4 md:pt-0 pl-0 md:pl-8 justify-center md:justify-start">
            <Car className="w-8 h-8 text-[#020617]" />
            <div>
              <div className="font-black text-xl text-slate-900 font-en">100+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 font-en">Owned Vehicles</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Services Editorial Layout */}
      <section className="w-full py-24 relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-32">
          {coreServices.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={service.id} className={`flex flex-col lg:flex-row items-center gap-8 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }}
                  className="w-full lg:w-7/12 relative h-[400px] lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group z-0"
                >
                  <Image src={service.img} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80"></div>
                  <div className={`absolute top-6 ${isEven ? 'left-6' : 'right-6'} w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl`}>
                    <service.icon className={`w-8 h-8 ${service.color}`} />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
                  className={`w-full lg:w-6/12 relative z-10 bg-white p-8 md:p-12 lg:p-16 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-slate-100 mt-[-50px] lg:mt-0 ${isEven ? 'lg:-mr-24' : 'lg:-ml-24'}`}
                >
                  <div className="inline-block bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg mb-6">
                    <span className={`${service.color} font-bold tracking-[0.2em] uppercase text-xs font-en`}>{service.subtitle}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-[#020617] font-en mb-6 leading-tight tracking-tight uppercase">{service.title}</h2>
                  <p className="text-slate-600 font-en text-lg leading-relaxed mb-8 font-medium">{service.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <div className={`w-1.5 h-1.5 rounded-full ${service.bg} shrink-0`}></div>
                        <span className="font-en text-slate-800 font-bold text-sm tracking-wide uppercase">{feat}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Comprehensive Portfolio Grid (The Newly Added Services) */}
      <section className="w-full py-24 bg-white border-t border-slate-100 relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#020617] font-en uppercase tracking-tight mb-6">
              Comprehensive <span className="text-[#157670]">Portfolio</span>
            </h2>
            <p className="text-slate-500 font-en text-lg leading-relaxed">
              Beyond our core operations, Flash Group offers a full spectrum of travel and hospitality services tailored to meet the exact needs of our global partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:bg-white hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#157670]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#157670] transition-colors">
                  <item.icon className="w-7 h-7 text-[#157670] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black text-[#020617] font-en uppercase tracking-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 font-en leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Grand CTA */}
      <section className="w-full py-32 bg-[#020617] relative overflow-hidden z-20">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#F1B820 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 text-white">
          <h2 className="text-5xl md:text-7xl font-black font-en mb-6 tracking-tight uppercase">
            Scale With <span className="text-[#F1B820]">Confidence.</span>
          </h2>
          <p className="text-slate-400 font-en text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            Partner with Flash Group to gain direct access to our DMC capabilities, owned fleets, and premium hospitality assets without intermediaries.
          </p>
          <Link href="/partner-portal" className="inline-flex items-center gap-3 px-12 py-6 bg-white text-[#020617] rounded-full font-black font-en text-sm uppercase tracking-widest hover:bg-[#F1B820] transition-all shadow-2xl group">
            Access Partner Portal <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}