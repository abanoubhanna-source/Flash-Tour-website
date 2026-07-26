import { NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";
import fallback from "@/data/brands.json";
export async function GET() { const entries = await getPublishedCollection("brand"); return NextResponse.json(entries.length ? entries.map((entry) => { const data = publicData(entry); return { ...data, id: entry.id, name: entry.title, subtitle: typeof data.shortDescription === "string" ? data.shortDescription : "", description: typeof data.fullDescription === "string" ? data.fullDescription : "", image: typeof data.coverImage === "string" ? data.coverImage : typeof data.image === "string" ? data.image : "/images/egypt-bg.jpg" }; }) : fallback); }
