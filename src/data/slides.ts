export type Slide = {
  headline: string;
  line: string;
  buttonText: string;
  href: string;
  /** Public image path. A file in public/images/gallery/ is used when this is missing. */
  image?: string;
  /** Tailwind gradient classes, used when no photo is available. */
  gradient: string;
};

export const slides: Slide[] = [
  {
    headline: "Meet the Adventure Kids!",
    line: "Max, Blaze, Pip, Luna and friends are ready for blast off.",
    buttonText: "Meet the kids",
    href: "/characters",
    gradient: "bg-gradient-to-br from-gold via-orange to-pink",
  },
  {
    headline: "Say hi to the Tweedles!",
    line: "A sky-blue hello from the silliest pals in the club.",
    buttonText: "Say hi",
    href: "/characters#tweedles",
    gradient: "bg-gradient-to-br from-sky via-purple to-navy",
  },
  {
    headline: "Watch new episodes",
    line: "Big adventures are waiting on the main channel.",
    buttonText: "Watch now",
    href: "/watch",
    gradient: "bg-gradient-to-br from-orange via-pink to-purple",
  },
  {
    headline: "Join the Club",
    line: "News, games, and adventures made for families.",
    buttonText: "Join the club",
    href: "/join",
    gradient: "bg-gradient-to-br from-lime via-sky to-navy",
  },
];
