"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Clock3,
  Cloud,
  CloudAlert,
  CloudUpload,
  Eye,
  FileText,
  History,
  Loader2,
  RefreshCcw,
  Rocket,
  Save,
  SearchCheck,
  Smartphone,
} from "lucide-react";
import {
  publishPage,
  restorePageRevision,
  savePageDraft,
  unpublishPage,
} from "@/app/dashboard/pages/actions";
import { MediaPicker } from "@/components/cms/media-picker";
import { useConfirm } from "@/components/cms/confirm-dialog";
import type {
  ContactOfficeData,
  ContactPanelData,
  HomeCertificationData,
  HomeHospitalityCardData,
  HomeMapLocationData,
  HomeEnterpriseSolutionsData,
  HomeMapSectionData,
  HomeOwnedHospitalityData,
  HomeStatItemData,
  HomeStatsSectionData,
  HospitalityRegionCardData,
  HospitalityTransportationSectionData,
  PageDraftData,
  PageHeroData,
  PageHeroSlideData,
  PageSeoData,
} from "@/lib/cms/pages/schema";
import type { CmsPageEditorData } from "@/lib/cms/pages/types";
import { PageLivePreview } from "./page-live-preview";

type EditorTab = "content" | "seo" | "history";
type SaveStatus = "saved" | "dirty" | "saving" | "error";

type PageEditorProps = {
  page: CmsPageEditorData;
  canEdit: boolean;
  canPublish: boolean;
  canUpload: boolean;
  /** Hides the back-link and page title/status bar when nested inside another screen that already provides that context (e.g. a collection list's "Page header" section). */
  embedded?: boolean;
};

// These paths have their own bespoke hero markup that never renders
// hero.primaryCta/secondaryCta (only the generic [...slug] StandardCmsPage
// renderer and the home page's hero slides actually use those buttons).
// Hiding the fields here so editors aren't filling in a button that never
// appears anywhere on the live page.
const pagesWithoutHeroCtaButtons = ["/about", "/brands", "/contact", "/cruises", "/destinations", "/hospitality", "/services"];

const homeSlideDefaults: PageHeroSlideData[] = [
  { id: "group", name: "Flash Group", eyebrow: "A 40-Year Hospitality Legacy", title: "Crafting Hospitality Since 1985", subtitle: "An Egyptian-born tourism and hospitality group owning Nile cruises, resorts, restaurants, yachts, and premium mobility assets across strategic destinations.", primaryCta: { label: "Partner With Flash Group", href: "/contact" }, secondaryCta: { label: "Explore Portfolio", href: "/brands" }, image: { assetId: null, url: "/images/egypt-bg.jpg", alt: "Flash Group" }, enabled: true },
  { id: "cruises", name: "Cruises", eyebrow: "Owned Nile Cruise Fleet", title: "Luxury Journeys on the Nile", subtitle: "A curated fleet of Nile vessels delivering controlled quality, seamless logistics, and unforgettable river experiences for global partners.", primaryCta: { label: "Discover Cruises", href: "/cruises" }, secondaryCta: { label: "Contact us", href: "/contact" }, image: { assetId: null, url: "/images/hospitality-cruise.jpg", alt: "Luxury Nile cruise" }, enabled: true },
  { id: "hospitality", name: "Hospitality", eyebrow: "Hotels, Resorts & Fine Dining", title: "Assets That Shape the Experience", subtitle: "From Red Sea sanctuaries and boutique heritage hotels to international resorts and restaurants, Flash Group owns the journey end-to-end.", primaryCta: { label: "Explore Hospitality", href: "/hospitality" }, secondaryCta: { label: "Contact us", href: "/contact" }, image: { assetId: null, url: "/images/zanzibar-bg.jpg", alt: "Flash Group hospitality" }, enabled: true },
  { id: "mobility", name: "Mobility", eyebrow: "Executive Transport Infrastructure", title: "Precision on Every Route", subtitle: "A premium fleet, trained chauffeurs, and operational control built for B2B travel, MICE, VIP transfers, and large-scale movements.", primaryCta: { label: "Our services", href: "/services" }, secondaryCta: { label: "Contact us", href: "/contact" }, image: { assetId: null, url: "/images/fleet-showcase.jpg", alt: "Flash Group executive mobility" }, enabled: true },
];

