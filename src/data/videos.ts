export type Video = {
  id: string;
  title: string;
  description: string;
  /** YouTube video id only, not a full URL. */
  youtubeId: string;
  /** Full episode number. Leave this off for a Short. */
  episode?: number;
  /**
   * Poster image. When omitted, the player uses
   * https://i.ytimg.com/vi/{youtubeId}/hqdefault.jpg
   */
  thumbnail?: string;
  /** Vertical YouTube Shorts use a tall 9:16 frame. */
  isShort?: boolean;
};

export const placeholderYoutubeId = "REPLACE_ME";

/**
 * How to copy a YouTube id into youtubeId:
 * - Shorts link:  https://www.youtube.com/shorts/VIDEO_ID  → the part after /shorts/
 * - Watch link:   https://www.youtube.com/watch?v=VIDEO_ID → the part after v=
 * - Share link:   https://youtu.be/VIDEO_ID                → the part after the slash
 * Paste only that id. While it still says "REPLACE_ME", the card is a sample
 * in dev and is hidden on the live site.
 *
 * The first video is the Latest Episode on the home page.
 */
export const videos: Video[] = [
  {
    id: "blast-off",
    title: "Blast Off!",
    description:
      "Blaze leads the club to the launch pad, and the Tweedles hitch a ride.",
    youtubeId: "REPLACE_ME",
    episode: 1,
  },
  {
    id: "zero-gravity-flip",
    title: "Luna's Zero Gravity Flip",
    description: "Luna spins a triple flip while CJ chirps the countdown.",
    youtubeId: "REPLACE_ME",
    isShort: true,
  },
  {
    id: "rings-around-saturn",
    title: "Rings Around Saturn",
    description:
      "Pip spots something sparkly in Saturn's rings, and the crew goes to look.",
    youtubeId: "REPLACE_ME",
    episode: 2,
  },
];

export function isPlaceholderVideo(video: Video) {
  return video.youtubeId === placeholderYoutubeId;
}

/** Live site hides samples that still say REPLACE_ME. Dev shows them. */
export function visibleVideos() {
  if (process.env.NODE_ENV === "production") {
    return videos.filter((video) => !isPlaceholderVideo(video));
  }
  return videos;
}

export function thumbnailUrl(video: Video) {
  return (
    video.thumbnail ??
    `https://i.ytimg.com/vi/${encodeURIComponent(video.youtubeId)}/hqdefault.jpg`
  );
}

export function youtubeWatchUrl(video: Video) {
  const id = encodeURIComponent(video.youtubeId);
  return video.isShort
    ? `https://www.youtube.com/shorts/${id}`
    : `https://www.youtube.com/watch?v=${id}`;
}
