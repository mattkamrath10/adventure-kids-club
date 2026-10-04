import Link from "next/link";
import { site } from "@/data/site";
import { starterMetadata } from "@/lib/metadata";

export const metadata = starterMetadata("Privacy Policy", "/privacy");

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-5xl text-sky sm:text-7xl">Privacy Policy</h1>
      <p className="mt-4 font-heading text-2xl text-gold">Last updated: October 1, 2026</p>

      <aside className="mt-8 rounded-[2rem] bg-gold px-5 py-6 text-navy sm:px-8">
        <h2 className="text-3xl sm:text-4xl">Please have this reviewed before launch</h2>
        <p className="mt-3 text-lg font-bold">
          This page is a plain-language starting point for families. It is not legal advice. Have a
          lawyer, or someone who knows children&apos;s privacy rules, read it before the site goes
          live.
        </p>
      </aside>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-3xl text-gold sm:text-4xl">This site is for families</h2>
          <p className="mt-3">
            {site.show} is a show for young kids. This website is a place
            to meet the characters, watch episodes, and look at pictures. Parents and guardians are
            the people who sign up and write to us.
          </p>
        </section>

        <section>
          <h2 className="text-3xl text-gold sm:text-4xl">We don&apos;t collect info from children</h2>
          <p className="mt-3">
            We don&apos;t knowingly collect personal information from children under 13. We don&apos;t
            ask kids for a name, email, age, photo, or location.
          </p>
          <p className="mt-3">
            If we learn that a child sent us information, we will delete it and we won&apos;t use it.
          </p>
        </section>

        <section>
          <h2 className="text-3xl text-gold sm:text-4xl">The mailing list is for parents</h2>
          <p className="mt-3">
            The &quot;Join the club&quot; form is only for a parent or guardian, 18 or older. We ask
            for a parent&apos;s email, and a first name if you want to share one. You have to check
            a box that says you are a parent or guardian.
          </p>
          <p className="mt-3">
            That form goes to Formspree, which delivers it to us. We use it for notes about new
            episodes, coloring pages, and behind-the-scenes fun, not for ads.
          </p>
        </section>

        <section>
          <h2 className="text-3xl text-gold sm:text-4xl">The contact form is for parents</h2>
          <p className="mt-3">
            The contact form is only for a parent or guardian. Please don&apos;t ask a child to fill
            it out. We use Formspree to deliver those messages to us.
          </p>
        </section>

        <section>
          <h2 className="text-3xl text-gold sm:text-4xl">Videos load when you press play</h2>
          <p className="mt-3">
            The latest episode on the home page plays in youtube-nocookie.com, YouTube&apos;s
            privacy-enhanced player. On the Watch page, episode pictures stay on this site until
            someone presses play, and the video then loads from youtube-nocookie.com.
          </p>
        </section>

        <section>
          <h2 className="text-3xl text-gold sm:text-4xl">No ads and no tracking cookies</h2>
          <p className="mt-3">
            This site has no ads. We don&apos;t use analytics, and we don&apos;t set tracking
            cookies. We don&apos;t follow you around the web.
          </p>
          <p className="mt-3">
            Buttons for YouTube, Facebook, and Instagram open those sites in a new tab. Look for{" "}
            {site.handle}. Those sites have their own privacy rules.
          </p>
        </section>

        <section>
          <h2 className="text-3xl text-gold sm:text-4xl">Ask us to delete your info</h2>
          <p className="mt-3">
            Want your email or a message removed? Write to us and tell us the email address and
            what to delete. We&apos;ll take it off our list and ask our email provider and Formspree
            to delete it too.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-14 items-center rounded-full bg-gold px-8 font-heading text-xl text-navy hover:bg-white"
          >
            Write to us
          </Link>
        </section>
      </div>
    </article>
  );
}
