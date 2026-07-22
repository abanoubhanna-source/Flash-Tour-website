import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flash Group | Crafting Hospitality Since 1985",
  description:
    "An Egyptian International company offering full-fledged services in tourism and hospitality.",
};

// GA4 measurement ID is public by design; only ever loaded in production
// builds, and only when the env var is actually configured.
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const shouldLoadAnalytics = process.env.NODE_ENV === "production" && !!gaMeasurementId;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-900 min-h-screen pt-20`}>
        <Navbar />
        {children}
      </body>
      {shouldLoadAnalytics && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  );
}