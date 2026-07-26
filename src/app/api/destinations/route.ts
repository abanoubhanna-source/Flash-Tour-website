import { NextResponse } from "next/server";
import { getPublishedCollection, publicData } from "@/lib/cms/public-content";
import fallback from "@/data/destinations.json";
export async function GET() { const entries = await getPublishedCollection("destination"); return NextResponse.json(entries.length ? entries.map((entry) => ({ ...publicData(entry), id: entry.id, slug: entry.slug, name: entry.title, title: entry.title })) : fallback); }
