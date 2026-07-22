import { Globe2 } from "lucide-react";
import type { ServiceContentData } from "@/lib/cms/services/schema";
import { RichText } from "@/components/content/rich-text";

export function ServicePreview({ content, published }: { content: ServiceContentData; published: boolean }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">/services#{content.slug}</span><span className={`h-2 w-2 rounded-full ${published ? "bg-emerald-500" : "bg-amber-500"}`} /></div>
      <div className="p-5 sm:p-7">
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-5"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50"><Globe2 className="h-8 w-8 text-[#157670]" /></div><div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#157670]">{content.eyebrow}</p><h3 className="mt-1 text-xl! font-bold leading-tight! text-slate-900">{content.title}</h3></div></div>
          <RichText value={content.description} className="mt-6 space-y-2 text-sm! leading-6! text-slate-500" />
          <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-[#157670] to-[#c8a45d]" />
        </div>
      </div>
    </div>
  );
}