function CollapsibleSection({ eyebrow, title, description, defaultOpen = false, children }: { eyebrow: string; title: string; description?: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-slate-200 open:border-[#157670]/30 open:shadow-sm" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 select-none">
        <div>
          <p className="text-[10px]! font-bold uppercase tracking-[0.16em] text-[#157670]">{eyebrow}</p>
          <h3 className="mt-1 text-lg! leading-7! font-bold text-[#0f172a]">{title}</h3>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100 p-4 pt-5">{children}</div>
    </details>
  );
}

function draftSignature(draft: PageDraftData) {
  return JSON.stringify(draft);
}

function HomeSlidesEditor({ slides, onChange, canUpload }: { slides: PageHeroSlideData[]; onChange: (slides: PageHeroSlideData[]) => void; canUpload: boolean }) {
  const move = (index: number, direction: -1 | 1) => { const next = index + direction; if (next < 0 || next >= slides.length) return; const reordered = [...slides]; [reordered[index], reordered[next]] = [reordered[next], reordered[index]]; onChange(reordered); };
  const update = (index: number, value: PageHeroSlideData) => onChange(slides.map((slide, current) => current === index ? value : slide));
  return (
    <CollapsibleSection eyebrow="Home slider" title="Four hero slides" description="All four slides are saved, versioned, previewed, and published with the Home page. Use the arrows to change their public order.">
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <article key={slide.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <p className="flex-1 text-xs font-bold">Slide {index + 1}</p>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                <input type="checkbox" aria-label={`Slide ${index + 1} enabled`} checked={slide.enabled} onChange={(event) => update(index, { ...slide, enabled: event.target.checked })} className="h-3.5 w-3.5 rounded border-slate-300" />
                Enabled
              </label>
              <button type="button" aria-label="Move slide up" disabled={index === 0} onClick={() => move(index, -1)} className="rounded-lg border p-2 disabled:opacity-40"><ArrowUp className="h-3 w-3" /></button>
              <button type="button" aria-label="Move slide down" disabled={index === slides.length - 1} onClick={() => move(index, 1)} className="rounded-lg border p-2 disabled:opacity-40"><ArrowDown className="h-3 w-3" /></button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input aria-label={`Slide ${index + 1} tab label`} value={slide.name} onChange={(event) => update(index, { ...slide, name: event.target.value })} placeholder="Navigation label" className="h-10 rounded-xl border px-3 text-sm" />
              <input aria-label={`Slide ${index + 1} eyebrow`} value={slide.eyebrow} onChange={(event) => update(index, { ...slide, eyebrow: event.target.value })} placeholder="Eyebrow" className="h-10 rounded-xl border px-3 text-sm" />
            </div>
            <input aria-label={`Slide ${index + 1} title`} value={slide.title} onChange={(event) => update(index, { ...slide, title: event.target.value })} placeholder="Title" className="mt-3 h-10 w-full rounded-xl border px-3 text-sm" />
            <textarea aria-label={`Slide ${index + 1} subtitle`} value={slide.subtitle} onChange={(event) => update(index, { ...slide, subtitle: event.target.value })} placeholder="Subtitle" rows={3} className="mt-3 w-full rounded-xl border px-3 py-2 text-sm" />
            <div className="mt-3">
              <MediaPicker
                label={`Slide ${index + 1} image`}
                value={slide.image}
                canUpload={canUpload}
                onChange={(image) => update(index, { ...slide, image: { assetId: image.assetId ?? slide.image.assetId, url: image.url, alt: image.alt ?? slide.image.alt } })}
              />
              <input aria-label={`Slide ${index + 1} image alt`} value={slide.image.alt} onChange={(event) => update(index, { ...slide, image: { ...slide.image, alt: event.target.value } })} placeholder="Image alt text" className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input aria-label={`Slide ${index + 1} primary CTA`} value={slide.primaryCta.label} onChange={(event) => update(index, { ...slide, primaryCta: { ...slide.primaryCta, label: event.target.value } })} placeholder="Primary CTA label" className="h-10 rounded-xl border px-3 text-sm" />
              <input aria-label={`Slide ${index + 1} primary CTA URL`} value={slide.primaryCta.href} onChange={(event) => update(index, { ...slide, primaryCta: { ...slide.primaryCta, href: event.target.value } })} placeholder="Primary CTA URL" className="h-10 rounded-xl border px-3 text-sm" />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input aria-label={`Slide ${index + 1} secondary CTA`} value={slide.secondaryCta.label} onChange={(event) => update(index, { ...slide, secondaryCta: { ...slide.secondaryCta, label: event.target.value } })} placeholder="Secondary CTA label" className="h-10 rounded-xl border px-3 text-sm" />
              <input aria-label={`Slide ${index + 1} secondary CTA URL`} value={slide.secondaryCta.href} onChange={(event) => update(index, { ...slide, secondaryCta: { ...slide.secondaryCta, href: event.target.value } })} placeholder="Secondary CTA URL" className="h-10 rounded-xl border px-3 text-sm" />
            </div>
          </article>
        ))}
      </div>
    </CollapsibleSection>
  );
}

const emptyStatItem: HomeStatItemData = { number: "", label: "" };
const emptyCertification: HomeCertificationData = { name: "", desc: "", logo: "" };
const emptyMapLocation: HomeMapLocationData = { id: "", name: "", top: "50%", left: "50%", details: "" };

function HomeStatsEditor({ value, onChange, canUpload }: { value: HomeStatsSectionData; onChange: (value: HomeStatsSectionData) => void; canUpload: boolean }) {
  const updateItem = (index: number, item: HomeStatItemData) => onChange({ ...value, items: value.items.map((current, i) => (i === index ? item : current)) });
  const addItem = () => onChange({ ...value, items: [...value.items, emptyStatItem] });
  const removeItem = (index: number) => onChange({ ...value, items: value.items.filter((_, i) => i !== index) });
  const updateCert = (index: number, cert: HomeCertificationData) => onChange({ ...value, certifications: value.certifications.map((current, i) => (i === index ? cert : current)) });
  const addCert = () => onChange({ ...value, certifications: [...value.certifications, emptyCertification] });
  const removeCert = (index: number) => onChange({ ...value, certifications: value.certifications.filter((_, i) => i !== index) });
  return (
    <CollapsibleSection eyebrow="Home page" title="Scale & certifications" description="The stat tiles and certification cards shown under the Home hero.">
      <label className="block text-xs font-bold text-slate-700">Section heading
        <input value={value.heading} onChange={(event) => onChange({ ...value, heading: event.target.value })} placeholder="Scale That Builds Trust" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {value.items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 p-3">
            <div className="flex items-center justify-between"><p className="text-[10px] font-bold text-slate-500">Stat {index + 1}</p><button type="button" aria-label={`Remove stat ${index + 1}`} onClick={() => removeItem(index)} className="text-[10px] font-bold text-red-600">Remove</button></div>
            <input aria-label={`Stat ${index + 1} number`} value={item.number} onChange={(event) => updateItem(index, { ...item, number: event.target.value })} placeholder="40+" className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" />
            <input aria-label={`Stat ${index + 1} label`} value={item.label} onChange={(event) => updateItem(index, { ...item, label: event.target.value })} placeholder="Years of Excellence" className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" />
          </div>
        ))}
        <button type="button" onClick={addItem} className="flex h-full min-h-[92px] items-center justify-center rounded-2xl border border-dashed border-slate-300 text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add stat</button>
      </div>

      <label className="mt-5 block text-xs font-bold text-slate-700">Certifications intro
        <textarea value={value.certificationsIntro} onChange={(event) => onChange({ ...value, certificationsIntro: event.target.value })} rows={2} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>

      <div className="mt-4 space-y-3">
        {value.certifications.map((cert, index) => (
          <article key={index} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between"><p className="text-xs font-bold">Certification {index + 1}</p><button type="button" aria-label={`Remove certification ${index + 1}`} onClick={() => removeCert(index)} className="text-[10px] font-bold text-red-600">Remove</button></div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input aria-label={`Certification ${index + 1} name`} value={cert.name} onChange={(event) => updateCert(index, { ...cert, name: event.target.value })} placeholder="ISO 9001:2015" className="h-10 rounded-xl border px-3 text-sm" />
              <input aria-label={`Certification ${index + 1} description`} value={cert.desc} onChange={(event) => updateCert(index, { ...cert, desc: event.target.value })} placeholder="Quality Management System" className="h-10 rounded-xl border px-3 text-sm" />
            </div>
            <div className="mt-3 w-40">
              <MediaPicker label="Logo" value={{ url: cert.logo, alt: cert.name }} canUpload={canUpload} onChange={(image) => updateCert(index, { ...cert, logo: image.url })} />
            </div>
          </article>
        ))}
        <button type="button" onClick={addCert} className="w-full rounded-2xl border border-dashed border-slate-300 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add certification</button>
      </div>
    </CollapsibleSection>
  );
}

