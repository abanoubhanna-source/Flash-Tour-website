import type { Metadata } from "next";
import { requireCmsUser } from "@/lib/auth/session";
import { getCmsServices } from "@/lib/cms/services/queries";
import { getCmsPage, getPageIdByKey } from "@/lib/cms/pages/queries";
import { ServicesList } from "@/components/cms/services/services-list";
import { EmbeddedPageHeader } from "@/components/cms/pages/embedded-page-header";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesModulePage() {
  const [user, services, pageId] = await Promise.all([requireCmsUser(), getCmsServices(), getPageIdByKey("services")]);
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
      <ServicesList services={services} canCreate={user.permissions.includes("content.create")} canEdit={user.permissions.includes("content.edit")} canDelete={user.permissions.includes("content.purge")} />
    </div>
  );
}
