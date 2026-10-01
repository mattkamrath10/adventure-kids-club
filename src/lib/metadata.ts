import type { Metadata } from "next";

export function starterMetadata(title: string, path: string): Metadata {
  return {
    title,
    alternates: { canonical: path },
  };
}
