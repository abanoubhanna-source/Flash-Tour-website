"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCmsPermission } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.generated";

const settingsSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(80),
  email: z.string().trim().email().or(z.literal("")),
  address: z.string().trim().max(500),
  instagram: z.string().trim().max(500),
  facebook: z.string().trim().max(500),
  defaultSeoTitle: z.string().trim().max(70),
  defaultSeoDescription: z.string().trim().max(170),
});

export async function saveWebsiteSettings(input: unknown) {
  await requireCmsPermission("settings.edit");
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Check the website settings fields." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("site_settings").upsert({
    key: "website.general", group_key: "website", draft_value: parsed.data as Json, is_public: true,
  }, { onConflict: "key" });
  if (error) return { ok: false as const, message: error.message };
  revalidatePath("/dashboard/settings");
  return { ok: true as const, message: "Website settings saved as draft." };
}

export async function publishWebsiteSettings() {
  await requireCmsPermission("settings.publish");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("site_settings").select("draft_value").eq("key", "website.general").maybeSingle();
  if (error || !data) return { ok: false as const, message: "Save website settings before publishing." };
  const { error: updateError } = await supabase.from("site_settings").update({ published_value: data.draft_value, published_at: new Date().toISOString() }).eq("key", "website.general");
  if (updateError) return { ok: false as const, message: updateError.message };
  revalidatePath("/dashboard/settings"); revalidatePath("/");
  return { ok: true as const, message: "Website settings published." };
}
