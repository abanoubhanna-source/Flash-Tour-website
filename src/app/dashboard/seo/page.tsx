import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/cms/module-placeholder";

export const metadata: Metadata = { title: "SEO" };

export default function SeoModulePage() {
  return <ModulePlaceholder title="SEO" description="Page metadata and search-preview editing will be activated in a later CMS phase." permission="seo.view" />;
}
