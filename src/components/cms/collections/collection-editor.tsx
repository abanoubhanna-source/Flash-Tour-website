"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type Dispatch, type SetStateAction, type TransitionStartFunction } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, History, ImageOff, Plus, Rocket, Save, Trash2 } from "lucide-react";
import {
  archiveCollectionItem,
  publishCollectionItem,
  restoreCollectionRevision,
  saveCollectionDraft,
} from "@/app/dashboard/content/actions";
import { isValidExternalImageUrl, type ManagedContent, type ManagedDraft } from "@/lib/cms/collections/schema";
import type { CmsCollectionEditor } from "@/lib/cms/collections/types";

type ArrayField = "facilities" | "diningOptions" | "accessibility";
type Props = {
  entry: CmsCollectionEditor;
  mode: "hospitality" | "destinations" | "cruises" | "brands";
  canEdit: boolean;
  canPublish: boolean;
  canArchive: boolean;
};

const signature = (draft: ManagedDraft) => JSON.stringify(draft);
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function moveItem<T>(items: readonly T[], index: number, direction: -1 | 1): T[] {
  const destination = index + direction;
  if (index < 0 || destination < 0 || index >= items.length || destination >= items.length) return [...items];
  const next = [...items];
  [next[index], next[destination]] = [next[destination], next[index]];
  return next;
}

export function CollectionEditor({ entry, mode, canEdit, canPublish, canArchive }: Props) {
  const initialDraft: ManagedDraft = { content: entry.content, seo: entry.seo, parentId: entry.parentId };
  const [draft, setDraft] = useState<ManagedDraft>(initialDraft);
  const [saved, setSaved] = useState(signature(initialDraft));
  const [tab, setTab] = useState<"content" | "seo" | "history">("content");
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();
  const lockVersion = useRef(entry.lockVersion);
  const currentDraft = useRef(draft);
  const dirty = signature(draft) !== saved;
  const back = `/dashboard/${mode}`;

  useEffect(() => { currentDraft.current = draft; }, [draft]);
  useEffect(() => {
    if (!dirty || busy || !canEdit) return;
    const timeout = window.setTimeout(() => {
      startTransition(async () => {
        const response = await saveCollectionDraft({ id: entry.id, lockVersion: lockVersion.current, type: entry.type, draft: currentDraft.current });
        setNotice(response.message);
        if (response.ok) {
          lockVersion.current = response.lockVersion ?? lockVersion.current;
          setSaved(signature(currentDraft.current));
        }
      });
    }, 1400);
    return () => window.clearTimeout(timeout);
  }, [busy, canEdit, dirty, entry.id, entry.type, startTransition]);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const updateContent = <Key extends keyof ManagedContent>(key: Key, value: ManagedContent[Key]) => {
    setDraft((current) => ({ ...current, content: { ...current.content, [key]: value } }));
  };
  const updateArray = (key: ArrayField, values: string[]) => updateContent(key, values);
  const save = (createRevision: boolean) => startTransition(async () => {
    const response = await saveCollectionDraft({ id: entry.id, lockVersion: lockVersion.current, type: entry.type, draft: currentDraft.current }, createRevision);
    setNotice(response.message);
    if (response.ok) {
      lockVersion.current = response.lockVersion ?? lockVersion.current;
      setSaved(signature(currentDraft.current));
    }
  });
  const publish = () => {
    if (!window.confirm("Publish this item to the public website?")) return;
    startTransition(async () => {
      const response = await publishCollectionItem({ id: entry.id, lockVersion: lockVersion.current, type: entry.type, draft: currentDraft.current });
      setNotice(response.message);
      if (response.ok) window.location.reload();
    });
  };
  const archive = () => {
    if (!window.confirm("Archive this item?")) return;
    startTransition(async () => {
      const response = await archiveCollectionItem(entry.id, entry.type, lockVersion.current);
      setNotice(response.message);
      if (response.ok) window.location.assign(back);
    });
  };

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3">
            <Link href={back} className="flex h-9 w-9 items-center justify-center rounded-xl border" aria-label="Back to listing"><ArrowLeft className="h-4 w-4" /></Link>
            <div><h2 className="text-xl font-bold">{draft.content.title}</h2><p className="mt-1 text-xs text-slate-500">{entry.status} · {dirty ? "Unsaved changes" : "All changes saved"}</p></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {canEdit && <button type="button" disabled={busy} onClick={() => save(true)} className="inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold"><Save className="h-4 w-4" />Save version</button>}
            {canPublish && <button type="button" disabled={busy} onClick={publish} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white"><Rocket className="h-4 w-4" />{entry.status === "published" ? "Publish updates" : "Publish"}</button>}
            {canArchive && entry.status !== "archived" && <button type="button" disabled={busy} onClick={archive} className="h-10 rounded-xl border border-red-200 px-3 text-xs font-bold text-red-700">Archive</button>}
          </div>
        </div>
        {notice && <p role="status" className="mt-4 rounded-xl bg-slate-50 p-3 text-xs">{notice}</p>}
      </section>

      <section className="rounded-[1.5rem] border bg-white shadow-sm">
        <div className="flex border-b px-3">
          {(["content", "seo", "history"] as const).map((value) => <button type="button" onClick={() => setTab(value)} key={value} className={`h-12 border-b-2 px-4 text-xs font-bold ${tab === value ? "border-[#157670] text-[#157670]" : "border-transparent text-slate-500"}`}>{value === "history" && <History className="mr-1 inline h-4 w-4" />}{value[0].toUpperCase() + value.slice(1)}</button>)}
        </div>
        <fieldset disabled={!canEdit || busy} className="p-5 disabled:opacity-60">
          {tab === "content" && <ContentTab entry={entry} draft={draft} updateContent={updateContent} updateDraft={setDraft} updateArray={updateArray} />}
          {tab === "seo" && <SeoTab draft={draft} updateDraft={setDraft} />}
          {tab === "history" && <HistoryTab entry={entry} canEdit={canEdit} getLockVersion={() => lockVersion.current} setNotice={setNotice} startTransition={startTransition} />}
        </fieldset>
      </section>
    </div>
  );
}

