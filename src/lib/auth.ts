import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "akc_owner";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function sessionKey(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export function checkCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) return false;

  const usernameMatch = timingSafeEqual(sha256(username), sha256(expectedUsername));
  const passwordMatch = timingSafeEqual(sha256(password), sha256(expectedPassword));
  return usernameMatch && passwordMatch;
}

export async function createSession(): Promise<void> {
  const key = sessionKey();
  if (!key) return;

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("owner")
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function isOwner(): Promise<boolean> {
  try {
    const key = sessionKey();
    if (!key) return false;

    const jar = await cookies();
    const token = jar.get(COOKIE_NAME)?.value;
    if (!token) return false;

    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload.sub === "owner";
  } catch {
    return false;
  }
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
