import { NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";
import fallback from "@/data/brands.json";
export async function GET() {
  const entries = await getPublishedCollection("brand");
  return NextResponse.json(
    entries.length
      ? entries.map((entry) => {
          const data = publicData(entry);
          const gallery = Array.isArray(data.gallery) ? data.gallery : [];
          const firstImage = gallery[0] && typeof gallery[0] === "object" ? (gallery[0] as { url?: unknown }).url : undefined;
          return {
            ...data,
            id: entry.id,
            name: entry.title,
            subtitle: typeof data.shortDescription === "string" ? data.shortDescription : "",
            description: typeof data.fullDescription === "string" ? data.fullDescription : "",
            features: Array.isArray(data.facilities) ? data.facilities : [],
            image: typeof firstImage === "string" && firstImage ? firstImage : "/images/egypt-bg.jpg",
          };
        })
      : fallback,
  );
}
