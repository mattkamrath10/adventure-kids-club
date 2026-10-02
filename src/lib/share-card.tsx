import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { characters } from "@/data/characters";
import { characterPhoto } from "@/lib/public-images";

export const shareSize = { width: 1200, height: 630 };
export const shareAlt = "Adventure8 Kids Club | Tweedles and the Adventure Kids Club";

const stars: { x: number; y: number; s: number; c: string }[] = [
  { x: 48, y: 42, s: 8, c: "#FFFFFF" },
  { x: 140, y: 88, s: 5, c: "#FFC93C" },
  { x: 230, y: 36, s: 6, c: "#38BDF8" },
  { x: 310, y: 110, s: 4, c: "#FFFFFF" },
  { x: 420, y: 48, s: 10, c: "#FFC93C" },
  { x: 540, y: 28, s: 5, c: "#FFFFFF" },
  { x: 680, y: 70, s: 7, c: "#FF3EA5" },
  { x: 790, y: 34, s: 4, c: "#FFFFFF" },
  { x: 900, y: 96, s: 8, c: "#A3E635" },
  { x: 1020, y: 46, s: 6, c: "#FFFFFF" },
  { x: 1120, y: 88, s: 10, c: "#FFC93C" },
  { x: 70, y: 180, s: 5, c: "#FFFFFF" },
  { x: 1140, y: 170, s: 5, c: "#38BDF8" },
  { x: 36, y: 300, s: 7, c: "#FFC93C" },
  { x: 1128, y: 280, s: 8, c: "#FFFFFF" },
  { x: 90, y: 430, s: 4, c: "#FFFFFF" },
  { x: 1088, y: 420, s: 6, c: "#FF3EA5" },
  { x: 60, y: 540, s: 9, c: "#FFFFFF" },
  { x: 180, y: 575, s: 5, c: "#38BDF8" },
  { x: 320, y: 548, s: 7, c: "#FFC93C" },
  { x: 470, y: 585, s: 4, c: "#FFFFFF" },
  { x: 620, y: 552, s: 8, c: "#A3E635" },
  { x: 760, y: 590, s: 5, c: "#FFFFFF" },
  { x: 900, y: 545, s: 6, c: "#FFC93C" },
  { x: 1040, y: 578, s: 4, c: "#FFFFFF" },
  { x: 1136, y: 530, s: 9, c: "#38BDF8" },
  { x: 200, y: 200, s: 4, c: "#FFFFFF" },
  { x: 980, y: 210, s: 5, c: "#FFFFFF" },
  { x: 160, y: 360, s: 6, c: "#FFC93C" },
  { x: 1000, y: 350, s: 4, c: "#A3E635" },
];

async function characterPhotos() {
  const photos: { src: string; color: string; name: string }[] = [];

  for (const character of characters) {
    const photo = characterPhoto(character.id, character.name);
    if (!photo) continue;

    try {
      const file = await readFile(
        path.join(process.cwd(), "public", decodeURIComponent(photo.replace(/^\//, ""))),
      );
      const kind = photo.toLowerCase().endsWith(".png")
        ? "png"
        : photo.toLowerCase().endsWith(".webp")
          ? "webp"
          : "jpeg";
      photos.push({
        name: character.name,
        color: character.color,
        src: `data:image/${kind};base64,${file.toString("base64")}`,
      });
    } catch {
      // Portrait is not in public/images/characters yet.
    }
  }

  return photos;
}

export async function shareCard() {
  const photos = await characterPhotos();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1B1464",
          position: "relative",
        }}
      >
        {stars.map((star) => (
          <div
            key={`${star.x}-${star.y}`}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.s,
              height: star.s,
              borderRadius: star.s,
              backgroundColor: star.c,
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: photos.length > 0 ? "36px 48px 8px" : "48px 56px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div style={{ fontSize: 78, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>Adventure</div>
            <div style={{ fontSize: 140, fontWeight: 700, color: "#FFC93C", lineHeight: 0.78 }}>8</div>
            <div style={{ marginLeft: 18, fontSize: 78, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>
              Kids Club
            </div>
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 36,
              fontWeight: 700,
              color: "#38BDF8",
              lineHeight: 1.15,
            }}
          >
            Tweedles and the Adventure Kids Club
          </div>
        </div>
        {photos.length > 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 18,
              padding: "8px 40px 36px",
            }}
          >
            {photos.map((photo) => (
              <div
                key={photo.name}
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 56,
                  overflow: "hidden",
                  display: "flex",
                  border: `6px solid ${photo.color}`,
                  backgroundColor: photo.color,
                }}
              >
                <img src={photo.src} alt="" width={112} height={112} style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    ),
    { ...shareSize },
  );
}
