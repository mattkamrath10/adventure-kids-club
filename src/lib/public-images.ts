import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const imageExtension = /\.(png|jpe?g|webp|gif|avif)$/i;

export function publicFileExists(urlPath: string) {
  const parts = urlPath.replace(/^\//, "").split("/");
  return existsSync(path.join(process.cwd(), "public", ...parts));
}

export function galleryImagePaths() {
  const dir = path.join(process.cwd(), "public", "images", "gallery");
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((file) => imageExtension.test(file))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => `/images/gallery/${file}`);
}
