import { NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";

export async function GET() {
  const owner = await isOwner();
  return NextResponse.json(
    { owner },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
