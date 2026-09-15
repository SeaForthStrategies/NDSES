import type { Metadata } from "next";
import "./globals.css";
import { AnnouncementBar } from "@/components/notices/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ServiceNoticePopup } from "@/components/notices/ServiceNoticePopup";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getGlobalSettings, getServiceNotices } from "@/lib/cms";
import { activeNoticesForLocation, highestPriorityNotice } from "@/lib/notices";

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
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AnnouncementBar notice={highestPriorityNotice(siteWide)} />
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        {popupNotice ? <ServiceNoticePopup notice={popupNotice} /> : null}
        <ScrollReveal />
      </body>
    </html>
  );
}
