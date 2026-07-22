import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/cms/module-placeholder";

export const metadata: Metadata = { title: "Brands" };

export default function BrandsModulePage() {
  return <ModulePlaceholder title="Brands" description="Brand collection editing will be enabled after the CMS content engine is implemented." />;
}
