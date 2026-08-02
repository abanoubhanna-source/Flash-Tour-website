import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireCmsUser } from "@/lib/auth/session";
import { getAboutPage, getCmsPage, getPageKey } from "@/lib/cms/pages/queries";
import { PageEditor } from "@/components/cms/pages/page-editor";
import { AboutPageEditor } from "@/components/cms/pages/about-page-editor";

export const metadata: Metadata = { title: "Edit page" };

export default async function EditPage({ params }: PageProps<"/dashboard/pages/[pageId]">) {
  const [{ pageId }, user] = await Promise.all([params, requireCmsUser()]);
  const key = await getPageKey(pageId);
  if (!key) notFound();

  const canEdit = user.permissions.includes("content.edit") && user.permissions.includes("seo.edit");
  const canPublish = user.permissions.includes("content.publish") && user.permissions.includes("seo.publish");

  if (key === "about") {
    const page = await getAboutPage(pageId);
    if (!page) notFound();
    return <AboutPageEditor page={page} canEdit={canEdit} canPublish={canPublish} />;
  }

  const page = await getCmsPage(pageId);
  if (!page) notFound();

  return (
    <PageEditor
      page={page}
      canEdit={canEdit}
      canPublish={canPublish}
      canUpload={user.permissions.includes("media.create")}
    />
  );
}
