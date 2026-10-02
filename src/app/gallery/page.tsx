import { GalleryExperience } from "@/components/gallery/gallery-experience";
import { starterMetadata } from "@/lib/metadata";
import { galleryPhotos } from "@/lib/public-images";

export const metadata = starterMetadata("Gallery", "/gallery");

export default function GalleryPage() {
  const photos = galleryPhotos();

  return (
    <div className="pb-4">
      <h1 className="px-4 pt-10 text-center text-5xl text-lime sm:pt-14 sm:text-7xl">Picture time!</h1>
      <GalleryExperience photos={photos} />
    </div>
  );
}
