import type { Metadata } from "next";
import { Archivo, Public_Sans } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/notices/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ServiceNoticePopup } from "@/components/notices/ServiceNoticePopup";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getGlobalSettings, getServiceNotices } from "@/lib/cms";
import { activeNoticesForLocation, highestPriorityNotice } from "@/lib/notices";

// Archivo (headings) has the sturdy, sign-painted feel of truck lettering;
// Public Sans (body) is a plain civic face built for public-service sites.
// next/font self-hosts both at build time, so no runtime font requests.
const display = Archivo({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-archivo", display: "swap" });
const body = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-public-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ndses.com"),
  title: {
    default: "NDS Environmental Solutions",
    template: "%s | NDS Environmental Solutions"
  },
  description: "Local waste collection, dumpster rental, and environmental services in Southern Wisconsin.",
  openGraph: {
    type: "website",
    siteName: "NDS Environmental Solutions",
    title: "NDS Environmental Solutions",
    description: "Residential trash, recycling, commercial waste, and dumpster rentals in Southern Wisconsin."
  },
  twitter: {
    card: "summary_large_image",
    title: "NDS Environmental Solutions",
    description: "Local waste collection, recycling, and dumpster rental service in Southern Wisconsin."
  },
  alternates: {
    canonical: "/"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, notices] = await Promise.all([getGlobalSettings(), getServiceNotices()]);
  const siteWide = activeNoticesForLocation(notices, "siteWide");
  const popupNotice = highestPriorityNotice(activeNoticesForLocation(notices, "popup"));

  return (
    <html className={`${display.variable} ${body.variable}`} lang="en" data-scroll-behavior="smooth">
      <body>
        <AnnouncementBar notice={highestPriorityNotice(siteWide)} />
        <a className="skip-link" href="#main">Skip to content</a>
        <Header settings={settings} />
        <main id="main">{children}</main>
        <Footer settings={settings} />
        {popupNotice ? <ServiceNoticePopup notice={popupNotice} /> : null}
        <ScrollReveal />
      </body>
    </html>
  );
}
