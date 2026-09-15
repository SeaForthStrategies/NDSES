import { NextRequest, NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validation/forms";
import { trackServerEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please review the highlighted fields.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const wordpressBase = process.env.WORDPRESS_API_URL?.replace(/\/$/, "");
  if (!wordpressBase) {
    return NextResponse.json({ error: "Form submission is not connected yet. Please call NDSES directly." }, { status: 502 });
  }

  try {
    const response = await fetch(`${wordpressBase}/ndses/v1/forms`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsed.data)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      console.error("Form submission to WordPress failed", response.status, body);
      return NextResponse.json({ error: body?.message || "We couldn't send your request. Please try again or call NDSES directly." }, { status: response.status === 429 ? 429 : 502 });
    }
  } catch (error) {
    console.error("Form submission to WordPress failed", error);
    return NextResponse.json({ error: "We couldn't send your request. Please try again or call NDSES directly." }, { status: 502 });
  }

  await trackServerEvent("form_submission", { formType: parsed.data.formType });
  return NextResponse.json({ ok: true });
}
