import { NextResponse } from "next/server";
import { checkCredentials, createSession } from "@/lib/auth";

const WRONG = "Wrong username or password";

async function reject(): Promise<NextResponse> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
  return NextResponse.json({ error: WRONG }, { status: 401 });
}

export async function POST(request: Request) {
  let username = "";
  let password = "";

  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object") {
      const record = body as { username?: unknown; password?: unknown };
      if (typeof record.username === "string") username = record.username;
      if (typeof record.password === "string") password = record.password;
    }
  } catch {
    return reject();
  }

  if (!process.env.SESSION_SECRET || !checkCredentials(username, password)) {
    return reject();
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
