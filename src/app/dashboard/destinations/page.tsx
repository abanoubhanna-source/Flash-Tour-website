import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";
import { getCollectionSummaries } from "@/lib/cms/collections/queries";
import { getCmsPage, getPageIdByKey } from "@/lib/cms/pages/queries";
import { CollectionList } from "@/components/cms/collections/collection-list";
import { EmbeddedPageHeader } from "@/components/cms/pages/embedded-page-header";

export const metadata: Metadata = { title: "Destinations" };

export default async function DestinationsModulePage() {
  const [user, items, pageId] = await Promise.all([requireCmsUser(), getCollectionSummaries(), getPageIdByKey("destinations")]);
  const parents = items.filter((item) => item.type === "destination" || item.type === "destination_place").map((item) => ({ id: item.id, title: item.title, type: item.type, country: item.type === "destination_place" ? item.parentTitle : null }));
  const headerPage = pageId ? await getCmsPage(pageId) : null;
  return (
    <div className="space-y-5">
      {headerPage && (
        <EmbeddedPageHeader
          page={headerPage}
          canEdit={user.permissions.includes("content.edit") && user.permissions.includes("seo.edit")}
          canPublish={user.permissions.includes("content.publish") && user.permissions.includes("seo.publish")}
          canUpload={user.permissions.includes("media.create")}
        />
      )}
      <CollectionList mode="destinations" items={items} parents={parents} categories={[]} canCreate={user.permissions.includes("content.create")} canArchive={user.permissions.includes("content.archive")} />
    </div>
  );
}
