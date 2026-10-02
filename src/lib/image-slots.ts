export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const extensions: Record<(typeof ALLOWED_IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function extensionForType(type: string) {
  if (type in extensions) return extensions[type as keyof typeof extensions];
  return null;
}

/** Blob pathname: slots/{slot key without the leading slash}/{timestamp}.{ext} */
export function uploadPathname(slotKey: string, extension: string) {
  const key = slotKey.replace(/^\/+/, "");
  return `slots/${key}/${Date.now()}.${extension}`;
}

/** Recover the slot key from a blob pathname. Path keys get their leading slash back. */
export function slotKeyFromPathname(pathname: string) {
  if (!pathname.startsWith("slots/")) return null;
  const rest = pathname.slice("slots/".length);
  const cut = rest.lastIndexOf("/");
  if (cut <= 0) return null;
  const key = rest.slice(0, cut);
  if (key.startsWith("slides/") || key.startsWith("gallery/")) return key;
  return `/${key}`;
}
