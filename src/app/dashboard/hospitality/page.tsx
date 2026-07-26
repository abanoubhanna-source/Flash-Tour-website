import type { Metadata } from "next";
import { requireCmsPermission, requireCmsUser } from "@/lib/auth/session";
import { getHospitalityList, parseHospitalityListParams } from "@/lib/cms/collections/queries";
import { HospitalityListing } from "@/components/cms/collections/hospitality-listing";

export const metadata: Metadata = { title: "Hospitality" };

export default async function HospitalityModulePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireCmsUser();
  let canCreate = true;
  try {
    await requireCmsPermission("content.create");
  } catch {
    canCreate = false;
  }
  const data = await getHospitalityList(parseHospitalityListParams(await searchParams));
  return <HospitalityListing data={data} canCreate={canCreate} />;
}
