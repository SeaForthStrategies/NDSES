import type { ServiceNotice } from "@/types/cms";
import { ServiceNoticeCard } from "./ServiceNoticeCard";

export function ServiceNoticeList({ notices, emptyMessage = "No active notices." }: { notices: ServiceNotice[]; emptyMessage?: string }) {
  if (notices.length === 0) return <p>{emptyMessage}</p>;
  return (
    <div className="notice-list">
      {notices.map((notice) => <ServiceNoticeCard notice={notice} key={notice.id} />)}
    </div>
  );
}