function ContentTab({ entry, draft, updateContent, updateDraft, updateArray }: { entry: CmsCollectionEditor; draft: ManagedDraft; updateContent: <Key extends keyof ManagedContent>(key: Key, value: ManagedContent[Key]) => void; updateDraft: Dispatch<SetStateAction<ManagedDraft>>; updateArray: (key: ArrayField, values: string[]) => void }) {
  return <div className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Title" value={draft.content.title} onChange={(value) => { updateContent("title", value); updateContent("slug", slugify(value)); }} /><Field label="Slug" value={draft.content.slug} onChange={(value) => updateContent("slug", slugify(value))} /></div>
    {entry.type === "hospitality" && <label className="block text-xs font-bold">Category <span className="text-red-600">*</span><select required value={draft.content.categoryId ?? ""} onChange={(event) => updateContent("categoryId", event.target.value || null)} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm"><option value="">Choose category</option>{entry.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>}
    {entry.parents.length > 0 && <label className="block text-xs font-bold">Parent <span className="text-red-600">*</span><select value={draft.parentId ?? ""} onChange={(event) => updateDraft((current) => ({ ...current, parentId: event.target.value || null }))} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm"><option value="">Choose parent</option>{entry.parents.map((parent) => <option key={parent.id} value={parent.id}>{parent.title}</option>)}</select></label>}
    <div className="grid gap-4 sm:grid-cols-3"><Nullable label="Country" value={draft.content.country} onChange={(value) => updateContent("country", value)} /><Nullable label="Region" value={draft.content.region} onChange={(value) => updateContent("region", value)} /><Nullable label="Location" value={draft.content.location} onChange={(value) => updateContent("location", value)} /></div>
    <Area label="Short description" value={draft.content.shortDescription} onChange={(value) => updateContent("shortDescription", value)} rows={3} /><Area label="Rich text description" value={draft.content.fullDescription} onChange={(value) => updateContent("fullDescription", value)} rows={9} />
    <div className="grid gap-4 sm:grid-cols-2">
      {entry.type !== "destination_place" && entry.type !== "destination_attraction" && <Field label="Rooms / cabins" type="number" value={draft.content.roomsOrCabins?.toString() ?? ""} onChange={(value) => updateContent("roomsOrCabins", value === "" ? null : Number(value))} />}
      <Field label="Display order" type="number" value={String(draft.content.displayOrder)} onChange={(value) => updateContent("displayOrder", Number(value) || 0)} />
    </div>
    <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={draft.content.isActive} onChange={(event) => updateContent("isActive", event.target.checked)} />Active on public site when published</label>
    {entry.type !== "destination_place" && entry.type !== "destination_attraction" && (["facilities", "diningOptions", "accessibility"] as const).map((key) => <ArrayEditor key={key} label={key === "diningOptions" ? "Dining options" : key[0].toUpperCase() + key.slice(1)} values={draft.content[key]} onChange={(values) => updateArray(key, values)} />)}
    <GalleryEditor images={draft.content.gallery} onChange={(gallery) => updateContent("gallery", gallery)} />
  </div>;
}

function GalleryEditor({ images, onChange }: { images: ManagedContent["gallery"]; onChange: (images: ManagedContent["gallery"]) => void }) {
  return <div><div className="flex items-center justify-between"><h3 className="text-sm font-bold">Gallery</h3><button type="button" onClick={() => onChange([...images, { assetId: null, url: "", alt: "", caption: "" }])} className="text-xs font-bold text-[#157670]"><Plus className="inline h-4 w-4" />Add image</button></div>
    {images.map((image, index) => <GalleryRow key={`${image.assetId ?? "external"}-${index}-${image.url}`} image={image} index={index} count={images.length} onChange={(next) => onChange(images.map((item, itemIndex) => itemIndex === index ? next : item))} onMove={(direction) => onChange(moveItem(images, index, direction))} onRemove={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))} />)}
  </div>;
}

