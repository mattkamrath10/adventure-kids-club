import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest() {
  return NextResponse.json({ ok: false }, { status: 400 });
}

function unavailable() {
  return NextResponse.json({ ok: false }, { status: 500 });
}

export async function POST(request: Request) {
  let firstName = "";
  let email = "";
  let isAdult = false;

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return badRequest();
    const record = body as { firstName?: unknown; email?: unknown; isAdult?: unknown };
    if (typeof record.firstName === "string") firstName = record.firstName.trim();
    if (typeof record.email === "string") email = record.email.trim();
    isAdult = record.isAdult === true;
  } catch {
    return badRequest();
  }

  if (!isAdult || email.length > 254 || !emailPattern.test(email)) return badRequest();

  const formId = process.env.KIT_FORM_ID?.trim();
  if (!formId) return unavailable();

  const body = new URLSearchParams();
  body.set("email_address", email);
  body.set("fields[first_name]", firstName);

  try {
    const response = await fetch(
      `https://app.kit.com/forms/${encodeURIComponent(formId)}/subscriptions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        redirect: "manual",
        cache: "no-store",
      },
    );
    if (response.status >= 200 && response.status < 400) {
      return NextResponse.json({ ok: true });
    }
    return unavailable();
  } catch {
    return unavailable();
  }
}
