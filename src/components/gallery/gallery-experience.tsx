"use client";

import { useEffect, useState } from "react";
import { characters } from "@/data/characters";
import { site } from "@/data/site";
import { platformClassName, SocialIcon } from "@/components/social-icons";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { GalleryPicture, type GalleryItem } from "@/components/gallery/gallery-picture";
import { GallerySlideshow } from "@/components/gallery/gallery-slideshow";

const shapes = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[5/4]"];

const moreNames = ["Instagram", "Pinterest"];

export function GalleryExperience({ photos }: { photos: GalleryItem[] }) {
  const [filter, setFilter] = useState("All");
  const [viewer, setViewer] = useState<{ items: GalleryItem[]; index: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shown =
    filter === "All"
      ? photos
      : photos.filter((photo) => photo.characters.includes(filter));

  const more = moreNames
    .map((name) => site.socials.find((social) => social.name === name))
    .filter((social) => social !== undefined);

  return (
    <>
      <GallerySlideshow
        photos={photos}
        paused={viewer !== null}
        onOpen={(index) => setViewer({ items: photos, index })}
      />

      <section className="mx-auto mt-12 w-full max-w-6xl px-4 pb-16 sm:mt-16" aria-labelledby="who-to-see">
        <h2 id="who-to-see" className="text-center text-4xl text-white sm:text-5xl">
          Who do you want to see?
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter pictures">
          {["All", ...characters.map((character) => character.name)].map((name) => {
            const selected = filter === name;
            const color = characters.find((character) => character.name === name)?.color;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(name)}
                className={`inline-flex min-h-12 items-center rounded-full px-5 font-heading text-xl focus-visible:outline-white ${
                  selected ? "text-navy" : "bg-white/15 text-white hover:bg-white/25"
                } ${selected && name === "All" ? "bg-gold" : ""}`}
                style={selected && color ? { backgroundColor: color } : undefined}
              >
                {name}
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <p className="mt-10 text-center text-xl text-white">No pictures of {filter} yet.</p>
        ) : (
          <ul className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {shown.map((photo, index) => (
              <li key={photo.src} className="play-float mb-5 break-inside-avoid">
                <button
                  type="button"
                  className={`gallery-card block w-full text-left focus-visible:outline-white ${
                    index % 2 === 1 ? "gallery-card-alt" : ""
                  }`}
                  onClick={() => setViewer({ items: shown, index })}
                >
                  <span
                    className={`relative block overflow-hidden rounded-[2rem] ring-4 ring-white ${shapes[index % shapes.length]}`}
                  >
                    <GalleryPicture
                      photo={photo}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      zoom
                    />
                    <span className="absolute inset-x-3 bottom-3 rounded-2xl bg-navy/85 px-4 py-3 font-heading text-xl text-white">
                      {photo.caption}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 text-center">
          <p className="font-heading text-3xl text-white sm:text-4xl">
            See more pictures on Instagram and Pinterest!
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {more.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.name}. ${social.description}. Opens in a new tab.`}
                  className={`inline-flex min-h-14 items-center gap-3 rounded-full px-6 font-heading text-xl focus-visible:outline-white ${
                    platformClassName[social.name] ?? "bg-white text-navy"
                  }`}
                >
                  <SocialIcon name={social.name} className="size-7" />
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {mounted && viewer ? (
        <GalleryLightbox
          photos={viewer.items}
          startIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      ) : null}
    </>
  );
}
