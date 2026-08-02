"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  Cloud,
  CloudAlert,
  CloudUpload,
  FileText,
  History,
  Loader2,
  RefreshCcw,
  Rocket,
  Save,
  SearchCheck,
} from "lucide-react";
import {
  publishAboutPage,
  restoreAboutRevision,
  saveAboutDraft,
  unpublishPage,
} from "@/app/dashboard/pages/actions";
import { MediaPicker } from "@/components/cms/media-picker";
import type {
  AboutBodySectionData,
  AboutCeoMessageData,
  AboutExpansionJourneyData,
  AboutHeroIntroData,
  AboutHighlightsData,
  AboutListData,
  AboutSectionsData,
  AboutTeamData,
} from "@/lib/cms/pages/about-schema";
import type { CmsAboutPageEditorData } from "@/lib/cms/pages/types";
import type { PageSeoData } from "@/lib/cms/pages/schema";

type EditorTab = "content" | "seo" | "history";
type SaveStatus = "saved" | "dirty" | "saving" | "error";

type AboutPageEditorProps = {
  page: CmsAboutPageEditorData;
  canEdit: boolean;
  canPublish: boolean;
  canUpload: boolean;
};

type AboutDraftData = { sections: AboutSectionsData; seo: PageSeoData };

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

function draftSignature(draft: AboutDraftData) {
  return JSON.stringify(draft);
}

function BodySectionFields({ value, onChange }: { value: AboutBodySectionData; onChange: (value: AboutBodySectionData) => void }) {
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-slate-700">Title
        <input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="block text-xs font-bold text-slate-700">Body
        <textarea value={value.body} onChange={(event) => onChange({ ...value, body: event.target.value })} rows={4} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
    </div>
  );
}

function HeroIntroFields({ value, onChange }: { value: AboutHeroIntroData; onChange: (value: AboutHeroIntroData) => void }) {
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-slate-700">Eyebrow
        <input value={value.eyebrow} onChange={(event) => onChange({ ...value, eyebrow: event.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="block text-xs font-bold text-slate-700">Title
        <input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="block text-xs font-bold text-slate-700">Body
        <textarea value={value.body} onChange={(event) => onChange({ ...value, body: event.target.value })} rows={4} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
    </div>
  );
}

function HighlightsFields({ value, onChange }: { value: AboutHighlightsData; onChange: (value: AboutHighlightsData) => void }) {
  const update = (index: number, item: { label: string; value: string }) => onChange({ ...value, items: value.items.map((current, i) => (i === index ? item : current)) });
  const add = () => onChange({ ...value, items: [...value.items, { label: "", value: "" }] });
  const remove = (index: number) => onChange({ ...value, items: value.items.filter((_, i) => i !== index) });
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-slate-700">Title
        <input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <div className="space-y-2">
        {value.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3">
            <input aria-label={`Highlight ${index + 1} label`} value={item.label} onChange={(event) => update(index, { ...item, label: event.target.value })} placeholder="Label" className="h-10 flex-1 rounded-xl border px-3 text-sm" />
            <input aria-label={`Highlight ${index + 1} value`} value={item.value} onChange={(event) => update(index, { ...item, value: event.target.value })} placeholder="Value" className="h-10 flex-1 rounded-xl border px-3 text-sm" />
            <button type="button" aria-label={`Remove highlight ${index + 1}`} onClick={() => remove(index)} className="text-[10px] font-bold text-red-600">Remove</button>
          </div>
        ))}
        <button type="button" onClick={add} className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add highlight</button>
      </div>
    </div>
  );
}

