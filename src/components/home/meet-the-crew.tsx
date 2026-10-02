import Image from "next/image";
import Link from "next/link";
import { characters } from "@/data/characters";
import { inkClass } from "@/lib/contrast";
import { characterPhoto } from "@/lib/public-images";

export function MeetTheCrew() {
  const crew = characters.slice(0, 8);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16" aria-labelledby="meet-the-crew">
      <h2 id="meet-the-crew" className="text-center text-4xl text-white sm:text-5xl">
        Meet the crew
      </h2>
      <ul className="mt-8 flex snap-x gap-5 overflow-x-auto px-1 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {crew.map((character) => {
          const photo = characterPhoto(character.id, character.name) ?? undefined;
          const ink = inkClass(character.color);

          return (
            <li key={character.id} className="play-float shrink-0 snap-center">
              <Link href={`/characters#${character.id}`} className="flex w-28 flex-col items-center gap-3 sm:w-36">
                <span
                  className={`crew-portrait relative flex size-28 items-center justify-center overflow-hidden rounded-full ring-4 ring-white sm:size-36 ${ink}`}
                  style={{ backgroundColor: character.color }}
                >
                  {photo ? (
                    <Image
                      src={photo}
                      alt=""
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  ) : (
                    <span aria-hidden="true" className="font-heading text-4xl sm:text-5xl">
                      {character.name.slice(0, 1)}
                    </span>
                  )}
                </span>
                <span className="text-center font-heading text-lg font-bold text-white">
                  {character.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
