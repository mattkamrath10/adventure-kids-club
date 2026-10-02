import Image from "next/image";
import Link from "next/link";
import { EditableImage } from "@/components/owner/image-overrides";
import { inkClass } from "@/lib/contrast";

export type JoinKid = {
  id: string;
  name: string;
  color: string;
  image: string | null;
  slotKey: string;
};

const spots = [
  "col-start-1 row-start-1 lg:col-start-1 lg:row-start-1",
  "col-start-2 row-start-1 lg:col-start-3 lg:row-start-1",
  "col-start-1 row-start-3 lg:col-start-1 lg:row-start-2",
  "col-start-2 row-start-3 lg:col-start-3 lg:row-start-2",
];

export function AdventureKids({ kids }: { kids: JoinKid[] }) {
  return (
    <div className="grid grid-cols-2 items-center gap-x-4 gap-y-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-10">
      <div className="col-span-2 col-start-1 row-start-2 text-center lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <h1 className="text-balance text-5xl text-gold sm:text-7xl">Join the Adventure Kids Club!</h1>
        <p className="mx-auto mt-4 max-w-xl text-xl font-bold text-white">
          This note is for parents and guardians. Join the list and we&apos;ll share new episode
          alerts, printable coloring pages, and a little behind-the-scenes fun.
        </p>
      </div>
      {kids.map((kid, index) => (
        <Link
          key={kid.id}
          href={`/characters#${kid.id}`}
          className={`flex flex-col items-center gap-2 justify-self-center ${spots[index] ?? ""}`}
        >
          <span
            className={`crew-portrait relative flex size-28 items-center justify-center rounded-full ring-4 ring-white sm:size-36 lg:size-44 ${inkClass(kid.color)}`}
            style={{ backgroundColor: kid.color }}
          >
            <EditableImage slotKey={kid.slotKey} alt="" clipClassName="rounded-full">
              {kid.image ? (
                <Image
                  src={kid.image}
                  alt=""
                  fill
                  priority={index < 2}
                  sizes="(min-width: 1024px) 176px, (min-width: 640px) 144px, 112px"
                  className="object-cover"
                />
              ) : (
                <span aria-hidden="true" className="font-heading text-5xl lg:text-6xl">
                  {kid.name.slice(0, 1)}
                </span>
              )}
            </EditableImage>
          </span>
          <span className="font-heading text-xl text-white">{kid.name}</span>
        </Link>
      ))}
    </div>
  );
}
