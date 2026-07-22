import type { CmsUser } from "./types";

export type CmsNavigationIcon =
  | "building"
  | "dashboard"
  | "file"
  | "globe"
  | "images"
  | "search"
  | "settings"
  | "ship"
  | "sparkles"
  | "users";

export type CmsNavigationItem = {
  label: string;
  href: string;
  icon: CmsNavigationIcon;
  permission: string;
};

export type CmsNavigationGroup = {
  label: string;
  items: CmsNavigationItem[];
};

const navigationGroups: CmsNavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard", permission: "cms.view" },
    ],
  },
  {
    label: "Website content",
    items: [
      { label: "Pages", href: "/dashboard/pages", icon: "file", permission: "cms.view" },
      { label: "Services", href: "/dashboard/services", icon: "sparkles", permission: "cms.view" },
      {
        label: "Destinations",
        href: "/dashboard/destinations",
        icon: "globe",
        permission: "cms.view",
      },
      {
        label: "Hospitality",
        href: "/dashboard/hospitality",
        icon: "building",
        permission: "cms.view",
      },
      { label: "Cruises", href: "/dashboard/cruises", icon: "ship", permission: "cms.view" },
      { label: "Brands", href: "/dashboard/brands", icon: "building", permission: "cms.view" },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Media Library", href: "/dashboard/media", icon: "images", permission: "media.view" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { label: "SEO", href: "/dashboard/seo", icon: "search", permission: "seo.view" },
      {
        label: "Website Settings",
        href: "/dashboard/settings",
        icon: "settings",
        permission: "settings.view",
      },
      { label: "Users", href: "/dashboard/users", icon: "users", permission: "users.view" },
    ],
  },
];

export function getNavigationForUser(user: CmsUser): CmsNavigationGroup[] {
  return navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => user.permissions.includes(item.permission)),
    }))
    .filter((group) => group.items.length > 0);
}
