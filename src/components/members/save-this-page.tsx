"use client";

import { X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

const MEMBERS_URL = "https://www.adventure8kidsclub.com/members";
const HIDE_KEY = "akc-hide-save-members";

let cachedHidden: boolean | undefined;

function hiddenSnapshot() {
  const hidden = localStorage.getItem(HIDE_KEY) === "1";
  if (hidden === cachedHidden) return cachedHidden;
  cachedHidden = hidden;
  return hidden;
}

function subscribeHidden(onStoreChange: () => void) {
  window.addEventListener("akc-hide-save-members", onStoreChange);
  return () => window.removeEventListener("akc-hide-save-members", onStoreChange);
}

function hiddenServerSnapshot() {
  return false;
}

function bookmarkTip() {
  const agent = navigator.userAgent;
  const iPadAsMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iPad|iPhone|iPod/.test(agent) || iPadAsMac) {
    return "Tap Share, then Add to Home Screen";
  }
  if (/Android/i.test(agent)) {
    return "Tap the ⋮ menu, then Add to Home screen";
  }
  return "Press Ctrl+D (Cmd+D on Mac) to bookmark";
}

export function SaveThisPage() {
  const hidden = useSyncExternalStore(subscribeHidden, hiddenSnapshot, hiddenServerSnapshot);
  const [copied, setCopied] = useState(false);
  const [tip, setTip] = useState("");

  useEffect(() => {
    setTip(bookmarkTip());
  }, []);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 3000);
    return () => window.clearTimeout(id);
  }, [copied]);

  if (hidden) return null;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(MEMBERS_URL);
      setCopied(true);
      return;
    } catch {
      const field = document.createElement("textarea");
      field.value = MEMBERS_URL;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      const copiedNow = document.execCommand("copy");
      field.remove();
      setCopied(copiedNow);
    }
  }

  function close() {
    localStorage.setItem(HIDE_KEY, "1");
    cachedHidden = true;
    window.dispatchEvent(new Event("akc-hide-save-members"));
  }

  return (
    <aside className="relative mx-auto mt-8 max-w-3xl rounded-[2rem] bg-gold px-5 py-8 text-center text-navy sm:px-8">
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-3 top-3 inline-flex size-12 items-center justify-center rounded-full bg-navy text-white hover:bg-white hover:text-navy"
      >
        <X aria-hidden="true" className="size-6" strokeWidth={2.5} />
      </button>
      <h2 className="text-4xl sm:text-5xl">Save this page!</h2>
      <p className="mt-3 text-lg font-bold sm:text-xl">
        This is your club page. Bookmark it so you can come back for new coloring pages after every
        episode.
      </p>
      <button
        type="button"
        onClick={() => void copyLink()}
        className="mt-6 inline-flex min-h-14 items-center justify-center rounded-full bg-navy px-8 font-heading text-xl text-white hover:bg-white"
      >
        {copied ? "Link copied!" : "Copy link"}
      </button>
      {tip ? <p className="mt-4 text-lg font-bold">{tip}</p> : null}
    </aside>
  );
}
