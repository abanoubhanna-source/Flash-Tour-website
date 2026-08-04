import type { Metadata } from "next";
import { DestinationDetailPage } from "@/components/destinations/DestinationDetailPage";

export const metadata: Metadata = { title: "Destinations | Flash Group" };

export default async function Page({ params }: { params: Promise<{ place: string; attraction: string }> }) {
  const { place, attraction } = await params;
  return <DestinationDetailPage countrySlug="italy" placeSlug={place} attractionSlug={attraction} />;
}
