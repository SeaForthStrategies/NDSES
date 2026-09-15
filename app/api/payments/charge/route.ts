import { NextRequest, NextResponse } from "next/server";
import { chargePayEngineACH, chargePayEngineCard } from "@/lib/payments/payengine";
import { paymentSchema } from "@/lib/validation/payments";

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);
  const parsed = paymentSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payment information is incomplete.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { token, paymentMethod, ...rest } = parsed.data;
  const result =
    paymentMethod === "ach" ? await chargePayEngineACH(token, rest) : await chargePayEngineCard(token, rest);

  const status =
    result.mode === "placeholder" ? 202 : result.mode === "declined" ? 402 : result.mode === "error" ? 502 : 200;
  return NextResponse.json(result, { status });
}
