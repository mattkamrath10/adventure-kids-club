import { NewsletterForm } from "./newsletter-form";

export function JoinClubBanner() {
  return (
    <section aria-labelledby="join-club-banner" className="bg-gold px-4 py-10 text-navy">
      <div className="mx-auto w-full max-w-xl">
        <h2 id="join-club-banner" className="text-center text-4xl sm:text-5xl">
          Join the club
        </h2>
        <p className="mt-2 text-center text-lg font-bold">
          New episode alerts, coloring pages, and behind-the-scenes notes for parents.
        </p>
        <div className="mt-6">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
