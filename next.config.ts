import type { NextConfig } from "next";

// Content-Security-Policy notes (documented per project policy):
// - `script-src`/`style-src` include 'unsafe-inline' because Next.js's own
//   hydration bootstrap and this app's extensive Framer Motion inline
//   `style={{ ... }}` usage require it. A nonce-based CSP would remove this,
//   but that requires per-request middleware not yet in place — tightening
//   this is a good follow-up, not attempted here to avoid breaking the site.
// - `connect-src`/`script-src` allow Google Analytics/Tag Manager domains
//   since GA4 (`@next/third-parties/google`) loads gtag.js and reports to
//   Google's collection endpoints from the browser.
// - `img-src` allows `data:`/`blob:` for the small number of inline/blurred
//   image placeholders Next's image pipeline can produce; all real photos
//   are same-origin under /public.
// - `script-src` only adds 'unsafe-eval' outside production: React's dev
//   mode uses eval() for its debugging/HMR tooling, but never in production,
//   so the real production policy stays without it.
const isDev = process.env.NODE_ENV !== "production";
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          { key: "Content-Security-Policy", value: cspDirectives.join("; ") },
        ],
      },
    ];
  },
};

export default nextConfig;
