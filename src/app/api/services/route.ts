import { NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";
import fallback from "@/data/services.json";
export async function GET() { const entries = await getPublishedCollection("service"); return NextResponse.json(entries.length ? entries.map((entry) => { const data = publicData(entry); return { ...data, id: entry.id, title: entry.title, desc: typeof data.shortDescription === "string" ? data.shortDescription : typeof data.fullDescription === "string" ? data.fullDescription : "", img: typeof data.image === "string" ? data.image : undefined }; }) : fallback); }
