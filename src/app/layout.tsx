import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { site } from "@/data/site";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-nunito",
  display: "swap",
});

const shareImage = {
  url: "/images/og.png",
  width: 1200,
  height: 630,
  alt: site.name,
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.tagline,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: site.name,
    description: site.tagline,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.tagline,
    images: [shareImage.url],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:inline-flex focus:min-h-12 focus:items-center focus:rounded-full focus:bg-gold focus:px-5 focus:font-heading focus:text-lg focus:text-navy"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex flex-1 scroll-mt-32 flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
