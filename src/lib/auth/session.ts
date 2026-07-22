import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CmsUser } from "./types";

const cmsContextSchema = z.object({
  display_name: z.string(),
  status: z.literal("active"),
  roles: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
      rank: z.number(),
    }),
  ),
  permissions: z.array(z.string()),
});

function getInitials(displayName: string, email: string) {
  const source = displayName.trim() || email.split("@")[0] || "CMS";
  const parts = source.split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export const getOptionalCmsUser = cache(async (): Promise<CmsUser | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) return null;

  const { data: context, error: contextError } = await supabase.rpc("current_cms_context");
  if (contextError || !context) return null;

  const parsedContext = cmsContextSchema.safeParse(context);
  if (!parsedContext.success || parsedContext.data.roles.length === 0) return null;
  if (!parsedContext.data.permissions.includes("cms.view")) return null;

  const primaryRole = parsedContext.data.roles[0];
  const displayName = parsedContext.data.display_name.trim() || user.email.split("@")[0];

  return {
    id: user.id,
    email: user.email,
    displayName,
    initials: getInitials(displayName, user.email),
    roles: parsedContext.data.roles,
    primaryRole,
    permissions: parsedContext.data.permissions,
  };
});

export async function requireCmsUser(): Promise<CmsUser> {
  const user = await getOptionalCmsUser();
  if (!user) redirect("/login?error=access_denied");
  return user;
}

export async function requireCmsPermission(permission: string): Promise<CmsUser> {
  const user = await requireCmsUser();
  if (!user.permissions.includes(permission)) redirect("/dashboard?error=forbidden");
  return user;
}
