"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
  ImageIcon,
  Loader2,
  RefreshCcw,
  Rocket,
  Save,
  SearchCheck,
  Smartphone,
  Upload,
} from "lucide-react";
import {
  finalizeHeroUpload,
  prepareHeroUpload,
  publishPage,
  restorePageRevision,
  savePageDraft,
  unpublishPage,
} from "@/app/dashboard/pages/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { PageDraftData, PageHeroData, PageHeroSlideData, PageSeoData } from "@/lib/cms/pages/schema";
import type { CmsPageEditorData } from "@/lib/cms/pages/types";
import { PageLivePreview } from "./page-live-preview";

type EditorTab = "content" | "seo" | "history";
type SaveStatus = "saved" | "dirty" | "saving" | "error";

type PageEditorProps = {
  page: CmsPageEditorData;
  canEdit: boolean;
  canPublish: boolean;
  canUpload: boolean;
};

const homeSlideDefaults: PageHeroSlideData[] = [
  { id: "group", name: "Flash Group", eyebrow: "A 40-Year Hospitality Legacy", title: "Crafting Hospitality Since 1985", subtitle: "An Egyptian-born tourism and hospitality group owning Nile cruises, resorts, restaurants, yachts, and premium mobility assets across strategic destinations.", primaryCta: { label: "Partner With Flash Group", href: "/contact" }, secondaryCta: { label: "Explore Portfolio", href: "/brands" }, image: { assetId: null, url: "/images/egypt-bg.jpg", alt: "Flash Group" }, enabled: true },
  { id: "cruises", name: "Cruises", eyebrow: "Owned Nile Cruise Fleet", title: "Luxury Journeys on the Nile", subtitle: "A curated fleet of Nile vessels delivering controlled quality, seamless logistics, and unforgettable river experiences for global partners.", primaryCta: { label: "Discover Cruises", href: "/cruises" }, secondaryCta: { label: "Contact us", href: "/contact" }, image: { assetId: null, url: "/images/hospitality-cruise.jpg", alt: "Luxury Nile cruise" }, enabled: true },
  { id: "hospitality", name: "Hospitality", eyebrow: "Hotels, Resorts & Fine Dining", title: "Assets That Shape the Experience", subtitle: "From Red Sea sanctuaries and boutique heritage hotels to international resorts and restaurants, Flash Group owns the journey end-to-end.", primaryCta: { label: "Explore Hospitality", href: "/hospitality" }, secondaryCta: { label: "Contact us", href: "/contact" }, image: { assetId: null, url: "/images/zanzibar-bg.jpg", alt: "Flash Group hospitality" }, enabled: true },
  { id: "mobility", name: "Mobility", eyebrow: "Executive Transport Infrastructure", title: "Precision on Every Route", subtitle: "A premium fleet, trained chauffeurs, and operational control built for B2B travel, MICE, VIP transfers, and large-scale movements.", primaryCta: { label: "Our services", href: "/services" }, secondaryCta: { label: "Contact us", href: "/contact" }, image: { assetId: null, url: "/images/fleet-showcase.jpg", alt: "Flash Group executive mobility" }, enabled: true },
];

function draftSignature(draft: PageDraftData) {
  return JSON.stringify(draft);
}

