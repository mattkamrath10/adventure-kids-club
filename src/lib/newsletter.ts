/**
 * The join form posts straight to your email provider. There is no API route.
 * Set NEXT_PUBLIC_NEWSLETTER_ACTION to the provider's embedded form action URL.
 * Mailchimp, Kit, and Buttondown each expect different field names; this file maps them.
 * See the README section "Newsletter signup".
 */

export const newsletterCopy = {
  unconfigured:
    "The club list isn't connected yet. Please try again in a little while.",
  failed: "That didn't go through. Please check the email and try again.",
  unreachable: "We couldn't reach the club list. Please try again in a minute.",
  successTitle: "You're in!",
  successBody:
    "Check your inbox for a hello from the club. If we sent a confirmation note, tap it so we know it's you.",
  alreadyTitle: "You're already on the list!",
  alreadyBody: "We'll send the next adventure to that inbox.",
} as const;

export type NewsletterProvider = "mailchimp" | "kit" | "buttondown" | "generic";

export type SubscribeResult =
  | { status: "success"; already: boolean }
  | { status: "error"; message: string }
  | { status: "navigate" };

type MailchimpResponse = {
  result?: string;
  msg?: string;
};

export function newsletterAction() {
  const value = process.env.NEXT_PUBLIC_NEWSLETTER_ACTION?.trim() ?? "";
  if (!value) return "";

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function newsletterProvider(action: string): NewsletterProvider | "unconfigured" {
  if (!action) return "unconfigured";

  const host = new URL(action).hostname.toLowerCase();
  if (host.endsWith("list-manage.com")) return "mailchimp";
  if (host.endsWith("kit.com") || host.endsWith("convertkit.com")) return "kit";
  if (host.endsWith("buttondown.com") || host.endsWith("buttondown.email")) return "buttondown";
  return "generic";
}

/** Input `name` values for a no-JavaScript submit. Buttondown's embed stores email only. */
export function newsletterFieldNames(provider: NewsletterProvider | "unconfigured") {
  switch (provider) {
    case "mailchimp":
      return { email: "EMAIL", firstName: "FNAME" };
    case "kit":
      return { email: "email_address", firstName: "fields[first_name]" };
    case "buttondown":
      return { email: "email", firstName: null };
    default:
      return { email: "email", firstName: "first_name" };
  }
}

export function mailchimpHoneypotName(action: string) {
  const url = new URL(action);
  const user = url.searchParams.get("u");
  const list = url.searchParams.get("id");
  if (!user || !list) return null;
  return `b_${user}_${list}`;
}

export async function subscribeToNewsletter(input: {
  action: string;
  email: string;
  firstName: string;
}): Promise<SubscribeResult> {
  const action = input.action;
  const provider = newsletterProvider(action);
  if (provider === "unconfigured") {
    return { status: "error", message: newsletterCopy.unconfigured };
  }

  const email = input.email.trim();
  const firstName = input.firstName.trim();

  if (provider === "mailchimp") {
    return mailchimpSubscribe(action, email, firstName);
  }

  const body = new FormData();
  if (provider === "kit") {
    body.set("email_address", email);
    if (firstName) {
      body.set("first_name", firstName);
      body.set("fields[first_name]", firstName);
    }
  } else if (provider === "buttondown") {
    body.set("email", email);
    body.set("embed", "1");
  } else {
    body.set("email", email);
    if (firstName) body.set("first_name", firstName);
  }

  try {
    const response = await fetch(action, {
      method: "POST",
      body,
      headers: { Accept: "application/json" },
    });
    const text = await response.text();
    if (/already subscribed/i.test(text)) return { status: "success", already: true };
    if (!response.ok) return { status: "error", message: newsletterCopy.failed };

    try {
      const data = JSON.parse(text) as { status?: string; result?: string; msg?: string };
      const detail = `${data.status ?? ""} ${data.result ?? ""} ${data.msg ?? ""}`;
      if (/already subscribed/i.test(detail)) return { status: "success", already: true };
      if (/\b(error|fail)/i.test(detail)) {
        return { status: "error", message: newsletterCopy.failed };
      }
    } catch {
      // A thank-you page is still a completed signup.
    }

    return { status: "success", already: false };
  } catch {
    // The browser blocked the response (often a missing CORS header).
    // Hand the same form to the provider as a normal POST so the signup still works.
    return { status: "navigate" };
  }
}

function mailchimpSubscribe(action: string, email: string, firstName: string) {
  const url = new URL(action);
  if (!/\/post-json\/?$/i.test(url.pathname)) {
    url.pathname = url.pathname.replace(/\/post\/?$/i, "/post-json");
  }
  url.searchParams.set("EMAIL", email);
  if (firstName) url.searchParams.set("FNAME", firstName);
  const honeypot = mailchimpHoneypotName(action);
  if (honeypot) url.searchParams.set(honeypot, "");

  const callback = `mcJoin${Date.now()}${Math.floor(Math.random() * 1000)}`;
  url.searchParams.set("c", callback);

  return new Promise<SubscribeResult>((resolve) => {
    const script = document.createElement("script");
    const callbacks = window as unknown as Record<string, ((data: MailchimpResponse) => void) | undefined>;
    let settled = false;

    const finish = (result: SubscribeResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      script.remove();
      callbacks[callback] = () => {};
      resolve(result);
    };

    const timer = window.setTimeout(() => {
      finish({ status: "error", message: newsletterCopy.unreachable });
    }, 12000);

    callbacks[callback] = (data) => {
      const msg = data?.msg ?? "";
      if (/already subscribed/i.test(msg)) {
        finish({ status: "success", already: true });
        return;
      }
      if (data?.result === "success") {
        finish({ status: "success", already: false });
        return;
      }
      finish({ status: "error", message: newsletterCopy.failed });
    };

    script.onerror = () => {
      finish({ status: "error", message: newsletterCopy.unreachable });
    };
    script.src = url.toString();
    document.body.appendChild(script);
  });
}