function GalleryRow({ image, index, count, onChange, onMove, onRemove }: { image: ManagedContent["gallery"][number]; index: number; count: number; onChange: (image: ManagedContent["gallery"][number]) => void; onMove: (direction: -1 | 1) => void; onRemove: () => void }) {
  const valid = isValidExternalImageUrl(image.url);
  return <div className="mt-3 grid gap-3 rounded-xl border p-3 sm:grid-cols-[160px_1fr]">
    <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-slate-100 bg-cover bg-center text-slate-400" style={valid ? { backgroundImage: `url("${image.url.replaceAll('"', "%22")}")` } : undefined}>{!valid && <ImageOff className="h-5 w-5" />}</div>
    <div className="space-y-2"><Field label="Image URL" value={image.url} onChange={(value) => onChange({ ...image, url: value })} /><p className={`text-[11px] ${image.url && !valid ? "text-red-600" : "text-slate-500"}`}>{image.url && !valid ? "Use a valid http:// or https:// image URL." : "A safe fallback is shown on the public website if this image cannot load."}</p><Field label="Alt text" value={image.alt} onChange={(value) => onChange({ ...image, alt: value })} /><Field label="Caption" value={image.caption} onChange={(value) => onChange({ ...image, caption: value })} /><div className="flex gap-2"><button type="button" disabled={index === 0} onClick={() => onMove(-1)} className="rounded-lg border p-2 disabled:opacity-40" aria-label="Move image up"><ArrowUp className="h-3 w-3" /></button><button type="button" disabled={index === count - 1} onClick={() => onMove(1)} className="rounded-lg border p-2 disabled:opacity-40" aria-label="Move image down"><ArrowDown className="h-3 w-3" /></button><button type="button" onClick={onRemove} className="ml-auto text-xs font-bold text-red-600"><Trash2 className="mr-1 inline h-3 w-3" />Remove</button></div></div>
  </div>;
}

