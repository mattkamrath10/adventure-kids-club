import { PlatformRow } from "@/components/watch/platform-row";
import { VideoLibrary } from "@/components/watch/video-library";
import { site } from "@/data/site";
import { visibleVideos } from "@/data/videos";
import { starterMetadata } from "@/lib/metadata";

export const metadata = starterMetadata("Watch", "/watch");

export default function WatchPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="text-center text-5xl text-sky sm:text-7xl">Pick how you want to watch!</h1>
      <p className="mt-3 text-center font-heading text-xl font-bold text-white sm:text-2xl">
        Find us <span className="text-gold">{site.handle}</span>
      </p>
      <PlatformRow />
      <VideoLibrary videos={visibleVideos()} />
    </div>
  );
}
