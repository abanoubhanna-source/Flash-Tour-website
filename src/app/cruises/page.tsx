import type { Metadata } from "next";
import CruisesPageClient from "./CruisesPageClient";

export const metadata: Metadata = {
  title: "Nile Cruises | Flash Group",
  description: "Flash Group's fleet of owned Nile cruise ships and dahabiyas — luxurious suites, panoramic views, and a full-service standard of comfort along the historic Nile.",
  alternates: { canonical: "/cruises" },
};

export default function CruisesPage() {
  return <CruisesPageClient />;
}
