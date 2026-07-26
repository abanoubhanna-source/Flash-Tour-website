import { NextResponse } from "next/server";
import fallback from "@/data/about.json";

/** About remains on the legacy JSON shape until its published sections are mapped one-for-one. */
export async function GET() { return NextResponse.json(fallback); }
