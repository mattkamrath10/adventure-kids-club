import { site } from "@/data/site";
import { platformClassName, SocialIcon } from "@/components/social-icons";

export function WhereToWatch() {
  const socials = [...site.socials].sort(
    (a, b) => Number(Boolean(b.primary)) - Number(Boolean(a.primary)),
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16" aria-labelledby="where-to-watch">
      <h2 id="where-to-watch" className="text-center text-4xl text-white sm:text-5xl">
        Where do you watch?
      </h2>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {socials.map((social) => (
          <li
            key={social.name}
            className={`play-float ${social.primary ? "sm:col-span-2 lg:row-span-2" : ""}`}
          >
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.name}${social.primary ? ", main channel" : ""}. ${social.description}. Opens in a new tab.`}
              className={`flex h-full min-h-44 flex-col justify-between rounded-[2rem] p-6 focus-visible:outline-white sm:min-h-48 ${
                social.primary ? "min-h-64 sm:min-h-72" : ""
              } ${platformClassName[social.name] ?? "bg-sky text-navy"}`}
            >
              <span className="flex items-center gap-4">
                <SocialIcon name={social.name} className={social.primary ? "size-16" : "size-12"} />
                <span>
                  {social.primary ? (
                    <span className="block font-heading text-lg font-bold">Main channel</span>
                  ) : null}
                  <span className={`block font-heading font-bold ${social.primary ? "text-4xl sm:text-5xl" : "text-3xl"}`}>
                    {social.name}
                  </span>
                </span>
              </span>
              <span className={`mt-6 block font-bold ${social.primary ? "text-2xl" : "text-xl"}`}>
                {social.description}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
