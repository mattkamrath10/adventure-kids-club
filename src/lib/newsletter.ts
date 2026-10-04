/** Join the club posts to /api/join, which subscribes the parent on Kit. */

export const newsletterSuccess =
  "Almost there! Check your email and tap the confirm button. That unlocks your free coloring pages and behind-the-scenes fun.";
export const newsletterError = "Something went wrong, please try again.";

export async function subscribeToNewsletter(input: {
  email: string;
  firstName: string;
  isAdult: boolean;
}): Promise<boolean> {
  try {
    const response = await fetch("/api/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        firstName: input.firstName.trim(),
        email: input.email.trim(),
        isAdult: input.isAdult,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