function HomeMapEditor({ value, onChange }: { value: HomeMapSectionData; onChange: (value: HomeMapSectionData) => void }) {
  const updateChecklistItem = (index: number, text: string) => onChange({ ...value, checklist: value.checklist.map((current, i) => (i === index ? text : current)) });
  const addChecklistItem = () => onChange({ ...value, checklist: [...value.checklist, ""] });
  const removeChecklistItem = (index: number) => onChange({ ...value, checklist: value.checklist.filter((_, i) => i !== index) });
  const updateLocation = (index: number, location: HomeMapLocationData) => onChange({ ...value, locations: value.locations.map((current, i) => (i === index ? location : current)) });
  const addLocation = () => onChange({ ...value, locations: [...value.locations, emptyMapLocation] });
  const removeLocation = (index: number) => onChange({ ...value, locations: value.locations.filter((_, i) => i !== index) });
  return (
    <CollapsibleSection eyebrow="Home page" title="Global infrastructure map" description="The intro copy, checklist, and pinned locations on the world map section.">
      <label className="block text-xs font-bold text-slate-700">Section heading
        <input value={value.heading} onChange={(event) => onChange({ ...value, heading: event.target.value })} placeholder="Our Global Infrastructure" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="mt-5 block text-xs font-bold text-slate-700">Intro paragraph
        <textarea value={value.intro} onChange={(event) => onChange({ ...value, intro: event.target.value })} rows={3} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-bold text-slate-700">Checklist</p>
        {value.checklist.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input aria-label={`Checklist item ${index + 1}`} value={item} onChange={(event) => updateChecklistItem(index, event.target.value)} className="h-10 flex-1 rounded-xl border px-3 text-sm" />
            <button type="button" aria-label={`Remove checklist item ${index + 1}`} onClick={() => removeChecklistItem(index)} className="text-[10px] font-bold text-red-600">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addChecklistItem} className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add checklist item</button>
      </div>

      <div className="mt-5 space-y-3">
        <p className="text-xs font-bold text-slate-700">Map locations</p>
        {value.locations.map((location, index) => (
          <article key={index} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between"><p className="text-xs font-bold">Location {index + 1}</p><button type="button" aria-label={`Remove location ${index + 1}`} onClick={() => removeLocation(index)} className="text-[10px] font-bold text-red-600">Remove</button></div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input aria-label={`Location ${index + 1} id`} value={location.id} onChange={(event) => updateLocation(index, { ...location, id: event.target.value })} placeholder="egypt" className="h-10 rounded-xl border px-3 font-mono text-sm" />
              <input aria-label={`Location ${index + 1} name`} value={location.name} onChange={(event) => updateLocation(index, { ...location, name: event.target.value })} placeholder="Egypt" className="h-10 rounded-xl border px-3 text-sm" />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input aria-label={`Location ${index + 1} top position`} value={location.top} onChange={(event) => updateLocation(index, { ...location, top: event.target.value })} placeholder="45%" className="h-10 rounded-xl border px-3 text-sm" />
              <input aria-label={`Location ${index + 1} left position`} value={location.left} onChange={(event) => updateLocation(index, { ...location, left: event.target.value })} placeholder="43.5%" className="h-10 rounded-xl border px-3 text-sm" />
            </div>
            <input aria-label={`Location ${index + 1} details`} value={location.details} onChange={(event) => updateLocation(index, { ...location, details: event.target.value })} placeholder="Global HQ • 7 Nile Cruises • 100+ VIP Fleet" className="mt-3 h-10 w-full rounded-xl border px-3 text-sm" />
          </article>
        ))}
        <button type="button" onClick={addLocation} className="w-full rounded-2xl border border-dashed border-slate-300 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add location</button>
      </div>
    </CollapsibleSection>
  );
}

function HospitalityTransportationEditor({
  value,
  onChange,
  canUpload,
  eyebrow = "Hospitality page",
  title = "Transportation section",
  description = "The VIP transportation section shown on the Hospitality page. The Home page's Transportation card links here.",
}: {
  value: HospitalityTransportationSectionData;
  onChange: (value: HospitalityTransportationSectionData) => void;
  canUpload: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const updateFeature = (index: number, text: string) => onChange({ ...value, features: value.features.map((current, i) => (i === index ? text : current)) });
  const addFeature = () => onChange({ ...value, features: [...value.features, ""] });
  const removeFeature = (index: number) => onChange({ ...value, features: value.features.filter((_, i) => i !== index) });
  return (
    <CollapsibleSection eyebrow={eyebrow} title={title} description={description}>
      <label className="block text-xs font-bold text-slate-700">Section heading
        <input value={value.heading} onChange={(event) => onChange({ ...value, heading: event.target.value })} placeholder="Unmatched VIP Transportation" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="mt-5 block text-xs font-bold text-slate-700">Description
        <textarea value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} rows={3} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-bold text-slate-700">Features</p>
        {value.features.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input aria-label={`Feature ${index + 1}`} value={item} onChange={(event) => updateFeature(index, event.target.value)} className="h-10 flex-1 rounded-xl border px-3 text-sm" />
            <button type="button" aria-label={`Remove feature ${index + 1}`} onClick={() => removeFeature(index)} className="text-[10px] font-bold text-red-600">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addFeature} className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add feature</button>
      </div>

      <div className="mt-5">
        <MediaPicker
          label="Section image"
          value={value.image}
          canUpload={canUpload}
          onChange={(image) => onChange({ ...value, image: { assetId: image.assetId ?? value.image.assetId, url: image.url, alt: image.alt ?? value.image.alt } })}
        />
      </div>
    </CollapsibleSection>
  );
}

const hospitalityRegionIcons = ["Ship", "Waves", "Palmtree", "Map", "Building2"] as const;

