import type { Metadata } from "next";
import { DestinationDetailPage } from "@/components/destinations/DestinationDetailPage";

export const metadata: Metadata = { title: "Destinations | Flash Group" };

export default async function Page({ params }: { params: Promise<{ place: string }> }) {
  const { place } = await params;
  return <DestinationDetailPage countrySlug="uae" placeSlug={place} />;
}
