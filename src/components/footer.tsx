import Link from "next/link";
import { JoinClubBanner } from "@/components/join/join-club-banner";
import { footerLinks } from "@/data/nav";
import { site } from "@/data/site";
import { platformClassName, SocialIcon } from "./social-icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <JoinClubBanner />
      <div className="border-t border-white/15 bg-navy px-4 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 text-center">
          <nav aria-label="Social media">
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {site.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name}, ${site.handle} (opens in a new tab)`}
                    className={`inline-flex size-14 items-center justify-center rounded-full hover:brightness-110 ${
                      platformClassName[social.name] ?? "bg-sky text-navy"
                    }`}
                  >
                    <SocialIcon name={social.name} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-heading text-xl text-white">
              Find us <span className="text-gold">{site.handle}</span>
            </p>
          </nav>

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-12 items-center rounded-full px-4 font-heading text-lg text-gold underline decoration-2 underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-2">
            <p className="font-heading text-xl">
              © {year} {site.brand}
            </p>
            <p>{site.footerNote}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
