export type GalleryPhoto = {
  /** Public path, for example "/images/gallery/launch-pad.png". */
  src: string;
  alt: string;
  caption: string;
  /** Who is in the picture. Use their names: Max, Blaze, Pip, Luna, CJ, Fizz, Prism, Ember. */
  characters: string[];
};

/**
 * Add a picture:
 * 1. Drop the file in public/images/gallery/ (png, jpg, webp, gif, or avif).
 * 2. Add a line to this list. src must match the file, like "/images/gallery/your-file.png".
 */
export const gallery: GalleryPhoto[] = [
  {
    src: "/images/gallery/launch-pad.png",
    alt: "Max in a shiny gold space suit and CJ, a fluffy blue bird, standing together on a launch pad",
    caption: "Ready for blast off!",
    characters: ["Max", "CJ"],
  },
  {
    src: "/images/gallery/rocket-skateboard.png",
    alt: "Blaze in a lime-green space suit riding a rocket skateboard past the stars",
    caption: "Turbo-charge it!",
    characters: ["Blaze"],
  },
  {
    src: "/images/gallery/star-notebook.png",
    alt: "Pip in a purple space suit writing in her star notebook while Prism watches",
    caption: "A hundred questions!",
    characters: ["Pip", "Prism"],
  },
  {
    src: "/images/gallery/zero-gravity.png",
    alt: "Luna in a hot pink space suit doing a flip in zero gravity",
    caption: "Friends shine brighter!",
    characters: ["Luna"],
  },
  {
    src: "/images/gallery/star-berries.png",
    alt: "Fizz, a fluffy creature with big blue ears, bouncing with a basket of fizzy star-berries",
    caption: "Fizz-tastic snack time!",
    characters: ["Fizz"],
  },
  {
    src: "/images/gallery/rainbow-puzzle.png",
    alt: "Prism the colorful Tweedle smiling, with little rainbows and a puzzle",
    caption: "Every color counts!",
    characters: ["Prism"],
  },
  {
    src: "/images/gallery/cozy-moon.png",
    alt: "Ember, a golden chick with a glowing tail, lighting a cave on a chilly moon",
    caption: "Light it up!",
    characters: ["Ember"],
  },
  {
    src: "/images/gallery/whole-club.png",
    alt: "Max, Blaze, Pip, Luna, CJ, Fizz, Prism, and Ember waving together in space",
    caption: "The whole club!",
    characters: ["Max", "Blaze", "Pip", "Luna", "CJ", "Fizz", "Prism", "Ember"],
  },
];
