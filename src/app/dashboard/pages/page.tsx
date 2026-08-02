import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";
import { getCmsPages } from "@/lib/cms/pages/queries";
import { PagesList } from "@/components/cms/pages/pages-list";

export const metadata: Metadata = { title: "Pages" };

const EMBEDDED_ELSEWHERE_KEYS = new Set(["destinations", "hospitality", "services"]);

export default async function PagesModulePage() {
  const user = await requireCmsUser();
  const allPages = await getCmsPages();
  // Destinations/Hospitality/Services now edit their page header inline on their own
  // collection screens (Dashboard → Destinations/Hospitality/Services), so they're
  // hidden here to avoid two separate places to edit what feels like one page.
  const pages = allPages.filter((page) => !EMBEDDED_ELSEWHERE_KEYS.has(page.key));

  return (
    <PagesList
      pages={pages}
      canCreate={user.permissions.includes("content.create")}
      canEdit={user.permissions.includes("content.edit")}
      canDelete={user.permissions.includes("content.purge")}
    />
  );
}
