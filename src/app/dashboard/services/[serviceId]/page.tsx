import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireCmsUser } from "@/lib/auth/session";
import { getCmsService } from "@/lib/cms/services/queries";
import { ServiceEditor } from "@/components/cms/services/service-editor";

export const metadata: Metadata = { title: "Edit service" };

export default async function EditService({ params }: { params: Promise<{ serviceId: string }> }) {
  const [{ serviceId }, user] = await Promise.all([params, requireCmsUser()]);
  const service = await getCmsService(serviceId);
  if (!service) notFound();
  return <ServiceEditor service={service} canEdit={user.permissions.includes("content.edit") && user.permissions.includes("seo.edit")} canPublish={user.permissions.includes("content.publish") && user.permissions.includes("seo.publish")} canUpload={user.permissions.includes("media.create")} />;
}
