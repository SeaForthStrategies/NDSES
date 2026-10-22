import type { Metadata } from "next";
import { ServiceNoticeList } from "@/components/notices/ServiceNoticeList";
import { getServiceNotices, getWhatsNewPage } from "@/lib/cms";
import { sortNotices } from "@/lib/notices";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "What's New",
  description: "Service alerts, holiday schedule updates, weather notices, closures, and announcements from NDS Environmental Solutions."
};

export default async function WhatsNewPage() {
  const [page, rawNotices] = await Promise.all([getWhatsNewPage(), getServiceNotices()]);
  const notices = sortNotices(rawNotices);
  return (
    <>
      <PageHero {...page.hero} />
      <section className="section">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Current Updates</p>
            <h2>Latest NDS notices</h2>
            <p>Weather delays, holiday schedule changes, closures, and route updates will be posted here.</p>
          </div>
          <ServiceNoticeList notices={notices} emptyMessage="No current alerts or updates." />
        </div>
      </section>
    </>
  );
}
