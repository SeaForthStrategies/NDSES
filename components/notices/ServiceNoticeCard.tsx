import Link from "next/link";
import type { ServiceNotice } from "@/types/cms";

export function ServiceNoticeCard({ notice }: { notice: ServiceNotice }) {
  return (
    <article className="card notice-card">
      <span className="badge">{notice.priority}</span>
      <h3 className="stack-top-sm">{notice.title}</h3>
      <p>{notice.summary}</p>
      <Link href={`/service-notices/${notice.slug}`}><strong>Read notice</strong></Link>
    </article>
  );
}
