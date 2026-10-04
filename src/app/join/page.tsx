import { AdventureKids } from "@/components/join/adventure-kids";
import { NewsletterForm } from "@/components/join/newsletter-form";
import { characters } from "@/data/characters";
import { starterMetadata } from "@/lib/metadata";
import { characterPhoto } from "@/lib/public-images";

export const metadata = starterMetadata("Join the Club", "/join");

const perks = [
  {
    title: "New episode alerts",
    body: "Know when a new episode is ready to watch.",
    className: "bg-gold",
  },
  {
    title: "Printable coloring pages",
    body: "A page to print and color together.",
    className: "bg-lime",
  },
  {
    title: "Behind-the-scenes fun",
    body: "A peek at how the show gets made.",
    className: "bg-sky",
  },
];

export default function JoinPage() {
  const kids = characters
    .filter((character) => character.group === "Adventure Kids")
    .map((character) => ({
      id: character.id,
      name: character.name,
      color: character.color,
      image: characterPhoto(character.id, character.name),
      slotKey: character.image,
    }));

  return (
    <div className="px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <AdventureKids kids={kids} />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk) => (
            <li key={perk.title} className={`play-float rounded-[2rem] px-5 py-8 text-navy ${perk.className}`}>
              <h2 className="text-3xl">{perk.title}</h2>
              <p className="mt-2 text-lg font-bold">{perk.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-lg font-bold text-white sm:text-xl">
          It&apos;s 100% free. After you confirm your email, you&apos;ll get a link to the members page.
        </p>

        <div className="mx-auto mt-10 max-w-xl rounded-[2rem] bg-white px-5 py-8 text-navy sm:px-8">
          <h2 className="text-center text-4xl">For grown-ups only</h2>
          <p className="mt-3 text-center text-lg font-bold">
            We don&apos;t ask kids for their names, emails, or anything else. This signup is just for you.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
