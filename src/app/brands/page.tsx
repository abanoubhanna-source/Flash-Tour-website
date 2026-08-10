import type { Metadata } from "next";
import BrandsPageClient from "./BrandsPageClient";

export const metadata: Metadata = {
  title: "Our Brands | Flash Group",
  description: "Discover Flash Group's owned and operated hospitality brands — meticulously crafted resorts, cruises, and restaurants delivering unparalleled luxury.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return <BrandsPageClient />;
}
