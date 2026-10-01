"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GalleryPicture, type GalleryItem } from "@/components/gallery/gallery-picture";

export function GalleryLightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: GalleryItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const [selected, setSelected] = useState(startIndex);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: photos.length > 1,
    startIndex,
  });
  const emblaApiRef = useRef(emblaApi);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    emblaApiRef.current = emblaApi;
  });

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

      if (event.key === "ArrowRight") {
        event.preventDefault();
        emblaApiRef.current?.scrollNext();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        emblaApiRef.current?.scrollPrev();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>("button:not([disabled])"),
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

  const current = photos[selected] ?? photos[0];

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[90] flex flex-col bg-navy"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="font-heading text-2xl text-gold" aria-live="polite">
          {selected + 1} of {photos.length}
        </p>
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

      <div className="relative min-h-0 flex-1">
        {photos.length > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-20 inline-flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lg sm:left-5 sm:size-16"
              aria-label="Previous picture"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft aria-hidden="true" size={36} strokeWidth={3} />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-20 inline-flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lg sm:right-5 sm:size-16"
              aria-label="Next picture"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight aria-hidden="true" size={36} strokeWidth={3} />
            </button>
          </>
        ) : null}
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {photos.map((photo) => (
              <div
                key={photo.src}
                className="relative h-full min-w-0 shrink-0 grow-0 basis-full"
              >
                <GalleryPicture photo={photo} sizes="100vw" fit="contain" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p id={titleId} className="px-6 py-5 text-center font-heading text-2xl text-white sm:text-4xl">
        {current.caption}
      </p>
    </div>,
    document.body,
  );
}
