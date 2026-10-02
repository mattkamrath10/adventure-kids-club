"use client";

import { upload, uploadPresigned } from "@vercel/blob/client";
import { Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  ALLOWED_IMAGE_TYPES,
  extensionForType,
  MAX_IMAGE_BYTES,
  uploadPathname,
} from "@/lib/image-slots";

type UploadMode = "token" | "presigned";

type Toast = { id: number; tone: "saved" | "error"; message: string };

type ImageOverrideContextValue = {
  overrides: Record<string, string>;
  owner: boolean;
  uploadMode: UploadMode;
  setOverride: (slotKey: string, url: string) => void;
  setOwner: (owner: boolean) => void;
  notify: (tone: Toast["tone"], message: string) => void;
};

export const ImageOverrideContext = createContext<ImageOverrideContextValue | null>(null);

function useImageOverrides() {
  const value = useContext(ImageOverrideContext);
  if (!value) {
    throw new Error("EditableImage must be inside ImageOverridesProvider");
  }
  return value;
}

export function ImageOverridesProvider({
  overrides: initialOverrides,
  uploadMode,
  children,
}: {
  overrides: Record<string, string>;
  uploadMode: UploadMode;
  children: ReactNode;
}) {
  const router = useRouter();
  const [overrides, setOverrides] = useState(initialOverrides);
  const [owner, setOwner] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | null>(null);
  const sessionRequest = useRef(0);

  useEffect(() => {
    setOverrides((current) => ({ ...current, ...initialOverrides }));
  }, [initialOverrides]);

  useEffect(() => {
    const requestId = ++sessionRequest.current;
    fetch("/api/owner/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { owner?: boolean }) => {
        if (sessionRequest.current === requestId) setOwner(Boolean(data.owner));
      })
      .catch(() => {
        if (sessionRequest.current === requestId) setOwner(false);
      });
  }, []);

  function markOwner(next: boolean) {
    sessionRequest.current += 1;
    setOwner(next);
  }

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  function notify(tone: Toast["tone"], message: string) {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    const id = Date.now();
    setToast({ id, tone, message });
    toastTimer.current = window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  }

  function setOverride(slotKey: string, url: string) {
    setOverrides((current) => ({ ...current, [slotKey]: url }));
  }

  async function logout() {
    await fetch("/api/owner/logout", { method: "POST" });
    markOwner(false);
    router.refresh();
  }

  return (
    <ImageOverrideContext.Provider
      value={{ overrides, owner, uploadMode, setOverride, setOwner: markOwner, notify }}
    >
      {children}
      {owner ? (
        <>
          <div className="h-28 shrink-0" />
          <div className="fixed inset-x-0 bottom-0 z-[80] border-t-4 border-gold bg-navy px-4 py-3 text-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-center text-lg font-bold sm:text-left">
                Owner mode: click any picture&apos;s camera button to change it
              </p>
              <button
                type="button"
                onClick={logout}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 font-heading text-lg text-navy"
              >
                Log out
              </button>
            </div>
          </div>
        </>
      ) : null}
      {toast ? (
        <p
          role="status"
          className={`fixed bottom-32 left-1/2 z-[85] max-w-sm -translate-x-1/2 rounded-full px-5 py-3 text-center text-lg font-bold shadow-lg ${
            toast.tone === "saved" ? "bg-gold text-navy" : "bg-navy text-white ring-4 ring-gold"
          }`}
        >
          {toast.message}
        </p>
      ) : null}
    </ImageOverrideContext.Provider>
  );
}

function stopPictureAction(event: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  event.stopPropagation();
}

export function EditableImage({
  slotKey,
  alt,
  fit = "cover",
  layout = "fill",
  clipClassName = "",
  buttonClassName = "right-1 top-1",
  children,
}: {
  slotKey: string;
  alt: string;
  fit?: "cover" | "contain";
  layout?: "fill" | "inline";
  clipClassName?: string;
  buttonClassName?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const { overrides, owner, uploadMode, setOverride, notify } = useImageOverrides();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const override = overrides[slotKey];

  async function onFile(file: File | undefined) {
    if (!file || uploading) return;
    const extension = extensionForType(file.type);
    if (!extension) {
      notify("error", "Please choose a JPEG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      notify("error", "That picture is too big. Please choose one under 10 MB.");
      return;
    }

    setUploading(true);
    try {
      const pathname = uploadPathname(slotKey, extension);
      const options = {
        access: "public" as const,
        handleUploadUrl: "/api/owner/upload",
        contentType: file.type,
        multipart: file.size > 4 * 1024 * 1024,
      };
      const blob =
        uploadMode === "presigned"
          ? await uploadPresigned(pathname, file, options)
          : await upload(pathname, file, options);
      setOverride(slotKey, blob.url);
      const refreshed = await fetch("/api/owner/revalidate", { method: "POST" });
      if (!refreshed.ok) {
        notify("error", "That picture didn't finish saving. Please try again.");
        return;
      }
      notify("saved", "Saved!");
      router.refresh();
    } catch {
      notify("error", "That picture didn't save. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (!owner && !override) return children;

  const frameClass =
    layout === "inline" ? "relative inline-flex max-w-full" : "pointer-events-none absolute inset-0";
  const clipClass =
    layout === "inline"
      ? `block max-w-full overflow-hidden ${clipClassName}`
      : `absolute inset-0 flex items-center justify-center overflow-hidden ${clipClassName}`;

  return (
    <span className={frameClass}>
      <span className={clipClass}>
        {override ? (
          <img
            src={override}
            alt={alt}
            className={
              layout === "inline"
                ? "h-14 w-auto max-w-[14rem] object-contain sm:h-16"
                : `absolute inset-0 size-full ${fit === "contain" ? "object-contain" : "object-cover"}`
            }
          />
        ) : (
          children
        )}
      </span>
      {owner ? (
        <>
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-30 border-4 border-dashed border-gold ${clipClassName}`}
          />
          <button
            type="button"
            aria-label="Change picture"
            disabled={uploading}
            onPointerDown={stopPictureAction}
            onPointerUp={stopPictureAction}
            onClick={(event) => {
              stopPictureAction(event);
              inputRef.current?.click();
            }}
            className={`pointer-events-auto absolute z-40 inline-flex size-12 items-center justify-center rounded-full bg-gold text-navy shadow-lg disabled:opacity-60 ${buttonClassName}`}
          >
            <Camera aria-hidden="true" className="size-7" />
          </button>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              event.stopPropagation();
              void onFile(event.target.files?.[0]);
            }}
          />
        </>
      ) : null}
      {uploading ? (
        <span className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-navy/55 text-white">
          <Loader2 aria-hidden="true" className="size-12 motion-safe:animate-spin" />
          <span className="sr-only">Saving picture</span>
        </span>
      ) : null}
    </span>
  );
}
