import type { NoticeLocation, NoticePriority, ServiceNotice } from "@/types/cms";

const priorityRank: Record<NoticePriority, number> = {
  Emergency: 5,
  Urgent: 4,
  Important: 3,
  Standard: 2,
  Informational: 1
};

export function isNoticeActive(notice: ServiceNotice, now = new Date()) {
  if (!notice.enabled) return false;
  if (!["Active", "Scheduled"].includes(notice.status)) return false;
  const start = new Date(notice.displayStartAt);
  const end = notice.displayEndAt ? new Date(notice.displayEndAt) : null;
  if (start > now) return false;
  if (!notice.showUntilResolved && end && end < now) return false;
  return notice.status !== "Resolved" && notice.status !== "Expired";
}

export function sortNotices(notices: ServiceNotice[]) {
  return [...notices].sort((a, b) => {
    const priority = priorityRank[b.priority] - priorityRank[a.priority];
    if (priority !== 0) return priority;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function activeNoticesForLocation(notices: ServiceNotice[], location: NoticeLocation, communitySlug?: string, now = new Date()) {
  return sortNotices(notices.filter((notice) => {
    if (!isNoticeActive(notice, now)) return false;
    const locationMatch = notice.locations.includes(location) || (location === "siteWide" && notice.appliesSiteWide);
    const communityMatch = !communitySlug || notice.appliesSiteWide || notice.affectedCommunities.includes(communitySlug);
    return locationMatch && communityMatch;
  }));
}

export function highestPriorityNotice(notices: ServiceNotice[]) {
  return sortNotices(notices)[0];
}

type PopupDismissal = {
  noticeId: string;
  version: string;
  dismissedAt: string;
  repeatBehavior: ServiceNotice["popup"]["repeatBehavior"];
};

const storageKey = (notice: ServiceNotice) => `ndses:notice:${notice.id}`;

export function shouldShowPopup(notice: ServiceNotice, now = new Date()) {
  if (!notice.popup.enabled || !isNoticeActive(notice, now)) return false;
  if (notice.popup.requiresAcknowledgment) return true;
  if (notice.popup.repeatBehavior === "Every visit") return true;
  const raw = window.localStorage.getItem(storageKey(notice)) || window.sessionStorage.getItem(storageKey(notice));
  if (!raw) return true;
  const dismissal = JSON.parse(raw) as PopupDismissal;
  if (dismissal.version !== notice.version) return true;
  if (notice.popup.repeatBehavior === "Once per browser session") return false;
  if (notice.popup.repeatBehavior === "Once per notice version" || notice.popup.repeatBehavior === "Until the notice changes") return false;
  if (notice.popup.repeatBehavior === "Once per day") {
    return new Date(dismissal.dismissedAt).toDateString() !== now.toDateString();
  }
  return true;
}

export function storePopupDismissal(notice: ServiceNotice) {
  const dismissal: PopupDismissal = {
    noticeId: notice.id,
    version: notice.version,
    dismissedAt: new Date().toISOString(),
    repeatBehavior: notice.popup.repeatBehavior
  };
  const storage = notice.popup.repeatBehavior === "Once per browser session" ? window.sessionStorage : window.localStorage;
  storage.setItem(storageKey(notice), JSON.stringify(dismissal));
}
