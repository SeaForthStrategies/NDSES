import { NextRequest, NextResponse } from "next/server";
import { verifyPayEngineWebhook } from "@/lib/payments/payengine";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("payengine-signature");
  if (!verifyPayEngineWebhook(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  return NextResponse.json({ received: true });
}
