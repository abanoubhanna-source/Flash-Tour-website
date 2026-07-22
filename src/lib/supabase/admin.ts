import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getServerSupabaseEnvironment } from "./env";
import type { Database } from "@/types/database.generated";

export function createSupabaseAdminClient() {
  const environment = getServerSupabaseEnvironment();

  return createClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
