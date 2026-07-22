import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/cms/module-placeholder";

export const metadata: Metadata = { title: "Pages" };

export default function PagesModulePage() {
  return <ModulePlaceholder title="Pages" description="Page and section editing will be introduced in the content-management phase." />;
}
