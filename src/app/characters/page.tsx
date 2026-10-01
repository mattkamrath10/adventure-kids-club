import { CrewDirectory } from "@/components/characters/crew-directory";
import { characters } from "@/data/characters";
import { starterMetadata } from "@/lib/metadata";
import { publicFileExists } from "@/lib/public-images";

export const metadata = starterMetadata("Meet the Crew", "/characters");

export default function CharactersPage() {
  const crew = characters.map((character) => ({
    ...character,
    photo: publicFileExists(character.image) ? character.image : null,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="text-center text-5xl text-gold sm:text-7xl">Meet the Crew!</h1>
      <CrewDirectory crew={crew} />
    </div>
  );
}
