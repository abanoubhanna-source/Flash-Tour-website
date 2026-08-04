import type { Metadata } from "next";
import { HospitalityPropertyPage } from "@/components/hospitality/HospitalityPropertyPage";

export const metadata: Metadata = { title: "European Elegance | Flash Group" };

export default async function Page({ params }: { params: Promise<{ property: string }> }) {
  const { property } = await params;
  return <HospitalityPropertyPage region="european-elegance" propertySlug={property} />;
}
