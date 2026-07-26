import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireCmsUser } from "@/lib/auth/session";
import { getCollectionEditor } from "@/lib/cms/collections/queries";
import { CollectionEditor } from "@/components/cms/collections/collection-editor";
export const metadata: Metadata = { title: "Edit destination content" };
export default async function Page({ params }: { params: Promise<{ destinationId: string }> }) { const [{ destinationId }, user] = await Promise.all([params, requireCmsUser()]); const entry = await getCollectionEditor(destinationId); if (!entry || entry.type === "hospitality") notFound(); return <CollectionEditor entry={entry} mode="destinations" canEdit={user.permissions.includes("content.edit") && user.permissions.includes("seo.edit")} canPublish={user.permissions.includes("content.publish") && user.permissions.includes("seo.publish")} canArchive={user.permissions.includes("content.archive")} />; }
