import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

async function logoDataUrl() {
  try {
    const file = await readFile(path.join(process.cwd(), "public", "images", "logo.png"));
    return `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Favicon and home-screen icons. Uses public/images/logo.png when that file is there. */
export async function brandIcon(size: number) {
  const logo = await logoDataUrl();

  if (logo) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex" }}>
          <img src={logo} alt="" width={size} height={size} />
        </div>
      ),
      { width: size, height: size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFC93C",
        }}
      >
        <div
          style={{
            width: "86%",
            height: "86%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "#38BDF8",
            color: "#1B1464",
            fontSize: Math.round(size * 0.5),
            fontWeight: 700,
          }}
        >
          C
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
