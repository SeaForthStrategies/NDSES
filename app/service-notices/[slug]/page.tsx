import { notFound } from "next/navigation";
import { getServiceNoticeBySlug, getServiceNotices } from "@/lib/cms";
import { PageHero } from "@/components/layout/PageHero";

export async function generateStaticParams() {
  return (await getServiceNotices()).map((notice) => ({ slug: notice.slug }));
}

export default async function ServiceNoticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const notice = await getServiceNoticeBySlug(slug);
  if (!notice) notFound();

  return (
    <>
      <PageHero eyebrow={`${notice.priority} notice`} heading={notice.title} description={notice.summary} />
      <section className="section">
      <div className="container">
        <div className="card notice-detail">
          <p>{notice.details}</p>
          <p><strong>Affected communities:</strong> {notice.affectedCommunities.join(", ") || "All communities"}</p>
          <p><strong>Affected services:</strong> {notice.affectedServices.join(", ") || "All services"}</p>
          <p><strong>Last verified:</strong> {new Date(notice.lastVerifiedAt).toLocaleString()}</p>
        </div>
      </div>
      </section>
    </>
  );
}
