"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/nav";
import { site } from "@/data/site";
import { YouTubeIcon } from "./social-icons";

const menuStyles: Record<string, string> = {
  "/": "bg-gold text-navy",
  "/characters": "bg-pink text-navy",
  "/watch": "bg-sky text-navy",
  "/gallery": "bg-lime text-navy",
  "/join": "bg-orange text-navy",
  "/contact": "bg-purple text-white",
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function youtubeHref() {
  return (
    site.socials.find((social) => social.primary)?.href ??
    site.socials.find((social) => social.name === "YouTube")?.href ??
    "https://www.youtube.com/"
  );
}

function SubscribeLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={youtubeHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Subscribe to ${site.handle} on YouTube (opens in a new tab)`}
      className={`min-h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-[#FF0000] px-6 font-heading text-xl font-bold text-white hover:brightness-110 focus-visible:outline-white ${className}`}
    >
      <YouTubeIcon className="size-7" />
      Subscribe
    </a>
  );
}

function Wordmark() {
  return (
    <Link
      href="/"
      aria-label={`${site.brand}. ${site.show}`}
      className="inline-flex min-h-12 max-w-[calc(100%-4.5rem)] items-center lg:max-w-xl"
    >
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-heading text-xl font-bold leading-none text-white sm:text-3xl">
          Adventure<span className="inline-block px-[0.04em] text-[1.6em] leading-none text-gold">8</span> Kids Club
        </span>
        <span className="text-balance font-heading text-lg font-bold leading-tight text-sky">
          {site.show}
        </span>
      </span>
    </Link>
  );
}

export function HeaderClient() {
  const pathname = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();
    const menu = menuRef.current;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const inertTargets = [...document.body.children].filter((node) => node !== menu);
    for (const node of inertTargets) node.setAttribute("inert", "");

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !menu) return;

      const focusable = [
        ...menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      html.style.overflow = previousOverflow;
      for (const node of inertTargets) node.removeAttribute("inert");
    };
  }, [open]);

  function goToPage() {
    setOpen(false);
    document.getElementById("main")?.focus();
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/20 bg-navy/90 backdrop-blur-md supports-[backdrop-filter]:bg-navy/75">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
          <Wordmark />
          <div className="ml-auto flex items-center gap-3">
            <SubscribeLink className="hidden lg:inline-flex" />
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex size-14 items-center justify-center rounded-full bg-gold text-navy focus-visible:outline-white lg:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu aria-hidden="true" size={32} strokeWidth={2.75} />
            </button>
          </div>
        </div>
        <nav
          aria-label="Primary"
          className="mx-auto hidden w-full max-w-6xl flex-wrap items-center justify-center gap-2 px-4 pb-4 lg:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full px-4 font-heading text-lg font-bold focus-visible:outline-white ${
                  active ? "bg-gold text-navy" : "text-white hover:bg-white/15"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 overflow-y-auto bg-[linear-gradient(165deg,#ff3ea5_0%,#a855f7_32%,#1b1464_62%,#38bdf8_100%)]"
        >
          <div className="flex min-h-full flex-col px-5 py-5">
            <div className="flex justify-end">
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex min-h-14 items-center gap-2 rounded-full bg-white px-5 font-heading text-xl text-navy"
                onClick={() => {
                  setOpen(false);
                  menuButtonRef.current?.focus();
                }}
              >
                <X aria-hidden="true" size={28} strokeWidth={2.75} />
                Close
              </button>
            </div>

            <nav aria-label="Primary" className="mt-6 flex flex-col gap-3">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={goToPage}
                    className={`flex min-h-20 items-center justify-center rounded-3xl px-5 text-center font-heading text-3xl font-bold leading-tight sm:text-4xl ${
                      menuStyles[link.href] ?? "bg-sky text-navy"
                    } ${active ? "ring-4 ring-white" : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <SubscribeLink className="mt-6 inline-flex w-full text-2xl" />
          </div>
        </div>
      ) : null}
    </>
  );
}
