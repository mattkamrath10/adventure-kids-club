import type { Metadata } from "next";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { JoinBand } from "@/components/home/join-band";
import { LatestEpisode } from "@/components/home/latest-episode";
import { MeetTheCrew } from "@/components/home/meet-the-crew";
import { WhereToWatch } from "@/components/home/where-to-watch";
import { slides } from "@/data/slides";
import { galleryImagePaths, publicFileExists } from "@/lib/public-images";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function heroSlides() {
  const gallery = galleryImagePaths();

  return slides.map((slide, index) => {
    if (slide.image && publicFileExists(slide.image)) return slide;
    const fromGallery = gallery[index];
    return { ...slide, image: fromGallery };
  });
}

export default function Home() {
  return (
    <>
      <HeroSlideshow slides={heroSlides()} />
      <WhereToWatch />
      <MeetTheCrew />
      <LatestEpisode />
      <JoinBand />
    </>
  );
}
