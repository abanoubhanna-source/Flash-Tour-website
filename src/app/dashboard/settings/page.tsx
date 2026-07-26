import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SettingsEditor, type WebsiteSettings } from "@/components/cms/settings-editor";

export const metadata: Metadata = { title: "Website Settings" };
const defaults: WebsiteSettings = { companyName: "Flash Tour", phone: "", email: "", address: "", instagram: "", facebook: "", defaultSeoTitle: "", defaultSeoDescription: "" };

export default async function SettingsModulePage() {
  const [user, supabase] = await Promise.all([requireCmsUser(), createSupabaseServerClient()]);
  const { data } = await supabase.from("site_settings").select("draft_value").eq("key", "website.general").maybeSingle();
  const initial = { ...defaults, ...(data?.draft_value && typeof data.draft_value === "object" ? data.draft_value : {}) } as WebsiteSettings;
  return <SettingsEditor initial={initial} canEdit={user.permissions.includes("settings.edit")} canPublish={user.permissions.includes("settings.publish")} />;
}
