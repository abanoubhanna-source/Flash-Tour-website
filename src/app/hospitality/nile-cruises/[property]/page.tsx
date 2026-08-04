import type { Metadata } from "next";
import { HospitalityPropertyPage } from "@/components/hospitality/HospitalityPropertyPage";

export const metadata: Metadata = { title: "Nile Cruises | Flash Group" };

export default async function Page({ params }: { params: Promise<{ property: string }> }) {
  const { property } = await params;
  return <HospitalityPropertyPage region="nile-cruises" propertySlug={property} />;
}
