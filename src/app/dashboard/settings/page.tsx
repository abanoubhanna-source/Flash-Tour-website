import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/cms/module-placeholder";

export const metadata: Metadata = { title: "Website Settings" };

export default function SettingsModulePage() {
  return <ModulePlaceholder title="Website Settings" description="Global website-setting controls will be added after the publishing workflow is ready." permission="settings.view" />;
}
