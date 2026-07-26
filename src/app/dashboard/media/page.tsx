import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MediaLibrary } from "@/components/cms/media-library";

export const metadata: Metadata = { title: "Media Library" };
export default async function MediaModulePage() {
  const [user, supabase] = await Promise.all([requireCmsUser(), createSupabaseServerClient()]);
  const { data, error } = await supabase.from("media_assets").select("id,bucket,storage_path,original_name,mime_type,byte_size,alt_text,caption,status,created_at").neq("status", "archived").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return <MediaLibrary initialAssets={data ?? []} userId={user.id} canUpload={user.permissions.includes("media.create")} canEdit={user.permissions.includes("media.edit")} />;
}
