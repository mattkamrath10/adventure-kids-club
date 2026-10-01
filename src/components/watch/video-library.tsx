"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { YouTubeIcon } from "@/components/social-icons";
import { LiteYouTube, VideoPoster } from "@/components/watch/lite-youtube";
import {
  isPlaceholderVideo,
  youtubeWatchUrl,
  type Video,
} from "@/data/videos";

type Filter = "all" | "shorts" | "episodes";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "shorts", label: "Shorts" },
  { id: "episodes", label: "Episodes" },
];

function playLabel(video: Video) {
  const kind = video.isShort ? ", short" : video.episode ? `, episode ${video.episode}` : "";
  return `Play ${video.title}${kind}`;
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const inertTargets = [...document.body.children].filter((node) => node !== dialog);
    for (const node of inertTargets) node.setAttribute("inert", "");

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], iframe"),
      ].filter((node) => node.tabIndex !== -1);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      html.style.overflow = previousOverflow;
      for (const node of inertTargets) node.removeAttribute("inert");
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[90] flex items-end justify-center px-3 pb-3 pt-16 sm:items-center sm:p-8"
    >
      <div
        className={`relative z-10 flex max-h-[calc(100svh-5.5rem)] w-full flex-col overflow-y-auto rounded-[2rem] border-4 border-white bg-navy sm:max-h-[92svh] ${
          video.isShort ? "max-w-md" : "max-w-5xl"
        }`}
      >
        <div className="flex justify-end p-3">
          <button
            ref={closeRef}
            type="button"
            className="inline-flex min-h-14 items-center gap-2 rounded-full bg-white px-5 font-heading text-xl text-navy"
            onClick={onClose}
          >
            <X aria-hidden="true" size={28} strokeWidth={2.75} />
            Close
          </button>
        </div>
        <LiteYouTube video={video} active />
        <h2 id={titleId} className="px-6 pt-5 text-center text-3xl text-gold sm:text-4xl">
          {video.title}
        </h2>
        <p className="px-6 pb-6 pt-3 text-center text-lg text-white">{video.description}</p>
      </div>
      <button
        type="button"
        tabIndex={-1}
        aria-label={`Close ${video.title}`}
        className="absolute inset-0 z-0 bg-navy/80"
        onClick={onClose}
      />
    </div>
  );
}

export function VideoLibrary({ videos }: { videos: Video[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const active = videos.find((video) => video.id === activeId) ?? null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const shown = videos.filter((video) => {
    if (filter === "shorts") return Boolean(video.isShort);
    if (filter === "episodes") return !video.isShort;
    return true;
  });

  if (videos.length === 0) {
    return (
      <p className="mt-14 text-center font-heading text-3xl text-white sm:text-4xl">
        A new episode is on the way.
      </p>
    );
  }

  return (
    <section className="mt-14" aria-labelledby="watch-here">
      <h2 id="watch-here" className="text-center text-4xl text-white sm:text-5xl">
        Watch it here
      </h2>
      <div className="mt-6 flex flex-wrap justify-center gap-3" role="group" aria-label="Filter videos">
        {filters.map((item) => {
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(item.id)}
              className={`inline-flex min-h-12 items-center rounded-full px-6 font-heading text-xl focus-visible:outline-white ${
                selected ? "bg-gold text-navy" : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {shown.length === 0 ? (
        <p className="mt-10 text-center text-xl text-white">Nothing in this pile yet.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((video) => (
            <li key={video.id} className="play-float">
              <article className="flex h-full flex-col">
                <button
                  type="button"
                  className="flex w-full flex-col overflow-hidden rounded-[2rem] border-4 border-white bg-navy text-left focus-visible:outline-white"
                  aria-label={playLabel(video)}
                  onClick={() => setActiveId(video.id)}
                >
                  <VideoPoster video={video} />
                  <span className="px-4 py-4 font-heading text-2xl text-white sm:text-3xl">
                    {video.title}
                  </span>
                </button>
                <p className="mt-3 text-lg text-white">{video.description}</p>
                {isPlaceholderVideo(video) ? (
                  <p className="mt-3 font-heading text-lg text-gold">
                    Paste a YouTube id to link this out.
                  </p>
                ) : (
                  <a
                    href={youtubeWatchUrl(video)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-5 font-heading text-lg text-navy"
                  >
                    <YouTubeIcon className="size-6 text-[#FF0000]" />
                    Watch on YouTube
                  </a>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
      {mounted && active
        ? createPortal(
            <VideoModal video={active} onClose={() => setActiveId(null)} />,
            document.body,
          )
        : null}
    </section>
  );
}
