const FEED_URL =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCGsFLCNT40JQjhPJgs3QAag";

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

/** Newest video on the Adventure8 Kids Club YouTube channel, or null if the feed fails. */
export async function getLatestVideo(): Promise<{ id: string; title: string } | null> {
  try {
    const response = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!response.ok) return null;

    const xml = await response.text();
    const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1];
    if (!entry) return null;

    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]?.trim();
    const title = decodeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
    if (!id || !title) return null;

    return { id, title };
  } catch {
    return null;
  }
}
