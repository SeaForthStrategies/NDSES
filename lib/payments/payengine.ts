import crypto from "node:crypto";
import type { PaymentInput } from "@/lib/validation/payments";

export async function createPayEngineSession(input: Omit<PaymentInput, "paymentMethod"> & Partial<Pick<PaymentInput, "paymentMethod">>) {
  const paymentMethod = input.paymentMethod ?? "card";
  // TODO: PayEngine - Replace this placeholder with hosted PayEngine session creation.
  const required = [
    process.env.PAYENGINE_API_URL,
    process.env.PAYENGINE_MERCHANT_ID,
    process.env.PAYENGINE_PUBLIC_KEY,
    process.env.PAYENGINE_SECRET_KEY
  ];

  if (required.some((value) => !value)) {
    return {
      mode: "placeholder" as const,
      message: `${paymentMethod === "ach" ? "ACH" : "Card"} payments are not available yet. Please contact NDSES for current payment options.`,
      accountNumber: input.accountNumber
    };
  }

  return {
    mode: "ready" as const,
    message: "PayEngine session creation hook is ready for final API requirements.",
    accountNumber: input.accountNumber
  };
}

export function verifyPayEngineWebhook(body: string, signature: string | null) {
  const secret = process.env.PAYENGINE_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
