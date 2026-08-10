import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://flash-tour-group.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api", "/login", "/reset-password", "/forgot-password"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
