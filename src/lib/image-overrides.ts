import "server-only";

import { unstable_cache } from "next/cache";
import { list } from "@vercel/blob";
import { slotKeyFromPathname } from "@/lib/image-slots";

async function loadImageOverrides(): Promise<Record<string, string>> {
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) return {};

  try {
    const newest = new Map<string, { url: string; uploadedAt: number }>();
    let cursor: string | undefined;

    do {
      const page = await list({ prefix: "slots/", cursor, limit: 1000 });
      for (const blob of page.blobs) {
        const slotKey = slotKeyFromPathname(blob.pathname);
        if (!slotKey) continue;
        const uploadedAt = new Date(blob.uploadedAt).getTime();
        const current = newest.get(slotKey);
        if (!current || uploadedAt >= current.uploadedAt) {
          newest.set(slotKey, { url: blob.url, uploadedAt });
        }
      }
      if (!page.hasMore || !page.cursor) break;
      cursor = page.cursor;
    } while (cursor);

    return Object.fromEntries([...newest].map(([key, value]) => [key, value.url]));
  } catch {
    return {};
  }
}

/**
 * Newest public upload for each slot. Cached until the owner upload route
 * revalidates it, so public pages are not listing Blob on every visit.
 * The SDK signs in with OIDC (BLOB_STORE_ID) or BLOB_READ_WRITE_TOKEN.
 */
export const getImageOverrides = unstable_cache(loadImageOverrides, ["akc-image-overrides"], {
  revalidate: false,
  tags: ["akc-image-overrides"],
});
