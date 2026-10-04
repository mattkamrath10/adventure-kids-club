import Link from "next/link";
import { Play } from "lucide-react";

export function LatestEpisode({ video }: { video: { id: string; title: string } | null }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16" aria-labelledby="latest-episode">
      <h2 id="latest-episode" className="text-center text-4xl text-white sm:text-5xl">
        Latest episode
      </h2>
      <div className="play-float mx-auto mt-8 max-w-3xl">
        {video ? (
          <div className="mx-auto w-full max-w-[360px]">
            <div className="aspect-[9/16] overflow-hidden rounded-[2rem] border-8 border-sky bg-navy">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}`}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <h3 className="mt-4 text-center text-2xl text-gold sm:text-3xl">{video.title}</h3>
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center rounded-[2rem] border-8 border-sky bg-navy px-6 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-sky text-navy">
              <Play aria-hidden="true" size={40} strokeWidth={2.5} className="ml-1" />
            </span>
            <p className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
              A new episode is on the way.
            </p>
          </div>
        )}
        <div className="mt-6 text-center">
          <Link
            href="/watch"
            className="inline-flex min-h-14 items-center rounded-full bg-sky px-8 font-heading text-xl font-bold text-navy hover:bg-gold"
          >
            See all videos
          </Link>
        </div>
      </div>
    </section>
  );
}