function SeoTab({ draft, updateDraft }: { draft: ManagedDraft; updateDraft: Dispatch<SetStateAction<ManagedDraft>> }) {
  return <div className="space-y-4">
    <Field label="SEO title" value={draft.seo.title} onChange={(value) => updateDraft((current) => ({ ...current, seo: { ...current.seo, title: value } }))} />
    <Area label="SEO description" value={draft.seo.description} onChange={(value) => updateDraft((current) => ({ ...current, seo: { ...current.seo, description: value } }))} rows={3} />
    <Field label="Keywords (comma separated)" value={draft.seo.keywords.join(", ")} onChange={(value) => updateDraft((current) => ({ ...current, seo: { ...current.seo, keywords: value.split(",").map((keyword) => keyword.trim()).filter(Boolean) } }))} />
    <Field label="Canonical URL" value={draft.seo.canonicalUrl} onChange={(value) => updateDraft((current) => ({ ...current, seo: { ...current.seo, canonicalUrl: value } }))} />
    <Field label="OpenGraph image" value={draft.seo.openGraph.image} onChange={(value) => updateDraft((current) => ({ ...current, seo: { ...current.seo, openGraph: { ...current.seo.openGraph, image: value } } }))} />
  </div>;
}

function HistoryTab({ entry, canEdit, getLockVersion, setNotice, startTransition }: { entry: CmsCollectionEditor; canEdit: boolean; getLockVersion: () => number; setNotice: (value: string) => void; startTransition: TransitionStartFunction }) {
  return <div className="space-y-3">{entry.revisions.map((revision) => <article key={revision.id} className="flex items-center justify-between rounded-xl border p-3"><div><p className="text-xs font-bold">Version {revision.version} · {revision.event}</p><p className="text-[10px] text-slate-500">{new Date(revision.createdAt).toLocaleString()}</p></div>{canEdit && <button type="button" onClick={() => startTransition(async () => { const result = await restoreCollectionRevision(entry.id, entry.type, revision.id, getLockVersion()); setNotice(result.message); if (result.ok) window.location.reload(); })} className="rounded-lg border px-3 py-2 text-xs font-bold">Restore</button>}</article>)}{!entry.revisions.length && <p className="text-sm text-slate-500">No revisions yet.</p>}</div>;
}

function ArrayEditor({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  return <div><div className="flex items-center justify-between"><h3 className="text-sm font-bold">{label}</h3><button type="button" onClick={() => onChange([...values, "New item"])} className="text-xs font-bold text-[#157670]">+ Add</button></div>{values.map((value, index) => <div className="mt-2 flex gap-2" key={`${value}-${index}`}><input value={value} onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className="h-9 min-w-0 flex-1 rounded-lg border px-3 text-sm" /><button type="button" aria-label={`Move ${label} item up`} disabled={index === 0} onClick={() => onChange(moveItem(values, index, -1))} className="rounded-lg border px-2 disabled:opacity-40"><ArrowUp className="h-3 w-3" /></button><button type="button" aria-label={`Move ${label} item down`} disabled={index === values.length - 1} onClick={() => onChange(moveItem(values, index, 1))} className="rounded-lg border px-2 disabled:opacity-40"><ArrowDown className="h-3 w-3" /></button><button type="button" aria-label={`Remove ${label} item`} onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg border px-2 text-red-600"><Trash2 className="h-3 w-3" /></button></div>)}</div>;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <label className="block text-xs font-bold">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm font-normal" /></label>; }
function Nullable({ label, value, onChange }: { label: string; value: string | null; onChange: (value: string | null) => void }) { return <label className="block text-xs font-bold">{label}<input value={value ?? ""} onChange={(event) => onChange(event.target.value || null)} className="mt-2 h-10 w-full rounded-xl border px-3 text-sm font-normal" /></label>; }
function Area({ label, value, onChange, rows }: { label: string; value: string; onChange: (value: string) => void; rows: number }) { return <label className="block text-xs font-bold">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm font-normal" /></label>; }
