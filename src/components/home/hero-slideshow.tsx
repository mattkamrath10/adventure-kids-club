"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Slide } from "@/data/slides";

export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const autoplay = useRef(
    Autoplay({
      delay: 5000,
      playOnInit: false,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
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
      if (media.matches) plugin.stop();
    };

    const sync = () => {
      if (media.matches) plugin.stop();
      else plugin.play();
    };

    sync();
    emblaApi.on("autoplay:play", stopIfNeeded);
    media.addEventListener("change", sync);

    return () => {
      emblaApi.off("autoplay:play", stopIfNeeded);
      media.removeEventListener("change", sync);
    };
  }, [emblaApi]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured adventures"
      className="relative h-[80svh] w-full"
    >
      <h1 className="sr-only">Tweedles and the Adventure Kids Club</h1>
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.href + slide.headline}
              className="relative h-full min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              inert={index !== selected}
            >
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              ) : (
                <div className={`absolute inset-0 ${slide.gradient}`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-transparent" />
              <div className="relative flex h-full flex-col justify-end px-5 pb-28 sm:px-16 sm:pb-32">
                <h2 className="hero-text-shadow max-w-4xl text-4xl text-white sm:text-6xl lg:text-7xl">
                  {slide.headline}
                </h2>
                <p className="hero-text-shadow mt-3 max-w-xl text-lg text-white sm:text-2xl">
                  {slide.line}
                </p>
                <Link
                  href={slide.href}
                  className="mt-6 inline-flex min-h-14 w-fit items-center rounded-full bg-white px-8 font-heading text-xl font-bold text-navy hover:bg-gold"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-between gap-1 px-2 sm:bottom-5 sm:px-5">
        <button
          type="button"
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-navy shadow-lg sm:size-16"
          aria-label="Previous slide"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft aria-hidden="true" size={36} strokeWidth={3} />
        </button>
        <div className="flex items-center justify-center">
          {slides.map((slide, index) => (
            <button
              key={slide.headline}
              type="button"
              className="inline-flex size-12 items-center justify-center"
              aria-label={`Show slide ${index + 1}: ${slide.headline}`}
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
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-navy shadow-lg sm:size-16"
          aria-label="Next slide"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight aria-hidden="true" size={36} strokeWidth={3} />
        </button>
      </div>
    </section>
  );
}
