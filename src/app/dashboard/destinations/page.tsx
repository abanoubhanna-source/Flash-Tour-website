import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";import{getCmsDestinations}from"@/lib/cms/destinations/queries";import{DestinationsList}from"@/components/cms/destinations/destinations-list";

export const metadata: Metadata = { title: "Destinations" };

export default async function DestinationsModulePage() {
  const[user,destinations]=await Promise.all([requireCmsUser(),getCmsDestinations()]);return <DestinationsList destinations={destinations} canCreate={user.permissions.includes("content.create")} canEdit={user.permissions.includes("content.edit")} canArchive={user.permissions.includes("content.archive")} canDelete={user.permissions.includes("content.purge")}/>;
}
