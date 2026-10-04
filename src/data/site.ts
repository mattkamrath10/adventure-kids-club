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
    "Blast off on big adventures with Max, Blaze, Pip, Luna and the Tweedles! Watch episodes, meet the characters and join the club.",
  url: "https://www.adventure8kidsclub.com",
  footerNote: "A show for kids. Made with love for families.",
  socials: [
    {
      name: "YouTube",
      href: "https://www.youtube.com/@Adventure8kidsclub",
      description: "Full episodes",
      primary: true,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61595010001812",
      description: "Photos and fun",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/adventure8kidsclub?stkn=OGdwanBiOHk4ZHM2",
      description: "Stories and smiles",
    },
    {
      name: "X",
      href: "https://x.com/Adventure8kidsclub",
      description: "Quick updates",
    },
    {
      name: "Pinterest",
      href: "https://www.pinterest.com/Adventure8kidsclub",
      description: "Ideas to try",
    },
  ] satisfies SocialLink[],
};
