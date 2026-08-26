import Link from "next/link";
import type { ServiceNotice } from "@/types/cms";

export function AnnouncementBar({ notice }: { notice?: ServiceNotice }) {
  if (!notice?.announcement.enabled) return null;

  return (
    <div className="announcement" role="status">
      <div className="container">
        <strong>{notice.announcement.text || notice.summary}</strong>
        {notice.announcement.href ? <Link href={notice.announcement.href}>{notice.announcement.label || "View details"}</Link> : null}
      </div>
    </div>
  );
}
