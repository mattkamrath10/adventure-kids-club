import { createElement } from "react";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og.js";

async function icon(size) {
  const logoPath = path.join(process.cwd(), "public", "images", "logo.png");

  if (existsSync(logoPath)) {
    const file = await readFile(logoPath);
    const src = `data:image/png;base64,${file.toString("base64")}`;
    return new ImageResponse(
      createElement(
        "div",
        {
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
          },
        },
        createElement("img", { src, width: size, height: size, alt: "" }),
      ),
      { width: size, height: size },
    );
  }

  const radius = Math.round(size * 0.22);
  return new ImageResponse(
    createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B1464",
          borderRadius: radius,
          color: "#FFC93C",
          fontSize: Math.round(size * 0.62),
          fontWeight: 700,
        },
      },
      "8",
    ),
    { width: size, height: size },
  );
}

const icons = [
  ["src/app/icon.png", 512],
  ["src/app/apple-icon.png", 180],
];

for (const [file, size] of icons) {
  const response = await icon(size);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(process.cwd(), file), bytes);
}
