import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import type { PageHeroData } from "@/lib/cms/pages/schema";

export function StandardCmsPage({ hero }: { hero: PageHeroData }) {
  return (
    <main className="flex min-h-screen w-full flex-col overflow-hidden bg-white">
      <section className="relative flex min-h-[760px] w-full items-center overflow-hidden bg-brand-navy">
        <Image
          src={hero.image.url || "/images/egypt-bg.jpg"}
          alt={hero.image.alt || hero.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/85 via-brand-navy/50 to-white/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-white/10" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(var(--color-brand-gold)_1px,transparent_1px)] [background-size:34px_34px]" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pt-24 lg:px-8">
          <div className="max-w-3xl rounded-2xl border border-white/20 bg-white/[0.13] p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-12">
            {hero.eyebrow && (
              <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-brand-gold md:text-sm">
                <span className="h-px w-8 bg-brand-gold/70" /> {hero.eyebrow}
              </p>
            )}
            <h1 className="mb-7 text-5xl font-bold leading-[0.92] tracking-[-0.055em] text-white drop-shadow-lg md:text-7xl xl:text-8xl">
              {hero.title}
            </h1>
            {hero.subtitle && (
              <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-md md:text-2xl">
                {hero.subtitle}
              </p>
            )}
            <div className="flex flex-col gap-4 sm:flex-row">
              {hero.primaryCta.label && hero.primaryCta.href && (
                <Link href={hero.primaryCta.href} className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-navy px-8 py-4 text-base font-bold text-white shadow-xl transition hover:bg-brand-teal">
                  {hero.primaryCta.label}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              {hero.secondaryCta.label && hero.secondaryCta.href && (
                <Link href={hero.secondaryCta.href} className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/15 px-8 py-4 text-base font-bold text-white transition hover:bg-white/25">
                  {hero.secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
