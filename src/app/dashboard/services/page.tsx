import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/cms/module-placeholder";

export const metadata: Metadata = { title: "Services" };

export default function ServicesModulePage() {
  return <ModulePlaceholder title="Services" description="Service collection editing is intentionally reserved for a later implementation phase." />;
}
