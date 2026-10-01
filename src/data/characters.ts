export type CharacterGroupName = "Adventure Kids" | "Tweedles";

export type Character = {
  id: string;
  name: string;
  group: CharacterGroupName;
  /** Card color as a hex value, for example "#FFC93C". */
  color: string;
  /** Public image path. */
  image: string;
  /** What they look like. Used as the image alt text. */
  look: string;
  bio: string;
  funFacts: readonly string[];
  catchphrase: string;
};

export const characterGroups: readonly {
  id: string;
  name: CharacterGroupName;
  intro: string;
}[] = [
  {
    id: "adventure-kids",
    name: "Adventure Kids",
    intro: "Four friends, one club, and a whole galaxy to explore.",
  },
  {
    id: "tweedles",
    name: "Tweedles",
    intro: "Fluffy little space creatures who travel with the kids.",
  },
];

export const characters: Character[] = [
  {
    id: "max",
    name: "Max",
    group: "Adventure Kids",
    color: "#FFC93C",
    image: "/images/characters/max.png",
    look: "boy with brown skin, dark curly hair, shiny gold space suit and a clear bubble helmet",
    bio: "Max is the brave captain of the Adventure Kids Club. He's always first to the launch pad and loves finding new planets to explore. When things get tricky, Max takes a deep breath and says the team can do anything together.",
    funFacts: [
      "Favorite planet: Saturn, because of its rings",
      "Can name every star on the club map",
      "Keeps a snack in every pocket of his suit",
    ],
    catchphrase: "Ready, set, BLAST OFF!",
  },
  {
    id: "blaze",
    name: "Blaze",
    group: "Adventure Kids",
    color: "#A3E635",
    image: "/images/characters/blaze.png",
    look: "boy with light skin, spiky brown hair, black and lime-green space suit, clear bubble helmet",
    bio: "Blaze is the speedy inventor of the crew. He builds gadgets out of anything he can find, and his cyan headphones play the club's favorite space tunes. Sometimes his inventions go a little wobbly, but that's how he learns!",
    funFacts: [
      "Built a rocket skateboard (it only crashed twice)",
      "Loves anything that glows",
      "Fastest runner in the club",
    ],
    catchphrase: "Let's turbo-charge it!",
  },
  {
    id: "pip",
    name: "Pip",
    group: "Adventure Kids",
    color: "#A855F7",
    image: "/images/characters/pip.png",
    look: "girl with tan skin, brown curly ponytail with a pink star clip, silver and purple space suit, clear bubble helmet",
    bio: "Pip is the curious one. She asks a hundred questions a day and writes every answer in her star notebook. Pip notices the little things everyone else misses, and that usually saves the day.",
    funFacts: [
      "Collects space rocks",
      "Her star clip glows when she has an idea",
      "Best friends with Prism",
    ],
    catchphrase: "Ooh, I wonder why!",
  },
  {
    id: "luna",
    name: "Luna",
    group: "Adventure Kids",
    color: "#FF3EA5",
    image: "/images/characters/luna.png",
    look: "girl with fair skin, blonde ponytail with a sparkly pink scrunchie, hot pink space suit, clear bubble helmet",
    bio: "Luna is the heart of the Adventure Kids Club. She's kind, giggly, and always makes sure nobody gets left behind. Luna loves singing to the Tweedles and dancing in zero gravity.",
    funFacts: [
      "Can do a triple flip in zero gravity",
      "Knows every Tweedle's favorite song",
      "Draws hearts on every map",
    ],
    catchphrase: "Friends shine brighter together!",
  },
  {
    id: "cj",
    name: "CJ",
    group: "Tweedles",
    color: "#38BDF8",
    image: "/images/characters/cj.png",
    look: "fluffy blue baby bird with a spiky red crest and a red chest",
    bio: "CJ is the loudest little chirper in the galaxy! He flaps ahead to scout the way and always chirps a warning when something's up.",
    funFacts: [
      "Can chirp in 12 different tunes",
      "Thinks every button is for pressing",
      "Max's best buddy",
    ],
    catchphrase: "Chirp chirp HOORAY!",
  },
  {
    id: "fizz",
    name: "Fizz",
    group: "Tweedles",
    color: "#A3E635",
    image: "/images/characters/fizz.png",
    look: "fluffy creature with big blue ears with lime-green tips and a lime-green face",
    bio: "Fizz is bubbly, bouncy and full of giggles. Those big ears can hear a space whale sing from three planets away!",
    funFacts: [
      "Hears sounds nobody else can",
      "Bounces when happy (which is always)",
      "Loves fizzy star-berries",
    ],
    catchphrase: "Fizz-tastic!",
  },
  {
    id: "prism",
    name: "Prism",
    group: "Tweedles",
    color: "#D946EF",
    image: "/images/characters/prism.png",
    look: "fluffy creature with big magenta-purple ears, a cyan beak and a cyan-blue belly",
    bio: "Prism is the colorful dreamer of the Tweedles. When Prism is happy, little rainbows sparkle all around. Prism loves art, puzzles and quiet stargazing with Pip.",
    funFacts: [
      "Makes rainbows when happy",
      "Best at puzzles",
      "Shy at first but super brave",
    ],
    catchphrase: "Every color counts!",
  },
  {
    id: "ember",
    name: "Ember",
    group: "Tweedles",
    color: "#FF8A00",
    image: "/images/characters/ember.png",
    look: "fluffy golden-yellow chick with a fiery red-orange crest and a big flame-colored tail",
    bio: "Ember is small but mighty! Ember's warm, glowing tail lights the way through dark caves and keeps everyone cozy on chilly moons.",
    funFacts: [
      "Tail glows like a night light",
      "Loves warm cocoa",
      "Never gives up",
    ],
    catchphrase: "Light it up!",
  },
];
