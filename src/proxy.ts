import type { NextRequest } from "next/server";
import { refreshSupabaseSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return refreshSupabaseSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login/:path*",
    "/forgot-password",
    "/reset-password",
    "/auth/:path*",
  ],
};
