import { NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";
import fallback from "@/data/cruises.json";
export async function GET() { const entries = await getPublishedCollection("cruise"); return NextResponse.json(entries.length ? entries.map((entry) => ({ ...publicData(entry), id: entry.id, title: entry.title, slug: entry.slug })) : fallback); }
