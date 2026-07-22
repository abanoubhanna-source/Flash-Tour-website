import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/cms/module-placeholder";

export const metadata: Metadata = { title: "Hospitality" };

export default function HospitalityModulePage() {
  return <ModulePlaceholder title="Hospitality" description="Hospitality collection editing will be implemented incrementally in a later phase." />;
}
