"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import {
  isPlaceholderVideo,
  thumbnailUrl,
  type Video,
} from "@/data/videos";

function frameClass(video: Video, fitted: boolean) {
  if (!video.isShort) return "aspect-video w-full";
  if (!fitted) return "aspect-[9/16] w-full";
  return "mx-auto aspect-[9/16] w-full max-w-[calc(70svh*9/16)]";
}

function PosterArt({ video }: { video: Video }) {
  const [failed, setFailed] = useState(false);

  if (isPlaceholderVideo(video) || failed) {
    return (
      <span className="absolute inset-0 bg-[linear-gradient(160deg,#38bdf8_0%,#1b1464_55%,#ff3ea5_100%)]" />
    );
  }

  return (
    <Image
      src={thumbnailUrl(video)}
      alt=""
      fill
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-navy/25">
      <span className="flex size-24 items-center justify-center rounded-full bg-white text-navy ring-4 ring-white">
        <Play aria-hidden="true" size={48} fill="currentColor" strokeWidth={2} className="ml-1" />
      </span>
    </span>
  );
}

export function VideoBadges({ video }: { video: Video }) {
  return (
    <span className="absolute left-3 top-3 flex flex-col items-start gap-2">
      {isPlaceholderVideo(video) ? (
        <span className="rounded-full bg-gold px-3 py-1 font-heading text-lg text-navy">Sample</span>
      ) : null}
      {video.episode ? (
        <span className="rounded-full bg-navy px-3 py-1 font-heading text-lg text-white">
          Episode {video.episode}
        </span>
      ) : null}
      {video.isShort ? (
        <span className="rounded-full bg-pink px-3 py-1 font-heading text-lg text-navy">Short</span>
      ) : null}
    </span>
  );
}

/** Thumbnail and play icon. The parent supplies the button. */
export function VideoPoster({ video }: { video: Video }) {
  return (
    <span className={`relative block overflow-hidden bg-navy ${frameClass(video, false)}`}>
      <PosterArt video={video} />
      <PlayBadge />
      <VideoBadges video={video} />
    </span>
  );
}

/**
 * Shows a poster until someone presses play, then loads youtube-nocookie.com.
 * Pass active when the click already happened (the watch-page modal).
 */
export function LiteYouTube({
  video,
  active = false,
  className = "",
}: {
  video: Video;
  active?: boolean;
  className?: string;
}) {
  const [started, setStarted] = useState(active);
  const placeholder = isPlaceholderVideo(video);
  const frame = `relative overflow-hidden bg-navy ${frameClass(video, true)} ${className}`;

  if (started && !placeholder) {
    return (
      <div className={`block ${frame}`}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  if (started && placeholder) {
    return (
      <div className={`${frame} flex items-center justify-center px-6 text-center`}>
        <p className="font-heading text-2xl text-white sm:text-3xl">
          Sample video. Paste a YouTube id to play it.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`block w-full ${frame} focus-visible:outline-white`}
      onClick={() => setStarted(true)}
      aria-label={`Play ${video.title}`}
    >
      <PosterArt video={video} />
      <PlayBadge />
      <VideoBadges video={video} />
    </button>
  );
}
