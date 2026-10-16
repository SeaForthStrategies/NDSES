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

  it("rejects zero and out-of-range payment amounts", () => {
    const base = { accountNumber: "123", email: "pay@example.com", token: "card_sandbox_abc123" };
    expect(paymentSchema.safeParse({ ...base, amount: "0" }).success).toBe(false);
    expect(paymentSchema.safeParse({ ...base, amount: "0.00" }).success).toBe(false);
    expect(paymentSchema.safeParse({ ...base, amount: "50000.01" }).success).toBe(false);
    expect(paymentSchema.safeParse({ ...base, amount: "50000" }).success).toBe(true);
  });

  it("rejects payment input missing a payment token", () => {
    expect(paymentSchema.safeParse({ accountNumber: "123", amount: "10.50", email: "pay@example.com" }).success).toBe(false);
  });
});
