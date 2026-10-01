import { site } from "@/data/site";
import { brandIcon } from "@/lib/brand-icon";

export const dynamic = "force-static";

const sizes = [
  { id: "32", width: 32, height: 32 },
  { id: "192", width: 192, height: 192 },
  { id: "512", width: 512, height: 512 },
] as const;

export function generateImageMetadata() {
  return sizes.map((icon) => ({
    id: icon.id,
    size: { width: icon.width, height: icon.height },
    contentType: "image/png",
    alt: site.name,
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const iconId = await id;
  const match = sizes.find((icon) => icon.id === iconId) ?? sizes[0];
  return brandIcon(match.width);
}
