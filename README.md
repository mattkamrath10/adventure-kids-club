# Tweedles and the Adventure Kids Club

Promo site for the kids' show. It is a static site (`npm run build` writes an `out` folder) so it can be hosted anywhere.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
```

The finished site is in `out/`.

## Add a video

Edit `src/data/videos.ts`.

Copy only the YouTube id into `youtubeId`:

- Shorts: the part after `/shorts/`
- Watch page: the part after `v=`
- Share link (`youtu.be`): the part after the slash

The first video is the Latest Episode on the home page. Leave `youtubeId` as `"REPLACE_ME"` for a sample card. Samples show while you are developing and are hidden on the live site. Set `isShort: true` for a vertical Short, or `episode` for a numbered episode.

## Add a character

Edit `src/data/characters.ts`. Each character needs an `id`, name, group (`"Adventure Kids"` or `"Tweedles"`), color, look, bio, fun facts, and catchphrase.

Put their picture in `public/images/characters/`. The filename just needs their name in it, like `Blaze face 1.jpg`. Png and jpg both work. Until a picture is there, the site shows the first letter of their name.

## Add a gallery picture

Drop the file in `public/images/gallery/` (png, jpg, webp, gif, or avif). It shows up in the gallery and can fill a home slideshow slide. The caption comes from the filename, so `max-and-cj.png` becomes "Max and CJ" and the Max and CJ filters.

Edit `src/data/gallery.ts` only when you want your own caption or a custom list of who is in the picture.

## Add a slideshow slide

Edit `src/data/slides.ts`. Each slide has a headline, a short line, button text, a link (`href`), and a gradient. Set `image` to a path in `public/` when you have a photo. If you leave `image` off, the home page uses a gallery picture when one is available, and the gradient when it is not.

## Social links

Edit `src/data/site.ts`. Replace each placeholder `href` with the real YouTube, Facebook, Instagram, X, and Pinterest address. YouTube is the main channel (`primary: true`).

The header shows Adventure8 Kids Club, with the show name underneath. Shared links use the picture from `src/app/opengraph-image.tsx` (1200×630). The tab icon is `src/app/icon.png` and the home-screen icon is `src/app/apple-icon.png`. When you add `public/images/logo.png`, run `node scripts/make-icons.mjs` to rebuild those two icons from the logo. The social handle is `@Adventure8kidsclub`.

## Environment variables

The Join page and the footer banner post the parent's first name and email to Formspree. There is no server and no API route. The form is for parents and guardians only, and the 18+ checkbox is required.

```bash
NEXT_PUBLIC_NEWSLETTER_ACTION=https://formspree.io/f/your-form-id
```

Put that line in `.env.local` for local work (that file stays on your computer). Restart `npm run dev` after you change it. Set the same variable in your host's build settings before `npm run build`. The site bakes the URL in at build time.

1. In Formspree, open the form and copy its endpoint. It looks like `https://formspree.io/f/your-form-id`.
2. Use that URL as `NEXT_PUBLIC_NEWSLETTER_ACTION`.

The form sends `first_name` and `email` with `Accept: application/json`. A successful signup shows "You're in! Welcome to the club." and clears the fields. A failed signup shows "Something went wrong, please try again."