function HospitalityRegionsEditor({ value, onChange, canUpload }: { value: HospitalityRegionCardData[]; onChange: (value: HospitalityRegionCardData[]) => void; canUpload: boolean }) {
  const updateRegion = (index: number, region: HospitalityRegionCardData) => onChange(value.map((current, i) => (i === index ? region : current)));
  const updateFeature = (regionIndex: number, featureIndex: number, text: string) => {
    const region = value[regionIndex];
    updateRegion(regionIndex, { ...region, features: region.features.map((current, i) => (i === featureIndex ? text : current)) });
  };
  const addFeature = (regionIndex: number) => {
    const region = value[regionIndex];
    updateRegion(regionIndex, { ...region, features: [...region.features, ""] });
  };
  const removeFeature = (regionIndex: number, featureIndex: number) => {
    const region = value[regionIndex];
    updateRegion(regionIndex, { ...region, features: region.features.filter((_, i) => i !== featureIndex) });
  };

  return (
    <CollapsibleSection eyebrow="Hospitality page" title="Region cards" description="The five region cards on the main Hospitality page, each linking to its own deep-dive page. Cards can't be added or removed since each links to a fixed page.">
      <div className="space-y-3">
        {value.map((region, index) => (
          <details key={region.id} className="rounded-2xl border border-slate-200 p-4" open={index === 0}>
            <summary className="cursor-pointer text-xs font-bold text-slate-700 select-none">{region.tag || `Region ${index + 1}`} <span className="font-mono font-normal text-slate-400">{region.link}</span></summary>
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input aria-label={`Region ${index + 1} tag`} value={region.tag} onChange={(event) => updateRegion(index, { ...region, tag: event.target.value })} placeholder="THE NILE RIVER" className="h-10 rounded-xl border px-3 text-sm" />
                <select aria-label={`Region ${index + 1} icon`} value={region.icon} onChange={(event) => updateRegion(index, { ...region, icon: event.target.value as HospitalityRegionCardData["icon"] })} className="h-10 rounded-xl border px-3 text-sm">
                  {hospitalityRegionIcons.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <input aria-label={`Region ${index + 1} title`} value={region.title} onChange={(event) => updateRegion(index, { ...region, title: event.target.value })} placeholder="The River Fleet" className="h-10 w-full rounded-xl border px-3 text-sm" />
              <input aria-label={`Region ${index + 1} subtitle`} value={region.subtitle} onChange={(event) => updateRegion(index, { ...region, subtitle: event.target.value })} placeholder="Sailing the Nile in Absolute Luxury" className="h-10 w-full rounded-xl border px-3 text-sm" />
              <textarea aria-label={`Region ${index + 1} description`} value={region.desc} onChange={(event) => updateRegion(index, { ...region, desc: event.target.value })} rows={3} className="w-full rounded-xl border px-3 py-2 text-sm" />
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-600">Features</p>
                {region.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <input aria-label={`Region ${index + 1} feature ${featureIndex + 1}`} value={feature} onChange={(event) => updateFeature(index, featureIndex, event.target.value)} className="h-10 flex-1 rounded-xl border px-3 text-sm" />
                    <button type="button" aria-label={`Remove region ${index + 1} feature ${featureIndex + 1}`} onClick={() => removeFeature(index, featureIndex)} className="text-[10px] font-bold text-red-600">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addFeature(index)} className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add feature</button>
              </div>
              <MediaPicker
                label="Region image"
                value={region.image}
                canUpload={canUpload}
                onChange={(image) => updateRegion(index, { ...region, image: { assetId: image.assetId ?? region.image.assetId, url: image.url, alt: image.alt ?? region.image.alt } })}
              />
            </div>
          </details>
        ))}
      </div>
    </CollapsibleSection>
  );
}

function HomeEnterpriseSolutionsEditor({ value, onChange }: { value: HomeEnterpriseSolutionsData; onChange: (value: HomeEnterpriseSolutionsData) => void }) {
  return (
    <CollapsibleSection eyebrow="Home page" title="Enterprise Solutions" description="The heading, intro, and unified button label for the 3 service cards shown below the Home hero. The cards themselves pull the first 3 published services.">
      <label className="block text-xs font-bold text-slate-700">Section heading
        <input value={value.heading} onChange={(event) => onChange({ ...value, heading: event.target.value })} placeholder="Enterprise Solutions" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="mt-5 block text-xs font-bold text-slate-700">Intro paragraph
        <textarea value={value.intro} onChange={(event) => onChange({ ...value, intro: event.target.value })} rows={2} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
      <label className="mt-5 block text-xs font-bold text-slate-700">Card button label <span className="font-normal text-slate-400">(shown on all 3 cards)</span>
        <input value={value.ctaLabel} onChange={(event) => onChange({ ...value, ctaLabel: event.target.value })} placeholder="Explore Services" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
    </CollapsibleSection>
  );
}

const homeHospitalityCardIcons = ["Anchor", "Palmtree", "Building", "Ship", "Building2"] as const;

function HomeOwnedHospitalityEditor({ value, onChange, canUpload }: { value: HomeOwnedHospitalityData; onChange: (value: HomeOwnedHospitalityData) => void; canUpload: boolean }) {
  const updateCard = (index: number, card: HomeHospitalityCardData) => onChange({ ...value, cards: value.cards.map((current, i) => (i === index ? card : current)) });
  return (
    <CollapsibleSection eyebrow="Home page" title="Owned Hospitality" description="The heading, intro, 3 featured property cards, and the button below them. These cards are independent from the Brands module.">
      <label className="block text-xs font-bold text-slate-700">Section heading
        <input value={value.heading} onChange={(event) => onChange({ ...value, heading: event.target.value })} placeholder="Owned Hospitality" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="mt-5 block text-xs font-bold text-slate-700">Intro paragraph
        <textarea value={value.intro} onChange={(event) => onChange({ ...value, intro: event.target.value })} rows={2} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>

      <div className="mt-5 space-y-3">
        <p className="text-xs font-bold text-slate-700">Property cards</p>
        {value.cards.map((card, index) => (
          <details key={card.id} className="rounded-2xl border border-slate-200 p-4" open={index === 0}>
            <summary className="cursor-pointer text-xs font-bold text-slate-700 select-none">{card.name || `Card ${index + 1}`}</summary>
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input aria-label={`Card ${index + 1} name`} value={card.name} onChange={(event) => updateCard(index, { ...card, name: event.target.value })} placeholder="Nile Serenity" className="h-10 rounded-xl border px-3 text-sm" />
                <select aria-label={`Card ${index + 1} icon`} value={card.icon} onChange={(event) => updateCard(index, { ...card, icon: event.target.value as HomeHospitalityCardData["icon"] })} className="h-10 rounded-xl border px-3 text-sm">
                  {homeHospitalityCardIcons.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <input aria-label={`Card ${index + 1} subtitle`} value={card.subtitle} onChange={(event) => updateCard(index, { ...card, subtitle: event.target.value })} placeholder="Setting the absolute benchmark for river cruising." className="h-10 w-full rounded-xl border px-3 text-sm" />
              <textarea aria-label={`Card ${index + 1} description`} value={card.description} onChange={(event) => updateCard(index, { ...card, description: event.target.value })} rows={2} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Shown when the card is hovered" />
              <MediaPicker
                label="Card image"
                value={card.image}
                canUpload={canUpload}
                onChange={(image) => updateCard(index, { ...card, image: { assetId: image.assetId ?? card.image.assetId, url: image.url, alt: image.alt ?? card.image.alt } })}
              />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-bold text-slate-700">Button label
          <input value={value.ctaLabel} onChange={(event) => onChange({ ...value, ctaLabel: event.target.value })} placeholder="Explore Hospitality" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
        </label>
        <label className="block text-xs font-bold text-slate-700">Button link
          <input value={value.ctaHref} onChange={(event) => onChange({ ...value, ctaHref: event.target.value })} placeholder="/hospitality" className="mt-2 h-11 w-full rounded-xl border px-3.5 font-mono text-sm" />
        </label>
      </div>
    </CollapsibleSection>
  );
}

function ContactOfficesEditor({ value, onChange }: { value: ContactOfficeData[]; onChange: (value: ContactOfficeData[]) => void }) {
  const updateOffice = (index: number, office: ContactOfficeData) => onChange(value.map((current, i) => (i === index ? office : current)));
  const addOffice = () => onChange([...value, { id: `office-${value.length + 1}`, region: "", city: "", address: "", email: "", phone: "" }]);
  const removeOffice = (index: number) => onChange(value.filter((_, i) => i !== index));
  return (
    <CollapsibleSection eyebrow="Contact page" title="Office cards" description="The office cards shown under the Contact hero.">
      <div className="space-y-3">
        {value.map((office, index) => (
          <details key={office.id} className="rounded-2xl border border-slate-200 p-4" open={index === 0}>
            <summary className="cursor-pointer text-xs font-bold text-slate-700 select-none">{office.city || `Office ${index + 1}`}</summary>
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input aria-label={`Office ${index + 1} region`} value={office.region} onChange={(event) => updateOffice(index, { ...office, region: event.target.value })} placeholder="Global Headquarters" className="h-10 rounded-xl border px-3 text-sm" />
                <input aria-label={`Office ${index + 1} city`} value={office.city} onChange={(event) => updateOffice(index, { ...office, city: event.target.value })} placeholder="Cairo, Egypt" className="h-10 rounded-xl border px-3 text-sm" />
              </div>
              <input aria-label={`Office ${index + 1} address`} value={office.address} onChange={(event) => updateOffice(index, { ...office, address: event.target.value })} placeholder="30 Thawra St., Heliopolis" className="h-10 w-full rounded-xl border px-3 text-sm" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input aria-label={`Office ${index + 1} email`} value={office.email} onChange={(event) => updateOffice(index, { ...office, email: event.target.value })} placeholder="info@flashtour.travel" className="h-10 rounded-xl border px-3 text-sm" />
                <input aria-label={`Office ${index + 1} phone`} value={office.phone} onChange={(event) => updateOffice(index, { ...office, phone: event.target.value })} placeholder="+202 26904654" className="h-10 rounded-xl border px-3 text-sm" />
              </div>
              {value.length > 1 && (
                <button type="button" onClick={() => removeOffice(index)} className="text-[10px] font-bold text-red-600">Remove office</button>
              )}
            </div>
          </details>
        ))}
        <button type="button" onClick={addOffice} className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add office</button>
      </div>
    </CollapsibleSection>
  );
}

function ContactPanelEditor({ value, onChange }: { value: ContactPanelData; onChange: (value: ContactPanelData) => void }) {
  const updateBadge = (index: number, badge: { label: string; value: string }) => onChange({ ...value, trustBadges: value.trustBadges.map((current, i) => (i === index ? badge : current)) });
  return (
    <CollapsibleSection eyebrow="Contact page" title="Partnership panel" description="The dark left-hand panel next to the inquiry form.">
      <label className="block text-xs font-bold text-slate-700">Heading
        <input value={value.heading} onChange={(event) => onChange({ ...value, heading: event.target.value })} placeholder="Access the Group Network" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="mt-5 block text-xs font-bold text-slate-700">Intro
        <textarea value={value.intro} onChange={(event) => onChange({ ...value, intro: event.target.value })} rows={3} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
      <div className="mt-5 space-y-3">
        <p className="text-xs font-bold text-slate-700">Trust badges</p>
        {value.trustBadges.map((badge, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-3">
            <input aria-label={`Trust badge ${index + 1} label`} value={badge.label} onChange={(event) => updateBadge(index, { ...badge, label: event.target.value })} placeholder="Global Reach" className="h-10 rounded-xl border px-3 text-sm" />
            <input aria-label={`Trust badge ${index + 1} value`} value={badge.value} onChange={(event) => updateBadge(index, { ...badge, value: event.target.value })} placeholder="Operating in 5+ countries" className="h-10 rounded-xl border px-3 text-sm" />
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

function HospitalityStatsEditor({ value, onChange }: { value: HomeStatItemData[]; onChange: (value: HomeStatItemData[]) => void }) {
  const updateItem = (index: number, item: HomeStatItemData) => onChange(value.map((current, i) => (i === index ? item : current)));
  return (
    <CollapsibleSection eyebrow="Hospitality page" title="Stats bar" description="The 4 numbers shown on the floating bar at the bottom of the Hospitality hero.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {value.map((item, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 p-3">
            <p className="text-[10px] font-bold text-slate-500">Stat {index + 1}</p>
            <input aria-label={`Stat ${index + 1} number`} value={item.number} onChange={(event) => updateItem(index, { ...item, number: event.target.value })} placeholder="4" className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" />
            <input aria-label={`Stat ${index + 1} label`} value={item.label} onChange={(event) => updateItem(index, { ...item, label: event.target.value })} placeholder="Global Regions" className="mt-2 h-10 w-full rounded-xl border px-3 text-sm" />
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

function HospitalityIntroCtaEditor({
  introHeading,
  introBody,
  ctaHeading,
  ctaBody,
  trustBadges,
  onChange,
}: {
  introHeading: string;
  introBody: string;
  ctaHeading: string;
  ctaBody: string;
  trustBadges: string[];
  onChange: (value: { introHeading: string; introBody: string; ctaHeading: string; ctaBody: string; trustBadges: string[] }) => void;
}) {
  const updateBadge = (index: number, next: string) => {
    const nextBadges = [...trustBadges];
    nextBadges[index] = next;
    onChange({ introHeading, introBody, ctaHeading, ctaBody, trustBadges: nextBadges });
  };
  return (
    <CollapsibleSection eyebrow="Hospitality region page" title="Intro & closing CTA" description="The centered intro statement below the hero, and the closing 'Partner With...' section at the bottom of the page. The showcase cards below the intro pull each property's real content from the Hospitality collection.">
      <label className="block text-xs font-bold text-slate-700">Intro heading
        <input value={introHeading} onChange={(event) => onChange({ introHeading: event.target.value, introBody, ctaHeading, ctaBody, trustBadges })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="mt-5 block text-xs font-bold text-slate-700">Intro body
        <textarea value={introBody} onChange={(event) => onChange({ introHeading, introBody: event.target.value, ctaHeading, ctaBody, trustBadges })} rows={3} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
      <label className="mt-5 block text-xs font-bold text-slate-700">Closing CTA heading
        <input value={ctaHeading} onChange={(event) => onChange({ introHeading, introBody, ctaHeading: event.target.value, ctaBody, trustBadges })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="mt-5 block text-xs font-bold text-slate-700">Closing CTA body
        <textarea value={ctaBody} onChange={(event) => onChange({ introHeading, introBody, ctaHeading, ctaBody: event.target.value, trustBadges })} rows={2} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
      <div className="mt-5 space-y-3">
        <p className="text-xs font-bold text-slate-700">Trust badges (the 3 small badges under the closing CTA)</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {trustBadges.map((badge, index) => (
            <input key={index} aria-label={`Trust badge ${index + 1}`} value={badge} onChange={(event) => updateBadge(index, event.target.value)} placeholder="B2B Rates Available" className="h-10 rounded-xl border px-3 text-sm" />
          ))}
        </div>
      </div>
    </CollapsibleSection>
  );
}

function formatRevisionDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function eventLabel(event: CmsPageEditorData["revisions"][number]["event"]) {
  return {
    draft_saved: "Draft saved",
    published: "Published",
    unpublished: "Moved to draft",
    archived: "Archived",
    restored: "Restored",
  }[event];
}

export function PageEditor({ page, canEdit, canPublish, canUpload, embedded = false }: PageEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<PageDraftData>({ hero: page.hero, seo: page.seo });
  const [activeTab, setActiveTab] = useState<EditorTab>("content");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [notice, setNotice] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(page.enabled);
  const [busyAction, setBusyAction] = useState<"publish" | "unpublish" | "version" | "restore" | "upload" | null>(null);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [savedSignature, setSavedSignature] = useState(() => draftSignature(draft));
  const { confirm, dialog } = useConfirm();
  const lockVersionRef = useRef(page.lockVersion);
  const draftRef = useRef(draft);
  const savingRef = useRef(false);

  const isDirty = draftSignature(draft) !== savedSignature;

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    if (!isDirty) return;

    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    const warnBeforeNavigation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.href === window.location.href) return;
      if (!window.confirm("You have unsaved changes. Leave this page?")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("beforeunload", warnBeforeUnload);
    document.addEventListener("click", warnBeforeNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
      document.removeEventListener("click", warnBeforeNavigation, true);
    };
  }, [isDirty]);

  const performSave = useCallback(async (createRevision: boolean) => {
    if (!canEdit || savingRef.current) return false;
    const payload = draftRef.current;
    const signature = draftSignature(payload);
    savingRef.current = true;
    setSaveStatus("saving");
    setNotice(null);
    const result = await savePageDraft(page.id, lockVersionRef.current, payload, createRevision);
    savingRef.current = false;

    if (!result.ok) {
      setSaveStatus("error");
      setNotice(result.message);
      return false;
    }

    lockVersionRef.current = result.lockVersion;
    setSavedSignature(signature);
    setSaveStatus(draftSignature(draftRef.current) === signature ? "saved" : "dirty");
    if (result.message) setNotice(result.message);
    if (createRevision) router.refresh();
    return true;
  }, [canEdit, page.id, router]);

  function updateHero<K extends keyof PageHeroData>(key: K, value: PageHeroData[K]) {
    setDraft((current) => ({ ...current, hero: { ...current.hero, [key]: value } }));
    setSaveStatus("dirty");
    setNotice(null);
  }

  function updateSeo<K extends keyof PageSeoData>(key: K, value: PageSeoData[K]) {
    setDraft((current) => ({ ...current, seo: { ...current.seo, [key]: value } }));
    setSaveStatus("dirty");
    setNotice(null);
  }

  async function handlePublish() {
    if (!(await confirm("Publish this draft to the live website?"))) return;
    setBusyAction("publish");
    setNotice(null);
    const payload = draftRef.current;
    const result = await publishPage(page.id, lockVersionRef.current, payload);
    setBusyAction(null);
    if (!result.ok) {
      setSaveStatus("error");
      setNotice(result.message);
      return;
    }
    lockVersionRef.current = result.lockVersion;
    setSavedSignature(draftSignature(payload));
    setSaveStatus("saved");
    setEnabled(true);
    setNotice(result.message ?? "Page published.");
    router.refresh();
  }

  async function handleUnpublish() {
    if (!(await confirm("Move this page back to draft? It will no longer be available publicly."))) return;
    setBusyAction("unpublish");
    setNotice(null);
    const result = await unpublishPage(page.id, lockVersionRef.current);
    setBusyAction(null);
    if (!result.ok) {
      setNotice(result.message);
      return;
    }
    lockVersionRef.current = result.lockVersion;
    setEnabled(false);
    setNotice(result.message ?? "Page moved to draft.");
    router.refresh();
  }

  async function handleRestore(revisionId: string, version: number) {
    if (!(await confirm(`Restore version ${version} as the current draft?`))) return;
    setBusyAction("restore");
    setNotice(null);
    const result = await restorePageRevision(page.id, revisionId, lockVersionRef.current);
    setBusyAction(null);
    if (!result.ok) {
      setNotice(result.message);
      return;
    }
    if (!result.draft) {
      setNotice("The restored version did not contain valid page content.");
      return;
    }
    lockVersionRef.current = result.lockVersion;
    setSavedSignature(draftSignature(result.draft));
    draftRef.current = result.draft;
    setDraft(result.draft);
    setSaveStatus("saved");
    setNotice(result.message ?? "Version restored.");
    router.refresh();
  }

  const statusDetails = {
    saved: { icon: Check, label: "All changes saved", className: "text-emerald-700" },
    dirty: { icon: Cloud, label: "Unsaved changes", className: "text-amber-700" },
    saving: { icon: Loader2, label: "Saving…", className: "text-blue-700" },
    error: { icon: CloudAlert, label: "Save failed", className: "text-red-700" },
  }[saveStatus];
  const StatusIcon = statusDetails.icon;

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            {!embedded && (
              <Link href="/dashboard/pages" className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="Back to pages">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            )}
            <div className="min-w-0">
              {!embedded && (
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl! leading-7! font-bold text-[#0f172a]">{page.name}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {enabled ? "Published" : "Draft"}
                  </span>
                </div>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                {embedded && (
                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {enabled ? "Published" : "Draft"}
                  </span>
                )}
                <span className="font-mono text-xs text-slate-500">{page.path}</span>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${statusDetails.className}`} aria-live="polite">
                  <StatusIcon className={`h-3.5 w-3.5 ${saveStatus === "saving" ? "animate-spin" : ""}`} /> {statusDetails.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setMobilePreview((value) => !value)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-600 xl:hidden">
              <Eye className="h-4 w-4" /> {mobilePreview ? "Hide preview" : "Live preview"}
            </button>
            {canEdit && (
              <button
                type="button"
                disabled={busyAction !== null || saveStatus === "saving"}
                onClick={async () => {
                  setBusyAction("version");
                  await performSave(true);
                  setBusyAction(null);
                }}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {busyAction === "version" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save version
              </button>
            )}
            {canPublish && enabled && (
              <button type="button" disabled={busyAction !== null} onClick={handleUnpublish} className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50">
                {busyAction === "unpublish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />} Move to draft
              </button>
            )}
            {canPublish && (
              <button type="button" disabled={busyAction !== null} onClick={handlePublish} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white hover:bg-[#105f5a] disabled:opacity-50">
                {busyAction === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />} {enabled ? "Publish updates" : "Publish"}
              </button>
            )}
          </div>
        </div>

        {notice && (
          <div className={`mt-4 flex items-start gap-2 rounded-xl px-3.5 py-3 text-xs ${saveStatus === "error" ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-700"}`} role="status">
            {saveStatus === "error" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> : <CloudUpload className="mt-0.5 h-4 w-4 shrink-0 text-[#157670]" />}
            {notice}
          </div>
        )}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.78fr)]">
        <section className="min-w-0 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
          <div className="flex overflow-x-auto border-b border-slate-200 px-2 sm:px-4" role="tablist" aria-label="Page editor sections">
            {([
              ["content", FileText, "Content"],
              ["seo", SearchCheck, "SEO"],
              ["history", History, "History"],
            ] as const).map(([tab, Icon, label]) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`flex h-14 shrink-0 items-center gap-2 border-b-2 px-4 text-xs font-bold transition ${activeTab === tab ? "border-[#157670] text-[#157670]" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "content" && (
              <div className="space-y-7">
                <fieldset disabled={!canEdit} className="space-y-4 disabled:opacity-75">
                  {page.path !== "/" && (
                    <CollapsibleSection eyebrow="Hero content" title="Page introduction" defaultOpen>
                      <div className="space-y-5">
                        <label className="block text-xs font-bold text-slate-700">
                          Eyebrow
                          <input value={draft.hero.eyebrow} onChange={(event) => updateHero("eyebrow", event.target.value)} maxLength={120} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-normal outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                        </label>
                        <label className="block text-xs font-bold text-slate-700">
                          Page title
                          <input value={draft.hero.title} onChange={(event) => updateHero("title", event.target.value)} required maxLength={140} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-normal outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                          <span className="mt-1.5 block text-right text-[10px] font-normal text-slate-400">{draft.hero.title.length}/140</span>
                        </label>
                        <label className="block text-xs font-bold text-slate-700">
                          Accent title <span className="font-normal text-slate-400">(shown in gold/teal after the title above)</span>
                          <input value={draft.hero.accentTitle} onChange={(event) => updateHero("accentTitle", event.target.value)} maxLength={140} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-normal outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                        </label>
                        <label className="block text-xs font-bold text-slate-700">
                          Subtitle
                          <textarea value={draft.hero.subtitle} onChange={(event) => updateHero("subtitle", event.target.value)} maxLength={500} rows={4} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-normal leading-6 outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                          <span className="mt-1.5 block text-right text-[10px] font-normal text-slate-400">{draft.hero.subtitle.length}/500</span>
                        </label>

                        {!pagesWithoutHeroCtaButtons.includes(page.path) && (
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 p-4">
                              <p className="text-xs! font-bold text-slate-800">Primary CTA</p>
                              <div className="mt-3 space-y-3">
                                <input aria-label="Primary CTA label" value={draft.hero.primaryCta.label} onChange={(event) => updateHero("primaryCta", { ...draft.hero.primaryCta, label: event.target.value })} placeholder="Button label" maxLength={80} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#157670]" />
                                <input aria-label="Primary CTA link" value={draft.hero.primaryCta.href} onChange={(event) => updateHero("primaryCta", { ...draft.hero.primaryCta, href: event.target.value })} placeholder="/contact" maxLength={500} className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono text-xs outline-none focus:border-[#157670]" />
                              </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-4">
                              <p className="text-xs! font-bold text-slate-800">Secondary CTA</p>
                              <div className="mt-3 space-y-3">
                                <input aria-label="Secondary CTA label" value={draft.hero.secondaryCta.label} onChange={(event) => updateHero("secondaryCta", { ...draft.hero.secondaryCta, label: event.target.value })} placeholder="Button label" maxLength={80} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#157670]" />
                                <input aria-label="Secondary CTA link" value={draft.hero.secondaryCta.href} onChange={(event) => updateHero("secondaryCta", { ...draft.hero.secondaryCta, href: event.target.value })} placeholder="/brands" maxLength={500} className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono text-xs outline-none focus:border-[#157670]" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleSection>
                  )}

                  {page.path !== "/" && (
                    <CollapsibleSection eyebrow="Hero image" title="Background media">
                      <MediaPicker
                        label="Background image"
                        value={draft.hero.image}
                        canUpload={canUpload}
                        onChange={(image) => updateHero("image", { assetId: image.assetId ?? draft.hero.image.assetId, url: image.url, alt: image.alt ?? draft.hero.image.alt })}
                      />
                      <label className="mt-4 block text-xs font-bold text-slate-700">
                        Alternative text
                        <input value={draft.hero.image.alt} onChange={(event) => updateHero("image", { ...draft.hero.image, alt: event.target.value })} maxLength={180} placeholder="Describe the image" className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#157670]" />
                      </label>
                    </CollapsibleSection>
                  )}

                  {page.path === "/" && <HomeSlidesEditor slides={draft.hero.slides.length === 4 ? draft.hero.slides : homeSlideDefaults} onChange={(slides) => updateHero("slides", slides)} canUpload={canUpload} />}
                  {page.path === "/" && <HomeStatsEditor value={draft.hero.stats} onChange={(stats) => updateHero("stats", stats)} canUpload={canUpload} />}
                  {page.path === "/" && <HomeMapEditor value={draft.hero.map} onChange={(map) => updateHero("map", map)} />}
                  {page.path === "/" && <HomeOwnedHospitalityEditor value={draft.hero.ownedHospitality} onChange={(ownedHospitality) => updateHero("ownedHospitality", ownedHospitality)} canUpload={canUpload} />}
                  {page.path === "/" && <HomeEnterpriseSolutionsEditor value={draft.hero.enterpriseSolutions} onChange={(enterpriseSolutions) => updateHero("enterpriseSolutions", enterpriseSolutions)} />}
                  {page.path === "/" && (
                    <HospitalityTransportationEditor
                      value={draft.hero.homeTransportation}
                      onChange={(homeTransportation) => updateHero("homeTransportation", homeTransportation)}
                      canUpload={canUpload}
                      eyebrow="Home page"
                      title="Transportation section"
                      description="The VIP Transportation section shown on the Home page, above the footer."
                    />
                  )}
                  {page.path === "/hospitality" && <HospitalityStatsEditor value={draft.hero.hospitalityStats} onChange={(hospitalityStats) => updateHero("hospitalityStats", hospitalityStats)} />}
                  {page.path === "/contact" && <ContactOfficesEditor value={draft.hero.contactOffices} onChange={(contactOffices) => updateHero("contactOffices", contactOffices)} />}
                  {page.path === "/contact" && <ContactPanelEditor value={draft.hero.contactPanel} onChange={(contactPanel) => updateHero("contactPanel", contactPanel)} />}
                  {page.path.startsWith("/hospitality/") && (
                    <HospitalityIntroCtaEditor
                      introHeading={draft.hero.introHeading}
                      introBody={draft.hero.introBody}
                      ctaHeading={draft.hero.ctaHeading}
                      ctaBody={draft.hero.ctaBody}
                      trustBadges={draft.hero.trustBadges}
                      onChange={(value) => {
                        updateHero("introHeading", value.introHeading);
                        updateHero("introBody", value.introBody);
                        updateHero("ctaHeading", value.ctaHeading);
                        updateHero("ctaBody", value.ctaBody);
                        updateHero("trustBadges", value.trustBadges);
                      }}
                    />
                  )}
                  {page.path === "/hospitality" && <HospitalityRegionsEditor value={draft.hero.hospitalityRegions} onChange={(hospitalityRegions) => updateHero("hospitalityRegions", hospitalityRegions)} canUpload={canUpload} />}
                  {page.path === "/hospitality" && <HospitalityTransportationEditor value={draft.hero.transportation} onChange={(transportation) => updateHero("transportation", transportation)} canUpload={canUpload} />}
                </fieldset>
              </div>
            )}

            {activeTab === "seo" && (
              <fieldset disabled={!canEdit} className="space-y-5 disabled:opacity-75">
                <div>
                  <p className="text-[10px]! font-bold uppercase tracking-[0.16em] text-[#157670]">Search metadata</p>
                  <h3 className="mt-1 text-lg! leading-7! font-bold text-[#0f172a]">SEO and social sharing</h3>
                  <p className="mt-1 text-xs! leading-5! text-slate-500">Draft metadata is published together with the page.</p>
                </div>
                <label className="block text-xs font-bold text-slate-700">
                  SEO title
                  <input value={draft.seo.title} onChange={(event) => updateSeo("title", event.target.value)} maxLength={70} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-normal outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                  <span className="mt-1.5 block text-right text-[10px] font-normal text-slate-400">{draft.seo.title.length}/70</span>
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Meta description
                  <textarea value={draft.seo.description} onChange={(event) => updateSeo("description", event.target.value)} maxLength={170} rows={4} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-normal leading-6 outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                  <span className="mt-1.5 block text-right text-[10px] font-normal text-slate-400">{draft.seo.description.length}/170</span>
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Canonical path
                  <input value={draft.seo.canonicalPath} onChange={(event) => updateSeo("canonicalPath", event.target.value)} maxLength={500} placeholder={page.path} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 font-mono text-sm font-normal outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Social image URL
                  <input value={draft.seo.ogImage} onChange={(event) => updateSeo("ogImage", event.target.value)} maxLength={2000} placeholder={draft.hero.image.url} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-normal outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                </label>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs! font-semibold text-blue-700">{draft.seo.title || draft.hero.title}</p>
                  <p className="mt-1 truncate text-[10px]! text-emerald-700">https://flashtour.travel{draft.seo.canonicalPath || page.path}</p>
                  <p className="mt-2 line-clamp-2 text-xs! leading-5! text-slate-600">{draft.seo.description || draft.hero.subtitle}</p>
                </div>
              </fieldset>
            )}

            {activeTab === "history" && (
              <div>
                <div>
                  <p className="text-[10px]! font-bold uppercase tracking-[0.16em] text-[#157670]">Version history</p>
                  <h3 className="mt-1 text-lg! leading-7! font-bold text-[#0f172a]">Recent versions</h3>
                  <p className="mt-1 text-xs! leading-5! text-slate-500">Restore any version into the current draft. The live page is unchanged until publishing.</p>
                </div>
                <div className="mt-5 space-y-3">
                  {page.revisions.map((revision) => (
                    <article key={revision.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <Clock3 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs! font-bold text-slate-800">Version {revision.version}</p>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-600">{eventLabel(revision.event)}</span>
                        </div>
                        <p className="mt-1 text-[10px]! text-slate-500">{formatRevisionDate(revision.createdAt)}{revision.authorName ? ` · ${revision.authorName}` : ""}</p>
                      </div>
                      {canEdit && (
                        <button type="button" disabled={busyAction !== null} onClick={() => handleRestore(revision.id, revision.version)} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-[10px] font-bold text-slate-600 hover:border-[#157670]/30 hover:text-[#157670] disabled:opacity-50">
                          {busyAction === "restore" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />} Restore
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className={`${mobilePreview ? "block" : "hidden"} min-w-0 xl:block`}>
          <div className="space-y-3 xl:sticky xl:top-0">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Smartphone className="h-4 w-4 text-[#157670]" /> Live draft preview
              </div>
              <span className="text-[10px] text-slate-400">Updates instantly</span>
            </div>
            <PageLivePreview hero={draft.hero} path={page.path} isPublished={enabled} />
          </div>
        </aside>
      </div>
      {dialog}
    </div>
  );
}
