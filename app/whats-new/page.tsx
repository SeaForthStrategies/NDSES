import type { Metadata } from "next";
import { ServiceNoticeList } from "@/components/notices/ServiceNoticeList";
import { getServiceNotices, getWhatsNewPage } from "@/lib/cms";
import { sortNotices } from "@/lib/notices";

export const metadata: Metadata = {
  title: "What's New",
  description: "Service alerts, holiday schedule updates, weather notices, closures, and announcements from NDS Environmental Solutions."
};

export default async function WhatsNewPage() {
  const [page, rawNotices] = await Promise.all([getWhatsNewPage(), getServiceNotices()]);
  const notices = sortNotices(rawNotices);
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <p className="eyebrow">{page.hero.eyebrow}</p>
          <h1>{page.hero.heading}</h1>
          <p className="lead">{page.hero.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Current Updates</p>
            <h2>Latest NDS notices</h2>
            <p>NDS posts alerts directly in WordPress as they come up — no Facebook integration.</p>
          </div>
          <ServiceNoticeList notices={notices} emptyMessage="No current alerts or updates." />
        </div>
      </section>
    </>
  );
}
