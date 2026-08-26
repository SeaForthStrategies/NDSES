import { NextRequest, NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validation/forms";
import { trackServerEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please review the highlighted fields.", issues: parsed.error.flatten() }, { status: 400 });
  }

  // TODO: Form Backend - Connect final webhook, CRM, or email routing.
  if (!process.env.FORM_WEBHOOK_URL && !process.env.FORM_NOTIFICATION_EMAIL) {
    return NextResponse.json({ ok: true, message: "Form received." });
  }

  await trackServerEvent("form_submission", { formType: parsed.data.formType });
  return NextResponse.json({ ok: true });
}
