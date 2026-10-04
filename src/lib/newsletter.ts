/**
 * The join form posts the parent's first name and email to Formspree.
 * Set NEXT_PUBLIC_NEWSLETTER_ACTION to the form URL, like https://formspree.io/f/your-id.
 */

export const newsletterSuccess = "You're in! Welcome to the club.";
export const newsletterError = "Something went wrong, please try again.";

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

export async function subscribeToNewsletter(input: {
  action: string;
  email: string;
  firstName: string;
}): Promise<boolean> {
  if (!input.action) return false;

  const body = new FormData();
  body.set("first_name", input.firstName.trim());
  body.set("email", input.email.trim());

  try {
    const response = await fetch(input.action, {
      method: "POST",
      body,
      headers: { Accept: "application/json" },
    });
    return response.ok;
  } catch {
    return false;
  }
}
