import { site } from "@/data/site";
import { platformClassName, SocialIcon } from "@/components/social-icons";

export function PlatformRow() {
  const socials = [...site.socials].sort(
    (a, b) => Number(Boolean(b.primary)) - Number(Boolean(a.primary)),
  );

  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {socials.map((social) => (
        <li key={social.name} className={`play-float min-w-0 ${social.primary ? "col-span-2" : ""}`}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${social.name}, ${site.handle}. ${social.description}. Opens in a new tab.`}
            className={`flex h-full min-w-0 flex-col justify-between rounded-[2rem] p-5 focus-visible:outline-white ${
              social.primary ? "min-h-32 sm:min-h-40" : "min-h-24"
            } ${platformClassName[social.name] ?? "bg-sky text-navy"}`}
          >
            <SocialIcon name={social.name} className={social.primary ? "size-14" : "size-10"} />
            <span className="mt-4">
              <span
                className={`block font-heading font-bold leading-none ${
                  social.primary ? "text-4xl sm:text-5xl" : "text-xl sm:text-2xl"
                }`}
              >
                {social.name}
              </span>
              <span className="mt-2 block text-xl font-bold">
                {social.description}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
