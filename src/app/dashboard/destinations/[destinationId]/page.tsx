import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireCmsUser } from "@/lib/auth/session";
import { getCollectionEditor } from "@/lib/cms/collections/queries";
import { getCmsDestination } from "@/lib/cms/destinations/queries";
import { CollectionEditor } from "@/components/cms/collections/collection-editor";
import { DestinationEditor } from "@/components/cms/destinations/destination-editor";

export const metadata: Metadata = { title: "Edit destination content" };

// A "destination" (top-level country) entry uses destinationContentSchema —
// a nested hero{eyebrow,title,accentTitle,subtitle,image} shape the public
// site's hero sections and listing cards read directly. It needs its own
// editor. "destination_place"/"destination_attraction" entries are plain
// title/description/gallery items with no hero, so they use the generic
// collection editor like hospitality/cruises/brands. Routing every id here
// through the generic editor used to silently strip the hero object out of
// draft_data on first save.
export default async function Page({ params }: { params: Promise<{ destinationId: string }> }) {
  const [{ destinationId }, user] = await Promise.all([params, requireCmsUser()]);
  const canEdit = user.permissions.includes("content.edit") && user.permissions.includes("seo.edit");
  const canPublish = user.permissions.includes("content.publish") && user.permissions.includes("seo.publish");

  const destination = await getCmsDestination(destinationId);
  if (destination) {
    return (
      <DestinationEditor
        destination={destination}
        canEdit={canEdit}
        canPublish={canPublish}
        canUpload={user.permissions.includes("media.create")}
      />
    );
  }

  const entry = await getCollectionEditor(destinationId);
  if (!entry || entry.type === "hospitality" || entry.type === "destination") notFound();
  return (
    <CollectionEditor
      entry={entry}
      mode="destinations"
      canEdit={canEdit}
      canPublish={canPublish}
      canArchive={user.permissions.includes("content.archive")}
      canUpload={user.permissions.includes("media.create")}
    />
  );
}
