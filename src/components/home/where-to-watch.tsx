import { site } from "@/data/site";
import { platformClassName, SocialIcon } from "@/components/social-icons";

export function WhereToWatch() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16" aria-labelledby="where-to-watch">
      <h2 id="where-to-watch" className="text-center text-4xl text-white sm:text-5xl">
        Where do you watch?
      </h2>
      <p className="mt-3 text-center font-heading text-xl font-bold text-white sm:text-2xl">
        Find us <span className="text-gold">{site.handle}</span>
      </p>
      <ul className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {site.socials.map((social) => (
          <li key={social.name} className="play-float min-w-0">
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.name}, ${site.handle}. ${social.description}. Opens in a new tab.`}
              className={`flex h-full min-h-44 flex-col justify-between rounded-[2rem] p-6 focus-visible:outline-white ${
                platformClassName[social.name] ?? "bg-sky text-navy"
              }`}
            >
              <span className="flex items-center gap-4">
                <SocialIcon name={social.name} className="size-14" />
                <span className="font-heading text-3xl font-bold">{social.name}</span>
              </span>
              <span className="mt-6 block text-xl font-bold">{social.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
