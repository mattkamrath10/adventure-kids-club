import { GalleryExperience } from "@/components/gallery/gallery-experience";
import { gallery } from "@/data/gallery";
import { starterMetadata } from "@/lib/metadata";
import { publicFileExists } from "@/lib/public-images";

export const metadata = starterMetadata("Gallery", "/gallery");

export default function GalleryPage() {
  const photos = gallery.map((photo) => ({
    ...photo,
    hasFile: publicFileExists(photo.src),
  }));

  return (
    <div className="pb-4">
      <h1 className="px-4 pt-10 text-center text-5xl text-lime sm:pt-14 sm:text-7xl">Picture time!</h1>
      <GalleryExperience photos={photos} />
    </div>
  );
}
