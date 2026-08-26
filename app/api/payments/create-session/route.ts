import { NextRequest, NextResponse } from "next/server";
import { createPayEngineSession } from "@/lib/payments/payengine";
import { paymentSchema } from "@/lib/validation/payments";

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);
  const parsed = paymentSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payment information is incomplete.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const result = await createPayEngineSession(parsed.data);
  const status = result.mode === "placeholder" ? 202 : 200;
  return NextResponse.json(result, { status });
}
