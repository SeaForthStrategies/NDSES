import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret") || request.nextUrl.searchParams.get("secret");
  if (!process.env.WORDPRESS_REVALIDATION_SECRET || secret !== process.env.WORDPRESS_REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const paths = Array.isArray(body.paths) ? body.paths : ["/"];
  const tags = Array.isArray(body.tags) ? body.tags : ["cms"];

  for (const path of paths) {
    if (typeof path === "string" && path.startsWith("/")) revalidatePath(path);
  }
  for (const tag of tags) {
    if (typeof tag === "string") revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true, paths, tags });
}
