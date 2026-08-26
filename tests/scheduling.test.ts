import { describe, expect, it } from "vitest";
import { calculateSchedule } from "@/lib/scheduling";

describe("calculateSchedule", () => {
  it("handles one-day holiday shifts", () => {
    const result = calculateSchedule({
      normalServiceDate: "2026-07-04",
      community: "town-of-walworth",
      serviceType: "trash",
      rules: [{ id: "holiday", holidayDate: "2026-07-04", shiftDays: 1 }]
    });
    expect(result.revisedServiceDate).toBe("2026-07-05");
  });

  it("handles multiple-day shifts", () => {
    const result = calculateSchedule({
      normalServiceDate: "2026-12-25",
      community: "town-of-walworth",
      serviceType: "trash",
      rules: [{ id: "holiday", holidayDate: "2026-12-25", shiftDays: 2 }]
    });
    expect(result.revisedServiceDate).toBe("2026-12-27");
  });

  it("skips weekends when configured", () => {
    const result = calculateSchedule({
      normalServiceDate: "2026-12-25",
      community: "town-of-walworth",
      serviceType: "trash",
      rules: [{ id: "holiday", holidayDate: "2026-12-25", shiftDays: 1, skipWeekends: true }]
    });
    expect(result.revisedServiceDate).toBe("2026-12-28");
  });

  it("applies community exceptions", () => {
    const result = calculateSchedule({
      normalServiceDate: "2026-07-04",
      community: "city-of-delavan",
      serviceType: "trash",
      rules: [{ id: "holiday", holidayDate: "2026-07-04", shiftDays: 1, affectedCommunities: ["town-of-walworth"] }]
    });
    expect(result.alertStatus).toBe("normal");
  });

  it("uses manual overrides before rules", () => {
    const result = calculateSchedule({
      normalServiceDate: "2026-07-04",
      community: "town-of-walworth",
      serviceType: "trash",
      rules: [{ id: "holiday", holidayDate: "2026-07-04", shiftDays: 1 }],
      overrides: [{ originalServiceDate: "2026-07-04", revisedServiceDate: "2026-07-07", explanation: "Manual route update." }]
    });
    expect(result.revisedServiceDate).toBe("2026-07-07");
  });

  it("ignores expired rules", () => {
    const result = calculateSchedule({
      normalServiceDate: "2026-07-04",
      community: "town-of-walworth",
      serviceType: "trash",
      now: new Date("2026-08-01T00:00:00.000Z"),
      rules: [{ id: "holiday", holidayDate: "2026-07-04", shiftDays: 1, effectiveEnd: "2026-07-10" }]
    });
    expect(result.alertStatus).toBe("normal");
  });

  it("returns normal service when no rule applies", () => {
    const result = calculateSchedule({
      normalServiceDate: "2026-07-08",
      community: "town-of-walworth",
      serviceType: "trash",
      rules: []
    });
    expect(result.revisedServiceDate).toBe("2026-07-08");
  });
});
