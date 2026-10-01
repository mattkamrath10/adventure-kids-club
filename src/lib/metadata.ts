import type { Metadata } from "next";
import { site } from "@/data/site";

const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: site.name,
} as const;

export function starterMetadata(title: string, path: string): Metadata {
  return {
    title,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.brand,
      title: site.name,
      description: site.tagline,
      images: [shareImage],
    },
  };
}
