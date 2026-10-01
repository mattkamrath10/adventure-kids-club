import { PlatformRow } from "@/components/watch/platform-row";
import { VideoLibrary } from "@/components/watch/video-library";
import { visibleVideos } from "@/data/videos";
import { starterMetadata } from "@/lib/metadata";

export const metadata = starterMetadata("Watch", "/watch");

export default function WatchPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="text-center text-5xl text-sky sm:text-7xl">Pick how you want to watch!</h1>
      <PlatformRow />
      <VideoLibrary videos={visibleVideos()} />
    </div>
  );
}
