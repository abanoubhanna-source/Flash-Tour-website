import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";
import { getCmsServices } from "@/lib/cms/services/queries";
import { ServicesList } from "@/components/cms/services/services-list";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesModulePage() {
  const [user, services] = await Promise.all([requireCmsUser(), getCmsServices()]);
  return <ServicesList services={services} canCreate={user.permissions.includes("content.create")} canEdit={user.permissions.includes("content.edit")} canDelete={user.permissions.includes("content.purge")} />;
}
