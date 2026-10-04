import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const kitHeaders = (apiKey: string) => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Kit-Api-Key": apiKey,
});

function badRequest() {
  return NextResponse.json({ ok: false }, { status: 400 });
}

function unavailable() {
  return NextResponse.json({ ok: false }, { status: 500 });
}

function hideEmail(text: string, email: string) {
  return text.split(email).join("[redacted]");
}

async function kitPost(step: number, url: string, apiKey: string, email: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: kitHeaders(apiKey),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (response.ok) return true;
  const text = await response.text();
  console.error("Kit error", step, response.status, hideEmail(text, email));
  return false;
}

export async function POST(request: Request) {
  let firstName = "";
  let email = "";
  let isAdult = false;

  try {
    const payload: unknown = await request.json();
    if (!payload || typeof payload !== "object") return badRequest();
    const record = payload as { firstName?: unknown; email?: unknown; isAdult?: unknown };
    if (typeof record.firstName === "string") firstName = record.firstName.trim();
    if (typeof record.email === "string") email = record.email.trim();
    isAdult = record.isAdult === true;
  } catch {
    return badRequest();
  }

  if (!isAdult || email.length > 254 || !emailPattern.test(email)) return badRequest();

  const apiKey = process.env.KIT_API_KEY?.trim();
  const formId = process.env.KIT_FORM_ID?.trim();
  if (!apiKey || !formId) {
    console.error("KIT env var missing");
    return unavailable();
  }

  try {
    const created = await kitPost(1, "https://api.kit.com/v4/subscribers", apiKey, email, {
      email_address: email,
      first_name: firstName || null,
      state: "inactive",
    });
    if (!created) return unavailable();

    const added = await kitPost(
      2,
      `https://api.kit.com/v4/forms/${encodeURIComponent(formId)}/subscribers`,
      apiKey,
      email,
      {
        email_address: email,
        referrer: "https://www.adventure8kidsclub.com/join",
      },
    );
    if (!added) return unavailable();

    return NextResponse.json({ ok: true });
  } catch {
    console.error("Kit error", "request failed");
    return unavailable();
  }
}
