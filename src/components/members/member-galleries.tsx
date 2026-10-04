"use client";

import { useContext, type ReactNode } from "react";
import { EditableImage, ImageOverrideContext } from "@/components/owner/image-overrides";
import { behindTheScenes } from "@/data/behindTheScenes";

const coloringSlots = Array.from({ length: 12 }, (_, index) => `coloring/${index + 1}`);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fileName(url: string, fallback: string) {
  try {
    const base = new URL(url).pathname.split("/").pop() ?? "";
    if (/\.[a-z0-9]{2,5}$/i.test(base)) return base;
  } catch {
    // The address is not a full URL, so use the fallback name.
  }
  return `${fallback}.png`;
}

function printPicture(url: string, title: string) {
  const page = window.open("", "_blank");
  if (!page) return;
  const safeUrl = escapeHtml(url);
  const safeTitle = escapeHtml(title);
  page.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${safeTitle}</title>
<style>
  @page { size: letter portrait; margin: 0.4in; }
  html, body { margin: 0; background: white; }
  img { display: block; width: 7.7in; height: 10.2in; object-fit: contain; }
</style>
</head>
<body>
  <img src="${safeUrl}" alt="${safeTitle}" />
  <script>
    const picture = document.querySelector("img");
    function printPage() { window.print(); }
    if (picture.complete) printPage();
    else picture.addEventListener("load", printPage);
  </script>
</body>
</html>`);
  page.document.close();
}

async function downloadPicture(url: string, fallback: string) {
  const name = fileName(url, fallback);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("download");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = name;
    link.click();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }
}

function PictureFrame({
  slotKey,
  alt,
  children,
}: {
  slotKey: string;
  alt: string;
  children: ReactNode;
}) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white">
      <EditableImage slotKey={slotKey} alt={alt} fit="contain">
        {children}
      </EditableImage>
    </div>
  );
}

function EmptyPicture() {
  return (
    <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-heading text-2xl text-navy/40">
      Add a picture
    </span>
  );
}

function ComingSoon() {
  return <p className="mt-6 text-center font-heading text-3xl text-white">New pages coming soon!</p>;
}

export function MemberGalleries() {
  const images = useContext(ImageOverrideContext);
  const owner = images?.owner ?? false;
  const overrides = images?.overrides ?? {};

  const coloring = coloringSlots
    .map((slotKey, index) => ({
      slotKey,
      number: index + 1,
      url: overrides[slotKey],
    }))
    .filter((slot) => owner || slot.url);

  const scenes = behindTheScenes
    .map((caption, index) => {
      const slotKey = `bts/${index + 1}`;
      return { slotKey, caption, url: overrides[slotKey] };
    })
    .filter((slot) => owner || slot.url);

  return (
    <>
      <section className="mt-12" aria-labelledby="coloring-pages">
        <h2 id="coloring-pages" className="text-center text-4xl text-white sm:text-5xl">
          Printable Coloring Pages
        </h2>
        {coloring.length === 0 ? (
          <ComingSoon />
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coloring.map((slot) => {
              const alt = `Coloring page ${slot.number}`;
              return (
                <li key={slot.slotKey} className="rounded-[2rem] bg-white p-4 text-navy">
                  <PictureFrame slotKey={slot.slotKey} alt={alt}>
                    <EmptyPicture />
                  </PictureFrame>
                  {slot.url ? (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => printPicture(slot.url, alt)}
                        className="inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-4 font-heading text-lg text-white hover:bg-gold hover:text-navy"
                      >
                        Print
                      </button>
                      <button
                        type="button"
                        onClick={() => void downloadPicture(slot.url, `coloring-${slot.number}`)}
                        className="inline-flex min-h-12 items-center justify-center rounded-full bg-sky px-4 font-heading text-lg text-navy hover:bg-gold"
                      >
                        Download
                      </button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-16" aria-labelledby="behind-the-scenes">
        <h2 id="behind-the-scenes" className="text-center text-4xl text-white sm:text-5xl">
          Behind the Scenes
        </h2>
        {scenes.length === 0 ? (
          <ComingSoon />
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scenes.map((slot) => (
              <li key={slot.slotKey}>
                <PictureFrame slotKey={slot.slotKey} alt={slot.caption}>
                  <EmptyPicture />
                </PictureFrame>
                <p className="mt-3 text-center text-lg font-bold text-white">{slot.caption}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
