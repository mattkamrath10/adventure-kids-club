"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Star, X } from "lucide-react";
import { EditableImage } from "@/components/owner/image-overrides";
import { characterGroups, type Character } from "@/data/characters";
import { inkClass, navyBodyOn } from "@/lib/contrast";

export type CrewMember = Character & { photo: string | null };

const starColors = ["#FF3EA5", "#FFC93C", "#38BDF8", "#FF8A00", "#A855F7", "#A3E635", "#D946EF"];

function starColor(index: number, cardColor: string) {
  const color = starColors[index % starColors.length];
  if (color.toLowerCase() === cardColor.toLowerCase()) {
    return starColors[(index + 3) % starColors.length];
  }
  return color;
}

function LetterBadge({ character, className }: { character: CrewMember; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-full font-heading ring-8 ring-white ${inkClass(character.color)} ${className}`}
      style={{ backgroundColor: character.color }}
    >
      {character.name.slice(0, 1)}
    </span>
  );
}

function FunFacts({ character }: { character: CrewMember }) {
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {character.funFacts.map((fact, index) => (
        <li key={fact} className="flex items-start gap-3 text-lg leading-snug">
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-navy ring-2 ring-white"
            style={{ backgroundColor: starColor(index, character.color) }}
          >
            <Star size={18} fill="currentColor" strokeWidth={2.5} />
          </span>
          <span>{fact}</span>
        </li>
      ))}
    </ul>
  );
}

function CharacterModal({ character, onClose }: { character: CrewMember; onClose: () => void }) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const inertTargets = [...document.body.children].filter((node) => node !== dialog);
    for (const node of inertTargets) node.setAttribute("inert", "");

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"),
      ].filter((node) => node.tabIndex !== -1);
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
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[90] flex items-end justify-center px-3 pb-3 pt-16 sm:items-center sm:p-8"
    >
      <div
        className="relative z-10 flex max-h-[calc(100svh-5.5rem)] w-full max-w-4xl flex-col overflow-y-auto rounded-[2rem] sm:max-h-[92svh]"
        style={{ backgroundColor: character.color }}
      >
        <div className="sticky top-0 z-10 flex justify-end p-3">
          <button
            ref={closeRef}
            type="button"
            className="inline-flex min-h-14 items-center gap-2 rounded-full bg-white px-5 text-xl text-navy"
            onClick={onClose}
          >
            <X aria-hidden="true" size={28} strokeWidth={2.75} />
            Close
          </button>
        </div>
        <div className="relative mx-4 flex min-h-[70vh] items-center justify-center">
          <EditableImage
            slotKey={character.image}
            alt={`${character.name}, ${character.look}`}
            fit="contain"
          >
            {character.photo ? (
              <Image
                src={character.photo}
                alt={`${character.name}, ${character.look}`}
                fill
                sizes="(min-width: 896px) 896px, 100vw"
                className="object-contain"
              />
            ) : (
              <LetterBadge character={character} className="size-72 text-8xl sm:size-[28rem] sm:text-9xl" />
            )}
          </EditableImage>
        </div>
        <h2 id={titleId} className={`px-6 text-center text-5xl sm:text-7xl ${inkClass(character.color)}`}>
          {character.name}
        </h2>
        <p className="mx-auto mb-8 mt-4 max-w-lg rounded-3xl bg-white px-5 py-4 text-center font-heading text-2xl text-navy sm:text-3xl">
          {character.catchphrase}
        </p>
        {character.photo ? null : (
          <p className="mx-6 mb-8 rounded-3xl bg-white p-4 text-center text-lg text-navy">
            {character.look.charAt(0).toUpperCase()}
            {character.look.slice(1)}.
          </p>
        )}
      </div>
      <button
        type="button"
        tabIndex={-1}
        aria-label={`Close ${character.name}`}
        className="absolute inset-0 z-0 bg-navy/80"
        onClick={onClose}
      />
    </div>
  );
}

function CharacterCard({
  character,
  flip,
  onOpen,
}: {
  character: CrewMember;
  flip: boolean;
  onOpen: () => void;
}) {
  const onPanel = !navyBodyOn(character.color);
  const ink = inkClass(character.color);

  return (
    <article id={character.id} className="scroll-mt-40">
      <div
        className={`relative flex flex-col rounded-[2rem] ${flip ? "md:flex-row-reverse" : "md:flex-row"}`}
        style={{ backgroundColor: character.color }}
      >
        <div className="relative flex min-h-80 w-full items-center justify-center md:min-h-[400px] md:w-1/2">
          <EditableImage
            slotKey={character.image}
            alt={`${character.name}, ${character.look}`}
            fit="contain"
          >
            {character.photo ? (
              <Image
                src={character.photo}
                alt={`${character.name}, ${character.look}`}
                fill
                sizes="(min-width: 768px) 36rem, 100vw"
                className="object-contain p-4"
              />
            ) : (
              <LetterBadge character={character} className="size-48 text-7xl md:size-64 md:text-8xl" />
            )}
          </EditableImage>
        </div>
        <div className={`flex w-full flex-col justify-center p-6 sm:p-8 md:w-1/2 md:p-10 ${ink}`}>
          <h3 className="text-5xl sm:text-6xl">{character.name}</h3>
          {character.photo ? null : <p className="sr-only">{character.look}</p>}
          <p className="relative mt-5 max-w-md rounded-3xl bg-white px-5 py-4 font-heading text-2xl leading-snug text-navy sm:text-3xl">
            <span aria-hidden="true" className="absolute -top-2 left-8 size-5 rotate-45 bg-white" />
            {character.catchphrase}
          </p>
          <div className={onPanel ? "mt-5 rounded-3xl bg-white p-5 text-navy" : "mt-5"}>
            <p className="text-lg leading-relaxed">{character.bio}</p>
            <h4 className="mt-5 text-2xl">Fun facts</h4>
            <FunFacts character={character} />
          </div>
          <p className="mt-5 inline-flex min-h-12 w-fit items-center rounded-full bg-navy px-5 text-lg text-white">
            Bigger picture
          </p>
        </div>
        <button
          type="button"
          className="absolute inset-0 rounded-[2rem] focus-visible:outline-white"
          aria-label={`Open a bigger picture of ${character.name}`}
          onClick={onOpen}
        />
      </div>
    </article>
  );
}

export function CrewDirectory({ crew }: { crew: CrewMember[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const active = crew.find((character) => character.id === activeId) ?? null;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {characterGroups.map((group) => {
        const members = crew.filter((character) => character.group === group.name);

        return (
          <section
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-title`}
            className="mt-14 scroll-mt-40"
          >
            <h2
              id={`${group.id}-title`}
              className={`text-4xl sm:text-5xl ${group.id === "tweedles" ? "text-sky" : "text-gold"}`}
            >
              {group.name}
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-white sm:text-xl">{group.intro}</p>
            <ul className="mt-8 flex flex-col gap-8">
              {members.map((character, index) => (
                <li key={character.id} className="play-float">
                  <CharacterCard
                    character={character}
                    flip={index % 2 === 1}
                    onOpen={() => setActiveId(character.id)}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {mounted && active
        ? createPortal(
            <CharacterModal character={active} onClose={() => setActiveId(null)} />,
            document.body,
          )
        : null}
    </>
  );
}
