export type SocialLink = {
  name: string;
  href: string;
  description: string;
  /** YouTube is the main channel. */
  primary?: boolean;
};

export const site = {
  brand: "Adventure8 Kids Club",
  show: "Tweedles and the Adventure Kids Club",
  name: "Adventure8 Kids Club | Tweedles and the Adventure Kids Club",
  handle: "@Adventure8kidsclub",
  tagline:
    "Blast off on big adventures with Max, Blaze, Pip, Luna and the Tweedles!",
  url: "https://adventure8kidsclub.com",
  footerNote: "A show for kids. Made with love for families.",
  socials: [
    {
      name: "YouTube",
      // TODO: replace with the real YouTube URL
      href: "https://www.youtube.com/placeholder",
      description: "Full episodes",
      primary: true,
    },
    {
      name: "Facebook",
      // TODO: replace with the real Facebook URL
      href: "https://www.facebook.com/placeholder",
      description: "Photos and fun",
    },
    {
      name: "Instagram",
      // TODO: replace with the real Instagram URL
      href: "https://www.instagram.com/placeholder",
      description: "Stories and smiles",
    },
    {
      name: "X",
      // TODO: replace with the real X URL
      href: "https://x.com/placeholder",
      description: "Quick updates",
    },
    {
      name: "Pinterest",
      // TODO: replace with the real Pinterest URL
      href: "https://www.pinterest.com/placeholder",
      description: "Ideas to try",
    },
  ] satisfies SocialLink[],
};
