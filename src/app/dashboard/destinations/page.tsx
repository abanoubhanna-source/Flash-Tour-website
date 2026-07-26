import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";
import { getCollectionSummaries } from "@/lib/cms/collections/queries";
import { CollectionList } from "@/components/cms/collections/collection-list";

export const metadata: Metadata = { title: "Destinations" };

export default async function DestinationsModulePage() {
  const [user, items] = await Promise.all([requireCmsUser(), getCollectionSummaries()]);
  const parents = items.filter((item) => item.type === "destination" || item.type === "destination_place").map((item) => ({ id: item.id, title: item.title, type: item.type }));
  return <CollectionList mode="destinations" items={items} parents={parents} categories={[]} canCreate={user.permissions.includes("content.create")} canArchive={user.permissions.includes("content.archive")} />;
}
