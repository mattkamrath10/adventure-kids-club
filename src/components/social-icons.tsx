import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function Icon({
  className = "size-7",
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        fill="currentColor"
        d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.38.45A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.45 9.38.45 9.38.45s7.5 0 9.38-.45a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.57V8.43L15.84 12l-6.09 3.57z"
      />
    </Icon>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        fill="currentColor"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.5h-2.79V24C19.61 23.09 24 18.1 24 12.07z"
      />
    </Icon>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        fill="currentColor"
        d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.69 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"
      />
    </Icon>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </Icon>
  );
}

function PinterestIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        fill="currentColor"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.43 7.63 11.17-.1-.95-.2-2.4.04-3.44.22-.94 1.4-5.96 1.4-5.96s-.36-.72-.36-1.78c0-1.67.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-1 4-.28 1.2.6 2.17 1.78 2.17 2.14 0 3.78-2.26 3.78-5.51 0-2.88-2.07-4.89-5.03-4.89-3.43 0-5.44 2.57-5.44 5.23 0 1.04.4 2.15.9 2.75.1.12.11.22.08.34l-.33 1.36c-.05.22-.18.27-.41.16-1.49-.69-2.42-2.88-2.42-4.63 0-3.77 2.74-7.23 7.9-7.23 4.15 0 7.37 2.96 7.37 6.91 0 4.12-2.6 7.44-6.2 7.44-1.21 0-2.35-.63-2.74-1.37l-.75 2.84c-.27 1.04-.99 2.34-1.48 3.14A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"
      />
    </Icon>
  );
}

export const platformClassName: Record<string, string> = {
  YouTube: "bg-[#FF0000] text-white",
  Facebook: "bg-[#1877F2] text-white",
  Instagram: "bg-pink text-navy",
  X: "bg-white text-navy",
  Pinterest: "bg-[#E60023] text-white",
};

export function SocialIcon({ name, className }: { name: string } & IconProps) {
  switch (name) {
    case "YouTube":
      return <YouTubeIcon className={className} />;
    case "Facebook":
      return <FacebookIcon className={className} />;
    case "Instagram":
      return <InstagramIcon className={className} />;
    case "X":
      return <XIcon className={className} />;
    case "Pinterest":
      return <PinterestIcon className={className} />;
    default:
      return (
        <span aria-hidden="true" className="font-heading text-lg leading-none">
          {name.slice(0, 1)}
        </span>
      );
  }
}
