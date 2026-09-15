import { NextRequest, NextResponse } from "next/server";
import { getPayEngineTransaction, verifyPayEngineWebhook } from "@/lib/payments/payengine";

// Events that carry a transaction we care about auditing.
// https://docs.payengine.co/merchant-api-reference/webhooks/available-webhooks
const TRANSACTION_EVENTS = new Set([
  "PAYMENT_SALE",
  "PAYMENT_ACH",
  "PAYMENT_FAILED",
  "PAYMENT_REFUNDED",
  "PAYMENT_ACH_REFUNDED",
  "TRANSACTION_STATUS_CHANGED"
]);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-pf-signature");

  if (!verifyPayEngineWebhook(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as { event?: string; data?: { TransactionID?: string; id?: string } };
  const transactionId = event.data?.TransactionID ?? event.data?.id;

  // Acknowledge quickly (PayEngine records a failed delivery past 3s) then handle.
  // Our own charge already gets a synchronous PASS/FAIL from the Sale/ACH API,
  // so this is an audit trail and a way to catch later status changes
  // (refunds, disputes) rather than the primary completion signal.
  if (event.event && TRANSACTION_EVENTS.has(event.event) && transactionId) {
    getPayEngineTransaction(transactionId).catch((error) => {
      console.error("PayEngine post-webhook transaction lookup failed", error);
    });
  }

  return NextResponse.json({ received: true });
}
