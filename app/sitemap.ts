import type { MetadataRoute } from "next";
import { getCommunities, getServiceNotices } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ndses.com";
  const staticRoutes = ["", "/residential", "/commercial", "/dumpster-rentals", "/dumpster-calculator", "/faqs", "/about", "/contact", "/make-a-payment", "/whats-new", "/service-notices", "/special-events", "/privacy-policy", "/terms"];
  const [communities, notices] = await Promise.all([getCommunities(), getServiceNotices()]);

  return [
    ...staticRoutes.map((route) => ({ url: `${siteUrl}${route}`, lastModified: new Date() })),
    ...communities.map((community) => ({ url: `${siteUrl}/residential/${community.slug}`, lastModified: new Date() })),
    ...notices.map((notice) => ({ url: `${siteUrl}/service-notices/${notice.slug}`, lastModified: new Date(notice.updatedAt) }))
  ];
}
