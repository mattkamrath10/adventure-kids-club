import Image from "next/image";
import Link from "next/link";
import { characters } from "@/data/characters";
import { inkClass } from "@/lib/contrast";
import { characterPhoto } from "@/lib/public-images";

export default function NotFound() {
  const cj = characters.find((character) => character.id === "cj");
  const photo = cj ? characterPhoto(cj.id, cj.name) : null;

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-16 text-center sm:py-24">
      <span
        className={`play-float relative flex size-44 items-center justify-center overflow-hidden rounded-full ring-8 ring-white sm:size-56 ${
          cj ? inkClass(cj.color) : "text-navy"
        }`}
        style={{ backgroundColor: cj?.color ?? "#38BDF8" }}
      >
        {photo ? (
          <Image src={photo} alt={cj?.look ?? "CJ"} fill sizes="224px" className="object-cover" />
        ) : (
          <span aria-hidden="true" className="font-heading text-7xl sm:text-8xl">
            C
          </span>
        )}
      </span>
      <p className="mt-6 font-heading text-2xl text-sky">CJ</p>
      <h1 className="mt-3 max-w-3xl text-balance text-4xl text-gold sm:text-6xl">
        Uh oh, this planet isn&apos;t on our map!
      </h1>
      <p className="mt-4 max-w-xl text-xl font-bold text-white">
        CJ chirped ahead and this page isn&apos;t there. Let&apos;s fly back home.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-14 items-center rounded-full bg-gold px-8 font-heading text-xl text-navy hover:bg-white"
      >
        Back to home
      </Link>
    </div>
  );
}
