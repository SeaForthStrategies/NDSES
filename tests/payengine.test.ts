import crypto from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { chargePayEngineCard, verifyPayEngineWebhook } from "@/lib/payments/payengine";

describe("PayEngine placeholder", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not pretend to be production ready without credentials", async () => {
    vi.stubEnv("PAYENGINE_API_URL", "");
    vi.stubEnv("PAYENGINE_MERCHANT_ID", "");
    vi.stubEnv("PAYENGINE_SECRET_KEY", "");
    const result = await chargePayEngineCard("card_sandbox_test", { accountNumber: "123", amount: "10.00", email: "a@example.com" });
    expect(result.mode).toBe("placeholder");
  });
});

describe("PayEngine webhook signature", () => {
  const secret = "test-webhook-secret";

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function sign(body: string, timestamp: number) {
    const signedPayload = `${timestamp}.${body}`;
    const signature = crypto.createHmac("sha256", secret).update(signedPayload, "utf-8").digest("hex");
    return `t=${timestamp},s=${signature}`;
  }

  it("rejects when no webhook secret is configured", () => {
    vi.stubEnv("PAYENGINE_WEBHOOK_SECRET", "");
    const body = JSON.stringify({ event: "PAYMENT_SALE" });
    expect(verifyPayEngineWebhook(body, sign(body, Math.floor(Date.now() / 1000)))).toBe(false);
  });

  it("accepts a correctly signed, fresh payload", () => {
    vi.stubEnv("PAYENGINE_WEBHOOK_SECRET", secret);
    const body = JSON.stringify({ event: "PAYMENT_SALE", data: { transactionId: "abc123" } });
    const header = sign(body, Math.floor(Date.now() / 1000));
    expect(verifyPayEngineWebhook(body, header)).toBe(true);
  });

  it("rejects a tampered payload", () => {
    vi.stubEnv("PAYENGINE_WEBHOOK_SECRET", secret);
    const body = JSON.stringify({ event: "PAYMENT_SALE", data: { transactionId: "abc123" } });
    const header = sign(body, Math.floor(Date.now() / 1000));
    const tamperedBody = JSON.stringify({ event: "PAYMENT_SALE", data: { transactionId: "xyz999" } });
    expect(verifyPayEngineWebhook(tamperedBody, header)).toBe(false);
  });

  it("rejects a stale timestamp outside the tolerance window", () => {
    vi.stubEnv("PAYENGINE_WEBHOOK_SECRET", secret);
    const body = JSON.stringify({ event: "PAYMENT_SALE" });
    const staleTimestamp = Math.floor(Date.now() / 1000) - 3600;
    const header = sign(body, staleTimestamp);
    expect(verifyPayEngineWebhook(body, header)).toBe(false);
  });

  it("rejects a missing signature header", () => {
    vi.stubEnv("PAYENGINE_WEBHOOK_SECRET", secret);
    expect(verifyPayEngineWebhook("{}", null)).toBe(false);
  });
});
