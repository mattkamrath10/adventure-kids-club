import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { gallery, type GalleryPhoto } from "@/data/gallery";

const imageExtension = /\.(png|jpe?g|webp|gif|avif)$/i;

export function publicFileExists(urlPath: string) {
  const parts = urlPath.replace(/^\//, "").split("/");
  return existsSync(path.join(process.cwd(), "public", ...parts));
}

/** Any picture in public/images/characters whose name includes the character, like "Blaze face 1.jpg". */
export function characterPhoto(id: string, name: string) {
  const dir = path.join(process.cwd(), "public", "images", "characters");
  if (!existsSync(dir)) return null;

  const idKey = id.toLowerCase();
  const nameKey = name.toLowerCase();
  const matches = readdirSync(dir)
    .filter((file) => imageExtension.test(file))
    .map((file) => {
      const stem = file.replace(/\.[^.]+$/, "").toLowerCase();
      const tokens = stem.split(/[^a-z0-9]+/);
      let score = 0;
      if (stem === idKey || stem === nameKey) score = 3;
      else if (tokens.includes(idKey) || tokens.includes(nameKey)) score = 2;
      else if (stem.includes(idKey) || stem.includes(nameKey)) score = 1;
      return { file, score };
    })
    .filter((file) => file.score > 0)
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));

  const best = matches[0];
  if (!best) return null;
  return `/images/characters/${encodeURIComponent(best.file)}`;
}

export function galleryImagePaths() {
  const dir = path.join(process.cwd(), "public", "images", "gallery");
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((file) => imageExtension.test(file))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => `/images/gallery/${file}`);
}

const characterNames = ["Max", "Blaze", "Pip", "Luna", "CJ", "Fizz", "Prism", "Ember"];

function captionFromFilename(src: string) {
  const stem = src.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "Picture";
  return stem
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => {
      const known = characterNames.find((name) => name.toLowerCase() === word.toLowerCase());
      if (known) return known;
      if (word.toLowerCase() === "and") return "and";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function charactersInFilename(src: string) {
  const tokens = new Set(
    (src.split("/").pop() ?? "")
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .split(/[^a-z0-9]+/),
  );
  return characterNames.filter((name) => tokens.has(name.toLowerCase()));
}

/** Pictures in public/images/gallery/, with captions from gallery.ts when a line matches. */
export function galleryPhotos(): (GalleryPhoto & { hasFile: boolean })[] {
  const listed = new Map(gallery.map((photo) => [photo.src, photo]));
  const onDisk = new Set(galleryImagePaths());

  const fromFolder = [...onDisk].map((src) => {
    const known = listed.get(src);
    if (known) return { ...known, hasFile: true };
    const caption = captionFromFilename(src);
    return {
      src,
      alt: caption,
      caption,
      characters: charactersInFilename(src),
      hasFile: true,
    };
  });

  const waiting = gallery
    .filter((photo) => !onDisk.has(photo.src))
    .map((photo) => ({ ...photo, hasFile: false }));

  return [...fromFolder, ...waiting];
}
