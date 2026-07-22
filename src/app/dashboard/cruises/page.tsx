import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/cms/module-placeholder";

export const metadata: Metadata = { title: "Cruises" };

export default function CruisesModulePage() {
  return <ModulePlaceholder title="Cruises" description="Cruise content editing is intentionally outside the Phase 2 scope." />;
}
