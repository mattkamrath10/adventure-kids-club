import { shareAlt, shareCard, shareSize } from "@/lib/share-card";

export const dynamic = "force-static";
export const alt = shareAlt;
export const size = shareSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return shareCard();
}
