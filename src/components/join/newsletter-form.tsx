"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  mailchimpHoneypotName,
  newsletterAction,
  newsletterCopy,
  newsletterFieldNames,
  newsletterProvider,
  subscribeToNewsletter,
} from "@/lib/newsletter";
import { Confetti } from "./confetti";

type Status = "idle" | "sending" | "error" | "success";

export function NewsletterForm() {
  const action = newsletterAction();
  const provider = newsletterProvider(action);
  const fields = newsletterFieldNames(provider);
  const honeypotName = provider === "mailchimp" ? mailchimpHoneypotName(action) : null;

  const nameId = useId();
  const emailId = useId();
  const grownupId = useId();
  const errorId = useId();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [grownup, setGrownup] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [already, setAlready] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(newsletterCopy.failed);

  const alive = useRef(true);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const honeypot = honeypotName ? String(new FormData(form).get(honeypotName) ?? "") : "";
    if (honeypot) {
      setAlready(false);
      setStatus("success");
      return;
    }

    setStatus("sending");
    const result = await subscribeToNewsletter({
      action,
      email,
      firstName,
    });
    if (!alive.current) return;

    if (result.status === "navigate") {
      form.submit();
      return;
    }

    if (result.status === "error") {
      setErrorMessage(result.message);
      setStatus("error");
      return;
    }

    setAlready(result.already);
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div role="status" className="relative overflow-hidden rounded-3xl bg-lime px-5 py-8 text-center text-navy">
        <Confetti />
        <div className="relative z-10">
          <h3 ref={successRef} tabIndex={-1} className="text-4xl">
            {already ? newsletterCopy.alreadyTitle : newsletterCopy.successTitle}
          </h3>
          <p className="mt-3 text-lg font-bold">
            {already ? newsletterCopy.alreadyBody : newsletterCopy.successBody}
          </p>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form action={action || undefined} method="post" onSubmit={handleSubmit} className="relative grid gap-4">
      {honeypotName ? (
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>
            Leave this empty
            <input type="text" name={honeypotName} tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>
      ) : null}
      {provider === "buttondown" ? <input type="hidden" name="embed" value="1" /> : null}

      <label htmlFor={nameId} className="grid gap-2 font-heading text-lg">
        <span>
          Parent&apos;s first name <span className="font-sans font-bold">(optional)</span>
        </span>
        <input
          id={nameId}
          name={fields.firstName ?? undefined}
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
          name={fields.email}
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
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-full border-4 border-navy bg-navy px-6 font-heading text-xl text-white hover:bg-white hover:text-navy disabled:opacity-60"
      >
        {sending ? "Sending…" : "Join the club"}
      </button>

      <p className="text-center">
        <Link
          href="/privacy"
          className="inline-flex min-h-12 items-center font-heading text-lg text-navy underline decoration-2 underline-offset-4"
        >
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}
