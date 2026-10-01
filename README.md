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

Put the picture at `public/images/characters/{id}.png` (the same `id` as in the file). Until that file is there, the site shows the first letter of their name.

## Add a gallery picture

1. Drop the file in `public/images/gallery/` (png, jpg, webp, gif, or avif).
2. Add a line to the list in `src/data/gallery.ts`. `src` must match the file, like `"/images/gallery/your-file.png"`.

`characters` is who is in the picture, using their names: Max, Blaze, Pip, Luna, CJ, Fizz, Prism, Ember. There is a longer note at the top of that file.

If a home slideshow slide has no picture of its own, the site fills it from this folder, in filename order.

## Add a slideshow slide

Edit `src/data/slides.ts`. Each slide has a headline, a short line, button text, a link (`href`), and a gradient. Set `image` to a path in `public/` when you have a photo. If you leave `image` off, the home page uses a gallery picture when one is available, and the gradient when it is not.

## Social links

Edit `src/data/site.ts`. Replace each placeholder `href` with the real YouTube, Facebook, Instagram, X, and Pinterest address. YouTube is the main channel (`primary: true`).

The header shows Adventure8 Kids Club, with the show name underneath. The share image is `public/images/og.png` (1200×630). Favicon and home-screen icons are drawn from `public/images/logo.png` when you add that file. The social handle is `@Adventure8kidsclub`.

## Environment variables

The Join page and the footer banner post straight to your email provider. There is no server and no API route. The form is for parents and guardians only.

```bash
NEXT_PUBLIC_NEWSLETTER_ACTION=https://...
```

Put that line in `.env.local` for local work (that file stays on your computer). Restart `npm run dev` after you change it. Set the same variable in your host's build settings before `npm run build`. The static export bakes the URL in at build time.

Paste the URL with normal `&` characters. If the embed code shows `&amp;`, use `&` instead.

### Mailchimp

1. Open your audience, then **Signup forms**, then **Embedded forms**.
2. Copy the form `action` URL. It looks like `https://xxxx.us1.list-manage.com/subscribe/post?u=YOUR_USER&id=YOUR_LIST`.
3. Use that whole URL as `NEXT_PUBLIC_NEWSLETTER_ACTION`.

The form sends the parent's email as `EMAIL` and the optional first name as `FNAME`.

### Kit (ConvertKit)

1. Open the form, choose **Embed**, then **HTML**.
2. Copy the `action` URL from the `<form>` tag. It looks like `https://app.kit.com/forms/YOUR_FORM_ID/subscriptions`. Older accounts use `https://app.convertkit.com/forms/YOUR_FORM_ID/subscriptions`.
3. Use that URL as `NEXT_PUBLIC_NEWSLETTER_ACTION`.

The form sends the parent's email as `email_address` and the optional first name as `first_name`.

### Buttondown

1. Copy the embed form action from Buttondown's subscribe form docs. It looks like `https://buttondown.com/api/emails/embed-subscribe/YOUR_USERNAME`.
2. Use that URL as `NEXT_PUBLIC_NEWSLETTER_ACTION`.

Buttondown's embed form stores the email (`email`). The optional first name stays on our form and is not sent, because their embed does not ask for it. If Buttondown needs the parent to finish a check on their page, the form opens that page.

### Any other provider

Use the provider's embedded form POST URL. The form sends `email` and, when the parent filled it in, `first_name`.
