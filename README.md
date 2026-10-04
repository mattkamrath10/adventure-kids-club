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

The Join page and the footer banner send the parent's first name and email to Kit through `POST /api/join`. The form is for parents and guardians only, and the 18+ checkbox is required. The contact page stays on Formspree.

```bash
KIT_API_KEY=your-v4-api-key
KIT_FORM_ID=your-form-id
```

Put those lines in `.env.local` for local work (that file stays on your computer). Restart `npm run dev` after you change them. Set the same variables in your host's build settings. Do not put either one in a `NEXT_PUBLIC_` variable.

1. In Kit, open Developer settings and create a V4 API key. Use it as `KIT_API_KEY`.
2. Open the form and copy its id. Use that as `KIT_FORM_ID`.

A successful signup asks the parent to tap the confirm button in their email. A failed signup shows "Something went wrong, please try again." After they confirm, the free coloring pages and behind-the-scenes pictures are on `/members`. That page is not in the menu.
