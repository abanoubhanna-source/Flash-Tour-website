import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";
import { getCollectionSummaries } from "@/lib/cms/collections/queries";
import { CollectionList } from "@/components/cms/collections/collection-list";

export const metadata: Metadata = { title: "Brands" };

export default async function BrandsModulePage() {
  const [user, allItems] = await Promise.all([requireCmsUser(), getCollectionSummaries("brand")]);
  return <CollectionList mode="brands" items={allItems} parents={[]} categories={[]} canCreate={user.permissions.includes("content.create")} canArchive={user.permissions.includes("content.archive")} />;
}
