import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export const dynamic = "force-static";

const paths = ["/", "/characters", "/watch", "/gallery", "/join", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: path === "/" ? site.url : `${site.url}${path}`,
    lastModified: "2026-10-01",
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
