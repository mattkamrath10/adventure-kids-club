"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useEffect, useId, useRef, useSyncExternalStore, useState, type FormEvent } from "react";
import { newsletterError, subscribeToNewsletter } from "@/lib/newsletter";

const STORAGE_KEY = "akc-join-confirm";
const RESEND_WAIT_MS = 60_000;

type PendingJoin = { email: string; firstName: string };
type Status = "idle" | "sending" | "error";
type ResendNote = "idle" | "sent" | "error";

let cachedRaw: string | null | undefined;
let cachedPending: PendingJoin | null = null;

function parsePending(raw: string | null): PendingJoin | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as { email?: unknown; firstName?: unknown };
    if (typeof data.email !== "string" || !data.email.includes("@")) return null;
    return {
      email: data.email,
      firstName: typeof data.firstName === "string" ? data.firstName : "",
    };
  } catch {
    return null;
  }
}

function readPending() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedPending;
  cachedRaw = raw;
  cachedPending = parsePending(raw);
  return cachedPending;
}

function writePending(value: PendingJoin | null) {
  if (value) {
    const raw = JSON.stringify(value);
    sessionStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedPending = value;
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
    cachedPending = null;
  }
  window.dispatchEvent(new Event("akc-join-confirm"));
}

function subscribePending(onStoreChange: () => void) {
  window.addEventListener("akc-join-confirm", onStoreChange);
  return () => window.removeEventListener("akc-join-confirm", onStoreChange);
}

function pendingServerSnapshot(): PendingJoin | null {
  return null;
}

export function NewsletterForm() {
  const nameId = useId();
  const emailId = useId();
  const grownupId = useId();
  const errorId = useId();

  const pending = useSyncExternalStore(subscribePending, readPending, pendingServerSnapshot);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [grownup, setGrownup] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [resendNote, setResendNote] = useState<ResendNote>("idle");
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  const alive = useRef(true);
  const sendingRef = useRef(false);
  const panelRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const remaining =
    cooldownUntil && now ? Math.max(0, Math.ceil((cooldownUntil - now) / 1000)) : 0;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (pending) panelRef.current?.focus();
  }, [pending]);

  useEffect(() => {
    if (!cooldownUntil) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [cooldownUntil]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;
    sendingRef.current = true;

    setStatus("sending");
    const ok = await subscribeToNewsletter({
      email,
      firstName,
      isAdult: grownup,
    });
    sendingRef.current = false;
    if (!alive.current) return;

    if (!ok) {
      setStatus("error");
      return;
    }

    writePending({ email: email.trim(), firstName: firstName.trim() });
    setFirstName("");
    setEmail("");
    setGrownup(false);
    setStatus("idle");
    setResendNote("idle");
  }

  async function resend() {
    if (!pending || sendingRef.current || remaining > 0) return;
    sendingRef.current = true;
    setCooldownUntil(Date.now() + RESEND_WAIT_MS);
    setNow(Date.now());
    setResendNote("idle");

    const ok = await subscribeToNewsletter({
      email: pending.email,
      firstName: pending.firstName,
      isAdult: true,
    });
    sendingRef.current = false;
    if (!alive.current) return;
    setResendNote(ok ? "sent" : "error");
  }

  function useDifferentEmail() {
    writePending(null);
    setFirstName("");
    setEmail("");
    setGrownup(false);
    setStatus("idle");
    setResendNote("idle");
    setCooldownUntil(null);
  }

  if (pending) {
    return (
      <div className="grid gap-4">
        <div className="rounded-[2rem] bg-navy px-5 py-8 text-center text-white">
          <Mail aria-hidden="true" className="mx-auto size-16 text-gold" strokeWidth={2.25} />
          <h3 ref={panelRef} tabIndex={-1} className="mt-3 text-4xl">
            Check your email!
          </h3>
          <p className="mt-4 text-lg font-bold">
            We sent a confirmation link to <strong>{pending.email}</strong>. Tap the button in that
            email to unlock your free coloring pages and behind-the-scenes fun.
          </p>
          <p className="mt-3 text-lg">
            Don&apos;t see it? Check your Spam or Promotions folder. It comes from Adventure8 Kids
            Club.
          </p>
          <button
            type="button"
            onClick={() => void resend()}
            disabled={remaining > 0}
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-gold px-6 font-heading text-xl text-navy hover:bg-white disabled:opacity-60"
          >
            {remaining > 0 ? `Resend in ${remaining}s` : "Resend email"}
          </button>
          {resendNote === "sent" ? (
            <p role="status" className="mt-4 text-lg font-bold text-gold">
              Sent again! Check your inbox.
            </p>
          ) : null}
          {resendNote === "error" ? (
            <p role="alert" className="mt-4 text-lg font-bold text-gold">
              {newsletterError}
            </p>
          ) : null}
          <button
            type="button"
            onClick={useDifferentEmail}
            className="mt-4 inline-flex min-h-12 items-center font-heading text-lg text-sky underline decoration-2 underline-offset-4"
          >
            Use a different email
          </button>
        </div>
        <PrivacyLink />
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form method="post" onSubmit={handleSubmit} className="relative grid gap-4">
      <label htmlFor={nameId} className="grid gap-2 font-heading text-lg">
        <span>
          Parent&apos;s first name <span className="font-sans font-bold">(optional)</span>
        </span>
        <input
          id={nameId}
          name="first_name"
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          autoComplete="given-name"
          disabled={sending}
          className="min-h-14 rounded-2xl border-4 border-navy bg-white px-4 font-sans text-lg text-navy"
        />
      </label>

      <label htmlFor={emailId} className="grid gap-2 font-heading text-lg">
        Parent&apos;s email
        <input
          id={emailId}
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          inputMode="email"
          disabled={sending}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? errorId : undefined}
          className="min-h-14 rounded-2xl border-4 border-navy bg-white px-4 font-sans text-lg text-navy"
        />
      </label>

      <label htmlFor={grownupId} className="flex min-h-12 items-center gap-3 text-lg font-bold">
        <input
          id={grownupId}
          type="checkbox"
          required
          checked={grownup}
          onChange={(event) => setGrownup(event.target.checked)}
          disabled={sending}
          className="size-6 shrink-0 accent-navy"
        />
        I&apos;m a parent or guardian, 18 or older.
      </label>

      {status === "error" ? (
        <p
          ref={errorRef}
          id={errorId}
          role="alert"
          tabIndex={-1}
          className="rounded-2xl bg-navy px-4 py-3 text-lg font-bold text-white"
        >
          {newsletterError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-full border-4 border-navy bg-navy px-6 font-heading text-xl text-white hover:bg-white hover:text-navy disabled:opacity-60"
      >
        {sending ? "Sending…" : "Join the club"}
      </button>

      <PrivacyLink />
    </form>
  );
}

function PrivacyLink() {
  return (
    <p className="text-center">
      <Link
        href="/privacy"
        className="inline-flex min-h-12 items-center font-heading text-lg text-navy underline decoration-2 underline-offset-4"
      >
        Privacy Policy
      </Link>
    </p>
  );
}
