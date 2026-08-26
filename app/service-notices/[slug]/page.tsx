import { notFound } from "next/navigation";
import { getServiceNoticeBySlug, getServiceNotices } from "@/lib/cms";

export async function generateStaticParams() {
  return (await getServiceNotices()).map((notice) => ({ slug: notice.slug }));
}

export default async function ServiceNoticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const notice = await getServiceNoticeBySlug(slug);
  if (!notice) notFound();

  return (
    <section className="section page-hero">
      <div className="container">
        <span className="badge">{notice.priority}</span>
        <h1 className="stack-top-sm">{notice.title}</h1>
        <p className="lead">{notice.summary}</p>
        <div className="card stack-top">
          <p>{notice.details}</p>
          <p><strong>Affected communities:</strong> {notice.affectedCommunities.join(", ") || "All communities"}</p>
          <p><strong>Affected services:</strong> {notice.affectedServices.join(", ") || "All services"}</p>
          <p><strong>Last verified:</strong> {new Date(notice.lastVerifiedAt).toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
}
