import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";
import { getCmsPages } from "@/lib/cms/pages/queries";
import { PagesList } from "@/components/cms/pages/pages-list";

export const metadata: Metadata = { title: "Pages" };

export default async function PagesModulePage() {
  const user = await requireCmsUser();
  const pages = await getCmsPages();

  return (
    <PagesList
      pages={pages}
      canCreate={user.permissions.includes("content.create")}
      canEdit={user.permissions.includes("content.edit")}
      canDelete={user.permissions.includes("content.purge")}
    />
  );
}
