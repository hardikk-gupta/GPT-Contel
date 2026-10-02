# Baaz — portfolio recreation

An independently written recreation of [bajkamalsingh.me](https://bajkamalsingh.me/), made at the site owner's request. The HTML, CSS, and interaction code are new; the public video, portrait, artwork, and fonts are reused to preserve the site's identity.

## Preview

![Desktop recreation](docs/desktop-preview.png)

<details>
<summary>Mobile preview</summary>

![Mobile recreation](docs/mobile-preview.png)

</details>

## Run locally

Use Node.js 24 (the validated runtime is 24.19.0).

```sh
npm ci --cache /tmp/baaz-npm-cache
npm run dev -- --port 5173
```

Open the development server on port 5173. `npm run build` creates the deployable static site in `dist/`. `npm run preview -- --port 4173` serves that production build locally.

## What works

- Video hero, handwritten typography, introductory animation, and responsive fixed navigation.
- Reading progress, smooth scrolling, and a book that opens as you scroll. The stickers and polaroid can be dragged.
- Four project cards with accessible detail dialogs and metrics.
- Delhi Metro entrance doors, five project stations, previous/next controls, arrow-key navigation, touch swiping, and project breakdowns.
- Artwork cursor trail and an accessible twelve-piece artwork gallery for desktop and touch devices.
- Email and social links, opt-in synthesised sound effects, and reduced-motion support.

The original is the visual reference, not a copied application. The book artwork, opening choreography, case-study presentation, and sound synthesis are approximations rather than identical implementations. Assets and fonts are local; there are no runtime CDN dependencies or backend credentials.

## Browser validation

```sh
npm run smoke
```

The smoke runner starts its own Vite server on port 5174 and exercises the desktop (1440 × 1000), mobile (390 × 844), and reduced-motion workflows. It checks meaningful interactions, dialog scrolling, asset responses, the video, and browser errors, and saves screenshots to the ignored `.artifacts/` directory.

It uses system Chromium at `/usr/bin/chromium` when present. Elsewhere, install Playwright's browser with `npx playwright install chromium`, or set `CHROMIUM_PATH` to an installed Chromium executable. Set `TEST_BASE_URL` to validate an already running development or production preview server instead.

## Structure

- `src/main.js`: page composition, animation, and interaction behavior.
- `src/style.css`: typography, layout, effects, and responsive styles.
- `src/data.js`: project descriptions, metrics, stations, and gallery entries.
- `public/assets/`: the owner's public artwork and video, local fonts, and font licenses.
- `scripts/smoke.cjs`: repeatable browser validation.

The owner retains their artwork and video rights. Google Fonts licenses are retained in `public/assets/licenses/`. GSAP and Lenis retain their respective package licenses.
