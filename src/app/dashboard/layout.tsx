import type { Metadata } from "next";
import { DashboardShell } from "@/components/cms/dashboard-shell";
import { requireCmsUser } from "@/lib/auth/session";
import { getNavigationForUser } from "@/lib/auth/navigation";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Flash Tour CMS" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCmsUser();
  const navigation = getNavigationForUser(user);

  return (
    <DashboardShell user={user} navigation={navigation}>
      {children}
    </DashboardShell>
  );
}
