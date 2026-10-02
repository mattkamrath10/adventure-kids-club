import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";

export async function POST() {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }

  revalidateTag("akc-image-overrides", { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
