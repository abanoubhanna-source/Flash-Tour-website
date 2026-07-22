import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/cms/module-placeholder";

export const metadata: Metadata = { title: "Users" };

export default function UsersModulePage() {
  return <ModulePlaceholder title="Users & Roles" description="User invitations and role assignment controls are not included in this shell-only phase." permission="users.view" />;
}
