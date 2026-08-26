import { CalendarDays } from "lucide-react";
import type { ScheduleItem } from "@/types/cms";

export function ScheduleCalendar({ items }: { items: ScheduleItem[] }) {
  return (
    <div className="schedule-list">
      {items.map((item) => (
        <article className="card schedule-card" key={`${item.title}-${item.community ?? "general"}`}>
          <CalendarDays size={22} aria-hidden />
          <div>
            <span className="badge">{item.type}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
