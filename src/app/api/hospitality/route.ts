import { NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";
import fallback from "@/data/hospitality.json";
export async function GET() {
  const entries = await getPublishedCollection("hospitality");
  return NextResponse.json(entries.length ? entries.map((entry) => {
    const data = publicData(entry);
    const gallery = Array.isArray(data.gallery) ? data.gallery : [];
    const firstImage = gallery[0] && typeof gallery[0] === "object" && !Array.isArray(gallery[0]) ? gallery[0] as Record<string, unknown> : null;
    const category = typeof data.categoryName === "string" ? data.categoryName : "Hospitality";
    return {
      id: entry.id,
      tag: typeof data.country === "string" ? data.country.toUpperCase() : category.toUpperCase(),
      title: entry.title,
      subtitle: typeof data.region === "string" ? data.region : category,
      desc: typeof data.shortDescription === "string" ? data.shortDescription : typeof data.fullDescription === "string" ? data.fullDescription : "",
      icon: category.toLowerCase().includes("cruise") ? "Ship" : category.toLowerCase().includes("resort") ? "Palmtree" : "Building2",
      img: typeof firstImage?.url === "string" ? firstImage.url : "/images/hospitality-hero.jpg",
      link: `/hospitality/${entry.slug}`,
      features: Array.isArray(data.facilities) ? data.facilities.filter((item): item is string => typeof item === "string") : [],
    };
  }) : fallback);
}
