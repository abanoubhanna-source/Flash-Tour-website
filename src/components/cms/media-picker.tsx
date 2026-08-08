"use client";

import { useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LibraryAsset = { id: string; bucket: string; storage_path: string; original_name: string; alt_text: string };
type MediaPickerValue = { url: string; alt?: string; assetId?: string | null };
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function describeUploadError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error !== null) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return "Upload failed. Check your connection and try again.";
}

async function hashFile(file: File) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function MediaPicker({ value, onChange, label, canUpload = true }: { value: MediaPickerValue; onChange: (value: MediaPickerValue) => void; label?: string; canUpload?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"library" | "upload">("library");
  const [assets, setAssets] = useState<LibraryAsset[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const supabase = createSupabaseBrowserClient();

  async function openPicker() {
    setOpen(true);
    setNotice("");
    if (assets !== null) return;
    setLoading(true);
    const { data } = await supabase
      .from("media_assets")
      .select("id,bucket,storage_path,original_name,alt_text")
      .eq("status", "ready")
      .order("created_at", { ascending: false })
      .limit(60);
    setAssets(data ?? []);
    setLoading(false);
  }

  function selectAsset(asset: LibraryAsset) {
    const { data } = supabase.storage.from(asset.bucket).getPublicUrl(asset.storage_path);
    onChange({ assetId: asset.id, url: data.publicUrl, alt: value.alt || asset.alt_text || asset.original_name });
    setOpen(false);
  }

  async function uploadFile(file: File | undefined) {
    if (!file) return;
    if (!allowedTypes.has(file.type) || file.size > 15 * 1024 * 1024) {
      setNotice("Use JPG, PNG, WebP, or AVIF up to 15 MB.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      const { data: userResult } = await supabase.auth.getUser();
      const userId = userResult.user?.id;
      if (!userId) throw new Error("Sign in again to upload images.");
      const checksum = await hashFile(file);
      const { data: existing } = await supabase
        .from("media_assets")
        .select("id,bucket,storage_path,original_name,alt_text")
        .eq("checksum", checksum)
        .eq("status", "ready")
        .maybeSingle();
      if (existing) {
        const { data: pub } = supabase.storage.from(existing.bucket).getPublicUrl(existing.storage_path);
        onChange({ assetId: existing.id, url: pub.publicUrl, alt: value.alt || existing.alt_text || existing.original_name });
        setNotice("This image was already uploaded — reusing it.");
        setOpen(false);
        return;
      }
      const extension = file.name.split(".").pop()?.toLowerCase() || "image";
      const path = `uploads/${userId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data: asset, error } = await supabase
        .from("media_assets")
        .insert({ bucket: "site-media", storage_path: path, original_name: file.name, mime_type: file.type, byte_size: file.size, checksum, alt_text: value.alt || "", status: "ready", uploaded_by: userId })
        .select("id,bucket,storage_path")
        .single();
      if (error) {
        await supabase.storage.from("site-media").remove([path]);
        throw error;
      }
      const { data: pub } = supabase.storage.from(asset.bucket).getPublicUrl(asset.storage_path);
      onChange({ assetId: asset.id, url: pub.publicUrl, alt: value.alt });
      setAssets((current) => (current ? [{ id: asset.id, bucket: asset.bucket, storage_path: asset.storage_path, original_name: file.name, alt_text: value.alt || "" }, ...current] : current));
      setOpen(false);
    } catch (error) {
      setNotice(describeUploadError(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {label && <p className="text-xs font-bold text-slate-700">{label}</p>}
      <div className={`${label ? "mt-2" : ""} overflow-hidden rounded-xl border border-slate-200`}>
        <button
          type="button"
          onClick={openPicker}
          className="group relative block aspect-video w-full bg-slate-100 bg-cover bg-center"
          style={value.url ? { backgroundImage: `url("${value.url.replaceAll('"', "%22")}")` } : undefined}
        >
          {!value.url && (
            <span className="flex h-full items-center justify-center text-slate-300">
              <ImageIcon className="h-8 w-8" />
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition-colors group-hover:bg-slate-950/40">
            <span className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-800 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">Choose image</span>
          </span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4" onClick={() => setOpen(false)}>
          <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => setMode("library")} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${mode === "library" ? "bg-[#157670] text-white" : "text-slate-600 hover:bg-slate-100"}`}>Media library</button>
                {canUpload && <button type="button" onClick={() => setMode("upload")} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${mode === "upload" ? "bg-[#157670] text-white" : "text-slate-600 hover:bg-slate-100"}`}>Upload new</button>}
              </div>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="overflow-y-auto p-4">
              {notice && <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{notice}</p>}
              {mode === "library" ? (
                loading ? (
                  <p className="text-xs text-slate-500">Loading…</p>
                ) : !assets?.length ? (
                  <p className="text-xs text-slate-500">No images uploaded yet. Switch to &quot;Upload new&quot; to add one.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {assets.map((asset) => {
                      const { data } = supabase.storage.from(asset.bucket).getPublicUrl(asset.storage_path);
                      return (
                        <button
                          key={asset.id}
                          type="button"
                          title={asset.original_name}
                          onClick={() => selectAsset(asset)}
                          className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 bg-cover bg-center hover:ring-2 hover:ring-[#157670]"
                          style={{ backgroundImage: `url("${data.publicUrl.replaceAll('"', "%22")}")` }}
                        />
                      );
                    })}
                  </div>
                )
              ) : (
                <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-50">
                  <Upload className="h-6 w-6" />
                  <span className="px-6 text-center text-xs font-bold">{busy ? "Uploading…" : "Click to upload — JPG, PNG, WebP, or AVIF, up to 15 MB"}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={(event) => void uploadFile(event.target.files?.[0])} className="sr-only" />
                </label>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
