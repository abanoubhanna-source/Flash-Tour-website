import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnvironment } from "@/lib/supabase/env";
import type { Database } from "@/types/database.generated";

export async function GET() {
  try {
    const env = getPublicSupabaseEnvironment();
    const supabase = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data } = await supabase.from("published_site_settings").select("value").eq("key", "website.general").maybeSingle();
    return NextResponse.json(data?.value ?? {});
  } catch { return NextResponse.json({}); }
}
