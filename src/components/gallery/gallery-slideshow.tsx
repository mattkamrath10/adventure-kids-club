"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryPicture, type GalleryItem } from "@/components/gallery/gallery-picture";

export function GallerySlideshow({
  photos,
  paused,
  onOpen,
}: {
  photos: GalleryItem[];
  paused: boolean;
  onOpen: (index: number) => void;
}) {
  const autoplay = useRef(
    Autoplay({
      delay: 5000,
      playOnInit: false,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: photos.length > 1 }, [
    autoplay.current,
  ]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const plugin = emblaApi.plugins()?.autoplay;
    if (!plugin) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stopIfNeeded = () => {
      if (media.matches || paused) plugin.stop();
    };

    const sync = () => {
      if (media.matches || paused) plugin.stop();
      else plugin.play();
    };

    sync();
    emblaApi.on("autoplay:play", stopIfNeeded);
    media.addEventListener("change", sync);

    return () => {
      emblaApi.off("autoplay:play", stopIfNeeded);
      media.removeEventListener("change", sync);
    };
  }, [emblaApi, paused]);

  if (photos.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Gallery pictures"
      className="relative mt-6 h-[75svh] min-h-[24rem] w-full"
    >
      <div className="relative z-0 h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {photos.map((photo, index) => (
            <div
              key={photo.src}
              className="relative h-full min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${photos.length}`}
              inert={index !== selected}
            >
              <GalleryPicture
                photo={photo}
                priority={index === 0}
                sizes="100vw"
              />
              <span className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_top,#1b1464_0%,rgb(27_20_100/0.88)_22%,transparent_52%)]" />
              <button
                type="button"
                className="absolute inset-0 z-20 flex flex-col justify-end px-5 pb-36 text-left sm:px-16 sm:pb-32"
                onPointerDown={(event) => {
                  event.currentTarget.dataset.x = String(event.clientX);
                  event.currentTarget.dataset.y = String(event.clientY);
                }}
                onClick={(event) => {
                  const dx = Math.abs(event.clientX - Number(event.currentTarget.dataset.x ?? event.clientX));
                  const dy = Math.abs(event.clientY - Number(event.currentTarget.dataset.y ?? event.clientY));
                  if (dx < 10 && dy < 10) onOpen(index);
                }}
              >
                <span className="hero-text-shadow max-w-4xl font-heading text-4xl font-bold text-white sm:text-6xl">
                  {photo.caption}
                </span>
                <span className="mt-5 inline-flex min-h-14 w-fit items-center rounded-full bg-white px-8 font-heading text-xl font-bold text-navy">
                  See it big
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {photos.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 sm:bottom-5">
          <div className="flex items-end justify-between gap-2 px-2 sm:px-5">
            <button
              type="button"
              className="pointer-events-auto inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-navy shadow-lg sm:size-16"
              aria-label="Previous picture"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft aria-hidden="true" size={36} strokeWidth={3} />
            </button>
            <div className="pointer-events-auto flex min-w-0 flex-1 flex-wrap items-center justify-center">
              {photos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  className="inline-flex size-12 items-center justify-center"
                  aria-label={`Show picture ${index + 1}: ${photo.caption}`}
                  aria-current={index === selected ? "true" : undefined}
                  onClick={() => emblaApi?.scrollTo(index)}
                >
                  <span
                    className={`block rounded-full ${
                      index === selected ? "h-4 w-8 bg-gold" : "size-4 bg-white"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="pointer-events-auto inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-navy shadow-lg sm:size-16"
              aria-label="Next picture"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight aria-hidden="true" size={36} strokeWidth={3} />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
