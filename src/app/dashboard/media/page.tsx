import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/cms/module-placeholder";

export const metadata: Metadata = { title: "Media Library" };

export default function MediaModulePage() {
  return <ModulePlaceholder title="Media Library" description="Asset upload and media management will be delivered as a dedicated phase." permission="media.view" />;
}
