import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/cms/module-placeholder";

export const metadata: Metadata = { title: "Destinations" };

export default function DestinationsModulePage() {
  return <ModulePlaceholder title="Destinations" description="Destination content editing is not part of the dashboard-shell phase." />;
}
