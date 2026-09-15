import { describe, expect, it } from "vitest";
import { inquirySchema } from "@/lib/validation/forms";
import { paymentSchema } from "@/lib/validation/payments";

describe("validation", () => {
  it("validates form submissions", () => {
    expect(inquirySchema.safeParse({ formType: "general", name: "A", email: "bad", message: "short" }).success).toBe(false);
  });

  it("validates payment input", () => {
    expect(
      paymentSchema.safeParse({ accountNumber: "123", amount: "10.50", email: "pay@example.com", token: "card_sandbox_abc123" }).success
    ).toBe(true);
  });

  it("rejects payment input missing a payment token", () => {
    expect(paymentSchema.safeParse({ accountNumber: "123", amount: "10.50", email: "pay@example.com" }).success).toBe(false);
  });
});
