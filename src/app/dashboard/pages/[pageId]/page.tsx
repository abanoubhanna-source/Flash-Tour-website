import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireCmsUser } from "@/lib/auth/session";
import { getCmsPage } from "@/lib/cms/pages/queries";
import { PageEditor } from "@/components/cms/pages/page-editor";

export const metadata: Metadata = { title: "Edit page" };

export default async function EditPage({ params }: PageProps<"/dashboard/pages/[pageId]">) {
  const [{ pageId }, user] = await Promise.all([params, requireCmsUser()]);
  const page = await getCmsPage(pageId);
  if (!page) notFound();

  return (
    <PageEditor
      page={page}
      canEdit={user.permissions.includes("content.edit") && user.permissions.includes("seo.edit")}
      canPublish={user.permissions.includes("content.publish") && user.permissions.includes("seo.publish")}
      canUpload={user.permissions.includes("media.create")}
    />
  );
}