function ListFields({ value, onChange, itemLabel }: { value: AboutListData; onChange: (value: AboutListData) => void; itemLabel: string }) {
  const update = (index: number, text: string) => onChange({ ...value, items: value.items.map((current, i) => (i === index ? text : current)) });
  const add = () => onChange({ ...value, items: [...value.items, ""] });
  const remove = (index: number) => onChange({ ...value, items: value.items.filter((_, i) => i !== index) });
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-slate-700">Title
        <input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <div className="space-y-2">
        {value.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input aria-label={`${itemLabel} ${index + 1}`} value={item} onChange={(event) => update(index, event.target.value)} className="h-10 flex-1 rounded-xl border px-3 text-sm" />
            <button type="button" aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`} onClick={() => remove(index)} className="text-[10px] font-bold text-red-600">Remove</button>
          </div>
        ))}
        <button type="button" onClick={add} className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add {itemLabel.toLowerCase()}</button>
      </div>
    </div>
  );
}

function ExpansionJourneyFields({ value, onChange, canUpload }: { value: AboutExpansionJourneyData; onChange: (value: AboutExpansionJourneyData) => void; canUpload: boolean }) {
  const update = (index: number, milestone: AboutExpansionJourneyData["milestones"][number]) => onChange({ ...value, milestones: value.milestones.map((current, i) => (i === index ? milestone : current)) });
  const add = () => onChange({ ...value, milestones: [...value.milestones, { year: new Date().getFullYear(), brand: "", country: "", title: "", desc: "", image: { assetId: null, url: "", alt: "" } }] });
  const remove = (index: number) => onChange({ ...value, milestones: value.milestones.filter((_, i) => i !== index) });
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-slate-700">Title
        <input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="block text-xs font-bold text-slate-700">Subtitle
        <input value={value.subtitle} onChange={(event) => onChange({ ...value, subtitle: event.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="block text-xs font-bold text-slate-700">Body
        <textarea value={value.body} onChange={(event) => onChange({ ...value, body: event.target.value })} rows={3} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-700">Milestones</p>
        {value.milestones.map((milestone, index) => (
          <div key={index} className="space-y-2 rounded-xl border border-slate-200 p-3">
            <div className="grid grid-cols-[80px_1fr_1fr_auto] items-center gap-2">
              <input aria-label={`Milestone ${index + 1} year`} type="number" value={milestone.year} onChange={(event) => update(index, { ...milestone, year: Number(event.target.value) })} className="h-10 rounded-xl border px-2 text-sm" />
              <input aria-label={`Milestone ${index + 1} brand`} value={milestone.brand} onChange={(event) => update(index, { ...milestone, brand: event.target.value })} placeholder="Brand" className="h-10 rounded-xl border px-3 text-sm" />
              <input aria-label={`Milestone ${index + 1} country`} value={milestone.country} onChange={(event) => update(index, { ...milestone, country: event.target.value })} placeholder="Country" className="h-10 rounded-xl border px-3 text-sm" />
              <button type="button" aria-label={`Remove milestone ${index + 1}`} onClick={() => remove(index)} className="text-[10px] font-bold text-red-600">Remove</button>
            </div>
            <input aria-label={`Milestone ${index + 1} title`} value={milestone.title} onChange={(event) => update(index, { ...milestone, title: event.target.value })} placeholder="Timeline title (e.g. THE FOUNDATION)" className="h-10 w-full rounded-xl border px-3 text-sm" />
            <textarea aria-label={`Milestone ${index + 1} description`} value={milestone.desc} onChange={(event) => update(index, { ...milestone, desc: event.target.value })} placeholder="Timeline description" rows={2} className="w-full rounded-xl border px-3 py-2 text-sm" />
            <MediaPicker
              label="Milestone photo"
              value={milestone.image}
              canUpload={canUpload}
              onChange={(image) => update(index, { ...milestone, image: { assetId: image.assetId ?? milestone.image.assetId, url: image.url, alt: image.alt ?? milestone.image.alt } })}
            />
          </div>
        ))}
        <button type="button" onClick={add} className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add milestone</button>
      </div>
    </div>
  );
}

function CeoMessageFields({ value, onChange }: { value: AboutCeoMessageData; onChange: (value: AboutCeoMessageData) => void }) {
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-slate-700">Title
        <input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="block text-xs font-bold text-slate-700">Quote body
        <textarea value={value.body} onChange={(event) => onChange({ ...value, body: event.target.value })} rows={4} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-bold text-slate-700">Director name
          <input value={value.directorName} onChange={(event) => onChange({ ...value, directorName: event.target.value })} placeholder="Amgad Hassoun" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
        </label>
        <label className="block text-xs font-bold text-slate-700">Director title
          <input value={value.directorTitle} onChange={(event) => onChange({ ...value, directorTitle: event.target.value })} placeholder="Chairman" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
        </label>
      </div>
      <label className="block text-xs font-bold text-slate-700">Signature image URL
        <input value={value.signatureImageUrl} onChange={(event) => onChange({ ...value, signatureImageUrl: event.target.value })} placeholder="/images/Signuter.png" className="mt-2 h-11 w-full rounded-xl border px-3.5 font-mono text-xs" />
      </label>
    </div>
  );
}

function TeamFields({ value, onChange }: { value: AboutTeamData; onChange: (value: AboutTeamData) => void }) {
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-slate-700">Title
        <input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
      <label className="block text-xs font-bold text-slate-700">Body
        <textarea value={value.body} onChange={(event) => onChange({ ...value, body: event.target.value })} rows={4} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
      <label className="block text-xs font-bold text-slate-700">Team stats <span className="font-normal text-slate-400">(e.g. 5,000+)</span>
        <input value={value.stats} onChange={(event) => onChange({ ...value, stats: event.target.value })} placeholder="5,000+" className="mt-2 h-11 w-full rounded-xl border px-3.5 text-sm" />
      </label>
    </div>
  );
}

function formatRevisionDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function eventLabel(event: CmsAboutPageEditorData["revisions"][number]["event"]) {
  return {
    draft_saved: "Draft saved",
    published: "Published",
    unpublished: "Moved to draft",
    archived: "Archived",
    restored: "Restored",
  }[event];
}

export function AboutPageEditor({ page, canEdit, canPublish, canUpload }: AboutPageEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<AboutDraftData>({ sections: page.sections, seo: page.seo });
  const [activeTab, setActiveTab] = useState<EditorTab>("content");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [notice, setNotice] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(page.enabled);
  const [busyAction, setBusyAction] = useState<"publish" | "unpublish" | "version" | "restore" | null>(null);
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
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  const performSave = useCallback(async (createRevision: boolean) => {
    if (!canEdit || savingRef.current) return false;
    const payload = draftRef.current;
    const signature = draftSignature(payload);
    savingRef.current = true;
    setSaveStatus("saving");
    setNotice(null);
    const result = await saveAboutDraft(page.id, lockVersionRef.current, payload.sections, payload.seo, createRevision);
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

  function updateSection<K extends keyof AboutSectionsData>(key: K, value: AboutSectionsData[K]) {
    setDraft((current) => ({ ...current, sections: { ...current.sections, [key]: value } }));
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
    const result = await publishAboutPage(page.id, lockVersionRef.current, payload.sections, payload.seo);
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
    const result = await restoreAboutRevision(page.id, revisionId, lockVersionRef.current);
    setBusyAction(null);
    if (!result.ok) {
      setNotice(result.message);
      return;
    }
    if (!result.sections) {
      setNotice("The restored version did not contain valid page content.");
      return;
    }
    lockVersionRef.current = result.lockVersion;
    const restoredDraft = { sections: result.sections, seo: result.seo ?? page.seo };
    setSavedSignature(draftSignature(restoredDraft));
    draftRef.current = restoredDraft;
    setDraft(restoredDraft);
    setSaveStatus("saved");
    setNotice(result.message ?? "Version restored.");
    router.refresh();
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

        <div className="mt-4 rounded-xl bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
          The public /about page still renders fixed content and does not read from these sections yet — that wiring is a separate pass. This editor lets you draft and publish the content so it&apos;s ready when it does.
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.4fr)]">
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
              <fieldset disabled={!canEdit} className="space-y-4 disabled:opacity-75">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#157670]">Shown on the live page, in page order</p>
                <CollapsibleSection eyebrow="1. Hero" title="Hero intro" defaultOpen>
                  <HeroIntroFields value={draft.sections.hero_intro} onChange={(value) => updateSection("hero_intro", value)} />
                </CollapsibleSection>
                <CollapsibleSection eyebrow="2. Vision & Mission" title="Vision">
                  <BodySectionFields value={draft.sections.vision} onChange={(value) => updateSection("vision", value)} />
                </CollapsibleSection>
                <CollapsibleSection eyebrow="3. Vision & Mission" title="Mission">
                  <BodySectionFields value={draft.sections.mission} onChange={(value) => updateSection("mission", value)} />
                </CollapsibleSection>
                <CollapsibleSection eyebrow="4. The Evolution" title="Expansion journey (timeline)" description="Each milestone can have its own photo.">
                  <ExpansionJourneyFields value={draft.sections.expansion_journey} onChange={(value) => updateSection("expansion_journey", value)} canUpload={canUpload} />
                </CollapsibleSection>
                <CollapsibleSection eyebrow="5. CEO & Team" title="CEO message">
                  <CeoMessageFields value={draft.sections.ceo_message} onChange={(value) => updateSection("ceo_message", value)} />
                </CollapsibleSection>
                <CollapsibleSection eyebrow="6. CEO & Team" title="Team">
                  <TeamFields value={draft.sections.team} onChange={(value) => updateSection("team", value)} />
                </CollapsibleSection>

                <p className="pt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600">Not shown on the live page yet</p>
                <CollapsibleSection eyebrow="Not wired to the page" title="Experience">
                  <BodySectionFields value={draft.sections.experience} onChange={(value) => updateSection("experience", value)} />
                </CollapsibleSection>
                <CollapsibleSection eyebrow="Not wired to the page" title="Highlights">
                  <HighlightsFields value={draft.sections.highlights} onChange={(value) => updateSection("highlights", value)} />
                </CollapsibleSection>
                <CollapsibleSection eyebrow="Not wired to the page" title="Services summary">
                  <ListFields value={draft.sections.services_summary} onChange={(value) => updateSection("services_summary", value)} itemLabel="Service" />
                </CollapsibleSection>
                <CollapsibleSection eyebrow="Not wired to the page" title="Languages">
                  <ListFields value={draft.sections.languages} onChange={(value) => updateSection("languages", value)} itemLabel="Language" />
                </CollapsibleSection>
                <CollapsibleSection eyebrow="Not wired to the page" title="Work process">
                  <BodySectionFields value={draft.sections.work_process} onChange={(value) => updateSection("work_process", value)} />
                </CollapsibleSection>
              </fieldset>
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
                  <input value={draft.seo.ogImage} onChange={(event) => updateSeo("ogImage", event.target.value)} maxLength={2000} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-normal outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8" />
                </label>
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
                  {!page.revisions.length && <p className="text-sm text-slate-500">No versions yet.</p>}
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="min-w-0">
          <div className="space-y-3 xl:sticky xl:top-0 rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-700">About this editor</p>
            <p className="text-xs leading-5 text-slate-500">
              These 11 sections hold the About page&apos;s written content (bio, highlights, timeline, services, languages). Draft and publish here; wiring the public page to read them is a separate follow-up.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
