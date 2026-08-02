"use client";

import { ChevronDown, PenLine } from "lucide-react";
import { PageEditor } from "./page-editor";
import type { CmsPageEditorData } from "@/lib/cms/pages/types";

type EmbeddedPageHeaderProps = {
  page: CmsPageEditorData;
  canEdit: boolean;
  canPublish: boolean;
  canUpload: boolean;
};

export function EmbeddedPageHeader({ page, canEdit, canPublish, canUpload }: EmbeddedPageHeaderProps) {
  return (
    <details className="group rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm open:shadow-md">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 select-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#157670]/8 text-[#157670]">
            <PenLine className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#157670]">Page header</p>
            <h2 className="mt-0.5 text-base font-bold text-slate-900">Edit the hero, image, and SEO for {page.path}</h2>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100 p-4 sm:p-5">
        <PageEditor page={page} canEdit={canEdit} canPublish={canPublish} canUpload={canUpload} embedded />
      </div>
    </details>
  );
}