function HomeSlidesEditor({ slides, onChange }: { slides: PageHeroSlideData[]; onChange: (slides: PageHeroSlideData[]) => void }) {
  const move = (index: number, direction: -1 | 1) => { const next = index + direction; if (next < 0 || next >= slides.length) return; const reordered = [...slides]; [reordered[index], reordered[next]] = [reordered[next], reordered[index]]; onChange(reordered); };
  const update = (index: number, value: PageHeroSlideData) => onChange(slides.map((slide, current) => current === index ? value : slide));
  return <section className="border-t border-slate-100 pt-7"><p className="text-[10px]! font-bold uppercase tracking-[0.16em] text-[#157670]">Home slider</p><h3 className="mt-1 text-lg! leading-7! font-bold text-[#0f172a]">Four hero slides</h3><p className="mt-1 text-xs text-slate-500">All four slides are saved, versioned, previewed, and published with the Home page. Use the arrows to change their public order.</p><div className="mt-4 space-y-4">{slides.map((slide, index) => <article key={slide.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-2"><p className="flex-1 text-xs font-bold">Slide {index + 1}</p><label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600"><input type="checkbox" aria-label={`Slide ${index + 1} enabled`} checked={slide.enabled} onChange={(event) => update(index, { ...slide, enabled: event.target.checked })} className="h-3.5 w-3.5 rounded border-slate-300" />Enabled</label><button type="button" aria-label="Move slide up" disabled={index === 0} onClick={() => move(index, -1)} className="rounded-lg border p-2 disabled:opacity-40"><ArrowUp className="h-3 w-3" /></button><button type="button" aria-label="Move slide down" disabled={index === slides.length - 1} onClick={() => move(index, 1)} className="rounded-lg border p-2 disabled:opacity-40"><ArrowDown className="h-3 w-3" /></button></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><input aria-label={`Slide ${index + 1} tab label`} value={slide.name} onChange={(event) => update(index, { ...slide, name: event.target.value })} placeholder="Navigation label" className="h-10 rounded-xl border px-3 text-sm" /><input aria-label={`Slide ${index + 1} eyebrow`} value={slide.eyebrow} onChange={(event) => update(index, { ...slide, eyebrow: event.target.value })} placeholder="Eyebrow" className="h-10 rounded-xl border px-3 text-sm" /></div><input aria-label={`Slide ${index + 1} title`} value={slide.title} onChange={(event) => update(index, { ...slide, title: event.target.value })} placeholder="Title" className="mt-3 h-10 w-full rounded-xl border px-3 text-sm" /><textarea aria-label={`Slide ${index + 1} subtitle`} value={slide.subtitle} onChange={(event) => update(index, { ...slide, subtitle: event.target.value })} placeholder="Subtitle" rows={3} className="mt-3 w-full rounded-xl border px-3 py-2 text-sm" /><div className="mt-3 grid gap-3 sm:grid-cols-2"><input aria-label={`Slide ${index + 1} image URL`} value={slide.image.url} onChange={(event) => update(index, { ...slide, image: { ...slide.image, url: event.target.value } })} placeholder="Image URL" className="h-10 rounded-xl border px-3 text-sm" /><input aria-label={`Slide ${index + 1} image alt`} value={slide.image.alt} onChange={(event) => update(index, { ...slide, image: { ...slide.image, alt: event.target.value } })} placeholder="Image alt text" className="h-10 rounded-xl border px-3 text-sm" /></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><input aria-label={`Slide ${index + 1} primary CTA`} value={slide.primaryCta.label} onChange={(event) => update(index, { ...slide, primaryCta: { ...slide.primaryCta, label: event.target.value } })} placeholder="Primary CTA label" className="h-10 rounded-xl border px-3 text-sm" /><input aria-label={`Slide ${index + 1} primary CTA URL`} value={slide.primaryCta.href} onChange={(event) => update(index, { ...slide, primaryCta: { ...slide.primaryCta, href: event.target.value } })} placeholder="Primary CTA URL" className="h-10 rounded-xl border px-3 text-sm" /></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><input aria-label={`Slide ${index + 1} secondary CTA`} value={slide.secondaryCta.label} onChange={(event) => update(index, { ...slide, secondaryCta: { ...slide.secondaryCta, label: event.target.value } })} placeholder="Secondary CTA label" className="h-10 rounded-xl border px-3 text-sm" /><input aria-label={`Slide ${index + 1} secondary CTA URL`} value={slide.secondaryCta.href} onChange={(event) => update(index, { ...slide, secondaryCta: { ...slide.secondaryCta, href: event.target.value } })} placeholder="Secondary CTA URL" className="h-10 rounded-xl border px-3 text-sm" /></div></article>)}</div></section>;
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

async function sha256(file: File) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function imageDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  try {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  } catch {
    return { width: null, height: null };
  }
}

export function PageEditor({ page, canEdit, canPublish, canUpload }: PageEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<PageDraftData>({ hero: page.hero, seo: page.seo });
  const [activeTab, setActiveTab] = useState<EditorTab>("content");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [notice, setNotice] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(page.enabled);
  const [busyAction, setBusyAction] = useState<"publish" | "unpublish" | "version" | "restore" | "upload" | null>(null);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [savedSignature, setSavedSignature] = useState(() => draftSignature(draft));
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

  useEffect(() => {
    if (!canEdit || !isDirty || savingRef.current || busyAction !== null) return;
    const timer = window.setTimeout(() => void performSave(false), 1400);
    return () => window.clearTimeout(timer);
  }, [busyAction, canEdit, draft, isDirty, performSave]);

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
    if (!window.confirm("Publish this draft to the live website?")) return;
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
    if (!window.confirm("Move this page back to draft? It will no longer be available publicly.")) return;
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
    if (!window.confirm(`Restore version ${version} as the current draft?`)) return;
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

  async function handleImageUpload(file: File | undefined) {
    if (!file) return;
    setBusyAction("upload");
    setNotice(null);
    try {
      const [checksum, dimensions] = await Promise.all([sha256(file), imageDimensions(file)]);
      const preparation = await prepareHeroUpload({
        pageId: page.id,
        fileName: file.name,
        mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/avif",
        byteSize: file.size,
        checksum,
      });
      if (!preparation.ok) throw new Error(preparation.message);

      let uploaded: { assetId: string; url: string };
      if (preparation.existing) {
        uploaded = preparation;
      } else {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.storage
          .from("site-media")
          .uploadToSignedUrl(preparation.path, preparation.token, file, { contentType: file.type });
        if (error) throw error;
        const finalized = await finalizeHeroUpload({
          pageId: page.id,
          fileName: file.name,
          mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/avif",
          byteSize: file.size,
          checksum,
          storagePath: preparation.path,
          width: dimensions.width,
          height: dimensions.height,
          altText: draftRef.current.hero.image.alt,
        });
        if (!finalized.ok) throw new Error(finalized.message);
        uploaded = finalized;
      }

      updateHero("image", {
        ...draftRef.current.hero.image,
        assetId: uploaded.assetId,
        url: uploaded.url,
      });
      setNotice("Hero image uploaded. Autosave will attach it to this draft.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setBusyAction(null);
    }
  }

  const statusDetails = {
    saved: { icon: Check, label: "All changes saved", className: "text-emerald-700" },
    dirty: { icon: Cloud, label: "Unsaved changes", className: "text-amber-700" },
    saving: { icon: Loader2, label: "Autosaving…", className: "text-blue-700" },
    error: { icon: CloudAlert, label: "Save failed", className: "text-red-700" },
  }[saveStatus];
  const StatusIcon = statusDetails.icon;

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Link href="/dashboard/pages" className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="Back to pages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-xl! leading-7! font-bold text-[#0f172a]">{page.name}</h2>
                <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {enabled ? "Published" : "Draft"}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
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
            {canPublish && (
              enabled ? (
                <button type="button" disabled={busyAction !== null} onClick={handleUnpublish} className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50">
                  {busyAction === "unpublish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />} Move to draft
                </button>
              ) : (
                <button type="button" disabled={busyAction !== null} onClick={handlePublish} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white hover:bg-[#105f5a] disabled:opacity-50">
                  {busyAction === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />} Publish
                </button>
              )
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
                <fieldset disabled={!canEdit} className="space-y-5 disabled:opacity-75">
                  <div>
                    <p className="text-[10px]! font-bold uppercase tracking-[0.16em] text-[#157670]">Hero content</p>
                    <h3 className="mt-1 text-lg! leading-7! font-bold text-[#0f172a]">Page introduction</h3>
                  </div>
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
                    Subtitle
                    <textarea value={draft.hero.subtitle} onChange={(event) => updateHero("subtitle", event.target.value)} maxLength={500} rows={4} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-normal leading-6 outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                    <span className="mt-1.5 block text-right text-[10px] font-normal text-slate-400">{draft.hero.subtitle.length}/500</span>
                  </label>

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

                  <div className="border-t border-slate-100 pt-7">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px]! font-bold uppercase tracking-[0.16em] text-[#157670]">Hero image</p>
                        <h3 className="mt-1 text-lg! leading-7! font-bold text-[#0f172a]">Background media</h3>
                      </div>
                      <ImageIcon className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                      <div className="relative aspect-[16/7] bg-slate-100 bg-cover bg-center" style={{ backgroundImage: `url(${draft.hero.image.url || "/images/egypt-bg.jpg"})` }}>
                        <div className="absolute inset-0 bg-slate-950/25" />
                        {canUpload && (
                          <label className="absolute inset-0 flex cursor-pointer items-center justify-center">
                            <span className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-xs font-bold text-slate-800 shadow-lg backdrop-blur hover:bg-white">
                              {busyAction === "upload" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                              {busyAction === "upload" ? "Uploading…" : "Replace image"}
                            </span>
                            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busyAction === "upload"} onChange={(event) => void handleImageUpload(event.target.files?.[0])} className="sr-only" />
                          </label>
                        )}
                      </div>
                      <div className="p-4">
                        <label className="block text-xs font-bold text-slate-700">
                          Alternative text
                          <input value={draft.hero.image.alt} onChange={(event) => updateHero("image", { ...draft.hero.image, alt: event.target.value })} maxLength={180} placeholder="Describe the image" className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#157670]" />
                        </label>
                        <p className="mt-2 truncate text-[10px]! text-slate-400">{draft.hero.image.url}</p>
                      </div>
                    </div>
                  </div>
                  {page.path === "/" && <HomeSlidesEditor slides={draft.hero.slides.length === 4 ? draft.hero.slides : homeSlideDefaults} onChange={(slides) => updateHero("slides", slides)} />}
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
    </div>
  );
}
