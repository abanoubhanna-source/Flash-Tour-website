"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { PageHeroData } from "@/lib/cms/pages/schema";

type PageLivePreviewProps = {
  hero: PageHeroData;
  path: string;
  isPublished: boolean;
};

export function PageLivePreview({ hero, path, isPublished }: PageLivePreviewProps) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/8">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <span className="max-w-[60%] truncate rounded-md bg-slate-100 px-3 py-1 font-mono text-[9px] text-slate-500">
          flashtour.travel{path}
        </span>
        {isPublished ? (
          <Link href={path} target="_blank" className="text-slate-400 transition hover:text-[#157670]" aria-label="Open published page">
            <ExternalLink className="h-4 w-4" />
          </Link>
        ) : (
          <span className="h-4 w-4" />
        )}
      </div>

      <div className="relative aspect-[4/3] min-h-[420px] overflow-hidden bg-[#0f162a]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${JSON.stringify(hero.image.url || "/images/egypt-bg.jpg").slice(1, -1)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f162a]/90 via-[#0f162a]/55 to-transparent" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#f1b820_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative flex h-full items-center p-6 sm:p-8">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/[0.13] p-6 text-white shadow-2xl backdrop-blur-sm">
            {hero.eyebrow && (
              <p className="flex items-center gap-2 text-[9px]! font-bold uppercase tracking-[0.22em] text-[#f1b820]">
                <span className="h-px w-6 bg-[#f1b820]/70" /> {hero.eyebrow}
              </p>
            )}
            <h2 className="mt-3 text-3xl! leading-[0.98]! font-bold tracking-[-0.045em] text-white sm:text-4xl!">
              {hero.title || "Page title"}
            </h2>
            {hero.subtitle && <p className="mt-4 text-sm! leading-6! text-white/85">{hero.subtitle}</p>}
            <div className="mt-6 flex flex-wrap gap-2">
              {hero.primaryCta.label && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0f162a] px-4 py-2 text-[10px] font-bold text-white">
                  {hero.primaryCta.label} <ArrowRight className="h-3 w-3" />
                </span>
              )}
              {hero.secondaryCta.label && (
                <span className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[10px] font-bold text-white">
                  {hero.secondaryCta.label}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-slate-950/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
          Draft preview
        </div>
      </div>
    </section>
  );
}
