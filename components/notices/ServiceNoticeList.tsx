import { CheckCircle2 } from "lucide-react";
import type { ServiceNotice } from "@/types/cms";
import { ServiceNoticeCard } from "./ServiceNoticeCard";

export function ServiceNoticeList({ notices, emptyMessage = "No active notices." }: { notices: ServiceNotice[]; emptyMessage?: string }) {
  if (notices.length === 0) {
    return (
      <p className="notice-empty">
        <CheckCircle2 size={20} aria-hidden /> {emptyMessage}
      </p>
    );
  }
  return (
    <div className="notice-list">
      {notices.map((notice) => <ServiceNoticeCard notice={notice} key={notice.id} />)}
    </div>
  );
}
