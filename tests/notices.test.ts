import { describe, expect, it } from "vitest";
import { activeNoticesForLocation, isNoticeActive, sortNotices } from "@/lib/notices";
import type { ServiceNotice } from "@/types/cms";

function notice(overrides: Partial<ServiceNotice>): ServiceNotice {
  return {
    id: "1",
    slug: "test",
    enabled: true,
    status: "Active",
    priority: "Standard",
    type: "General Notice",
    title: "Test",
    summary: "Summary",
    details: "Details",
    publicUpdate: "",
    lastVerifiedAt: "2026-07-01T00:00:00.000Z",
    displayStartAt: "2026-07-01T00:00:00.000Z",
    showUntilResolved: false,
    appliesSiteWide: false,
    affectedCommunities: [],
    affectedServices: [],
    locations: ["home"],
    updatedAt: "2026-07-01T00:00:00.000Z",
    version: "1",
    announcement: { enabled: false, dismissible: true, sticky: false },
    popup: { enabled: false, dismissible: true, showOnce: true, repeatBehavior: "Once per notice version", delayMs: 0, requiresAcknowledgment: false, acknowledgmentLabel: "I understand" },
    ...overrides
  };
}

describe("notices", () => {
  it("honors active dates", () => {
    expect(isNoticeActive(notice({ displayEndAt: "2026-07-02T00:00:00.000Z" }), new Date("2026-07-03T00:00:00.000Z"))).toBe(false);
  });

  it("sorts by priority then updated date", () => {
    const sorted = sortNotices([
      notice({ id: "standard", priority: "Standard" }),
      notice({ id: "urgent", priority: "Urgent" })
    ]);
    expect(sorted[0].id).toBe("urgent");
  });

  it("targets page locations", () => {
    const active = activeNoticesForLocation([notice({ locations: ["commercial"] })], "home", undefined, new Date("2026-07-01T00:00:00.000Z"));
    expect(active).toHaveLength(0);
  });

  it("targets communities", () => {
    const active = activeNoticesForLocation(
      [notice({ locations: ["community"], affectedCommunities: ["town-of-walworth"] })],
      "community",
      "city-of-delavan",
      new Date("2026-07-01T00:00:00.000Z")
    );
    expect(active).toHaveLength(0);
  });
});
