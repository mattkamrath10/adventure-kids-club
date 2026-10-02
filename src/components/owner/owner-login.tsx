"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useContext, useId, useState, type FormEvent } from "react";
import { ImageOverrideContext } from "@/components/owner/image-overrides";

const WRONG = "Wrong username or password";

export function OwnerLogin({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();
  const ownerMode = useContext(ImageOverrideContext);
  const usernameId = useId();
  const passwordId = useId();
  const errorId = useId();

  const [owner, setOwner] = useState(loggedIn);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/owner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError(WRONG);
        setPending(false);
        return;
      }

      setPassword("");
      setOwner(true);
      ownerMode?.setOwner(true);
      router.refresh();
    } catch {
      setError(WRONG);
    } finally {
      setPending(false);
    }
  }

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    setError("");

    try {
      await fetch("/api/owner/logout", { method: "POST" });
      setOwner(false);
      ownerMode?.setOwner(false);
      setUsername("");
      setPassword("");
      router.refresh();
    } catch {
      setError("Could not log out. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (owner) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-[2rem] bg-white px-5 py-8 text-navy sm:px-8">
        <h1 className="text-center text-4xl">You&apos;re logged in!</h1>
        <p className="mt-3 text-center text-lg font-bold">
          Go to any page and click a picture to change it.
        </p>
        <div className="mt-6 grid gap-3">
          <Link
            href="/"
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-gold px-6 font-heading text-xl text-navy"
          >
            Go to Home
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={pending}
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-navy px-6 font-heading text-xl text-white disabled:opacity-60"
          >
            Log out
          </button>
          {error ? (
            <p role="alert" className="rounded-2xl bg-navy px-4 py-3 text-lg font-bold text-white">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-[2rem] bg-white px-5 py-8 text-navy sm:px-8">
      <h1 className="text-center text-4xl">Owner login</h1>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label htmlFor={usernameId} className="grid gap-2 font-heading text-lg">
          Username
          <input
            id={usernameId}
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={pending}
            className="min-h-14 rounded-2xl border-4 border-navy bg-white px-4 font-sans text-lg text-navy"
          />
        </label>

        <label htmlFor={passwordId} className="grid gap-2 font-heading text-lg">
          Password
          <span className="relative block">
            <input
              id={passwordId}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={pending}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className="min-h-14 w-full rounded-2xl border-4 border-navy bg-white px-4 pr-16 font-sans text-lg text-navy"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-1 my-auto inline-flex size-12 items-center justify-center rounded-full text-navy"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="size-7" />
              ) : (
                <Eye aria-hidden="true" className="size-7" />
              )}
            </button>
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-gold px-6 font-heading text-xl text-navy disabled:opacity-60"
        >
          {pending ? "Logging in…" : "Log in"}
        </button>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="rounded-2xl bg-navy px-4 py-3 text-lg font-bold text-white"
          >
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
