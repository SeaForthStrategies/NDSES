import { Metadata } from "next";
import Link from "next/link";
import { getServiceNotices } from "@/lib/cms";
import { sortNotices } from "@/lib/notices";

export const metadata: Metadata = {
  title: "Service Notices",
  description: "Weather, closure, delay, route, and service restoration notices from NDSES."
};

export default async function ServiceNoticesPage() {
  const notices = sortNotices(await getServiceNotices());
  return (
    <section className="section page-hero">
      <div className="container">
        <p className="eyebrow">Operational Updates</p>
        <h1>Service notices</h1>
        {notices.length === 0 ? (
          <div className="card stack-top">
            <h2 className="compact-heading">No active service notices</h2>
            <p>Weather delays, route changes, holiday updates, and closures will appear here when they are posted.</p>
          </div>
        ) : (
          <div className="grid two stack-top">
            {notices.map((notice) => (
              <Link className="card notice-card" href={`/service-notices/${notice.slug}`} key={notice.id}>
                <span className="badge">{notice.priority}</span>
                <h2 className="compact-heading stack-top-sm">{notice.title}</h2>
                <p>{notice.summary}</p>
                <p><strong>Status:</strong> {notice.status} | <strong>Updated:</strong> {new Date(notice.updatedAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
