import type { Metadata } from "next";
import { ServiceNoticeList } from "@/components/notices/ServiceNoticeList";
import { getServiceNotices } from "@/lib/cms";
import { sortNotices } from "@/lib/notices";

export const metadata: Metadata = {
  title: "What's New",
  description: "Service alerts, holiday schedule updates, weather notices, closures, and announcements from NDS Environmental Solutions."
};

export default async function WhatsNewPage() {
  const notices = sortNotices(await getServiceNotices());
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <p className="eyebrow">What&apos;s New</p>
          <h1>Alerts and service updates</h1>
          <p className="lead">Weather delays, holiday schedule changes, closures, announcements, and route updates will appear here.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          <div>
            <p className="eyebrow">Current Updates</p>
            <h2>Latest NDS notices</h2>
            <p>This local alert data is structured now so WordPress and Facebook update workflows can be connected later.</p>
            {/* TODO: Facebook - Connect alert publishing or lightweight social links without adding a heavy feed. */}
            <p className="fine-print">Future alert publishing can connect to social channels without adding a heavy embedded feed.</p>
          </div>
          <ServiceNoticeList notices={notices} emptyMessage="No current alerts or updates." />
        </div>
      </section>
    </>
  );
}
