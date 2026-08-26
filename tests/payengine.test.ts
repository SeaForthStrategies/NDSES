import { describe, expect, it } from "vitest";
import { createPayEngineSession } from "@/lib/payments/payengine";

describe("PayEngine placeholder", () => {
  it("does not pretend to be production ready without credentials", async () => {
    const result = await createPayEngineSession({ accountNumber: "123", amount: "10.00", email: "a@example.com" });
    expect(result.mode).toBe("placeholder");
  });
});
