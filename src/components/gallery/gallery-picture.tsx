import Image from "next/image";
import { EditableImage } from "@/components/owner/image-overrides";
import { characters } from "@/data/characters";
import type { GalleryPhoto } from "@/data/gallery";

export type GalleryItem = GalleryPhoto & { hasFile: boolean };

export function pictureColor(names: readonly string[]) {
  for (const name of names) {
    const match = characters.find((character) => character.name === name);
    if (match) return match.color;
  }
  return "#38BDF8";
}

export function GalleryPicture({
  photo,
  priority = false,
  sizes,
  fit = "cover",
  zoom = false,
}: {
  photo: GalleryItem;
  priority?: boolean;
  sizes: string;
  fit?: "cover" | "contain";
  zoom?: boolean;
}) {
  const color = pictureColor(photo.characters);

  return (
    <span
      className={`absolute inset-0 block ${zoom ? "gallery-zoom" : ""}`}
      style={{ backgroundColor: color }}
    >
      <EditableImage slotKey={photo.src} alt={photo.alt} fit={fit}>
        {photo.hasFile ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority={priority}
            sizes={sizes}
            className={fit === "contain" ? "object-contain" : "object-cover"}
          />
        ) : (
          <>
            <span className="sr-only">{photo.alt}</span>
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex size-28 items-center justify-center rounded-full bg-white font-heading text-6xl text-navy ring-8 ring-white sm:size-40 sm:text-7xl">
                {photo.characters[0]?.slice(0, 1) ?? "★"}
              </span>
            </span>
          </>
        )}
      </EditableImage>
    </span>
  );
}
