import type { Metadata } from "next";
import { requireCmsPermission, requireCmsUser } from "@/lib/auth/session";
import { getHospitalityList, parseHospitalityListParams } from "@/lib/cms/collections/queries";
import { getCmsPage, getPageIdByKey } from "@/lib/cms/pages/queries";
import { HospitalityListing } from "@/components/cms/collections/hospitality-listing";
import { EmbeddedPageHeader } from "@/components/cms/pages/embedded-page-header";

export const metadata: Metadata = { title: "Hospitality" };

export default async function HospitalityModulePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireCmsUser();
  let canCreate = true;
  try {
    await requireCmsPermission("content.create");
  } catch {
    canCreate = false;
  }
  const [data, pageId] = await Promise.all([getHospitalityList(parseHospitalityListParams(await searchParams)), getPageIdByKey("hospitality")]);
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
      <HospitalityListing data={data} canCreate={canCreate} />
    </div>
  );
}
