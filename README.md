# Street Heists

A clickable Midnight Crew prototype: create fictional heists on a mocked city map, walk the beats, submit photo proofs, score speed plus style, and export glossy crime cards.

Pure make-believe. Zero real crime. Private local demo only — no payments, no production deploy, no real GPS anti-cheat.

## What you can do

1. **Most Wanted** — browse Near me, Trending, and Comedy-fail awards. Featured seed job: **The Pigeon Job**.
2. **Plan the Job** — title, mastermind alias, 3–5 map pins, proof type per beat, Preview or Publish.
3. **Run** — outdoor UI with a live timer, current beat, primary proof CTA, expandable map strip, dismissible tip, and a Fail award path.
4. **Job Complete + Share** — elapsed time, style average, optional Best Fail / Legendary Fail award, Most Wanted rank (style-weighted, time tie-break). Export **Card A** (movie poster) and **Card C** (proof strip).

Proofs can come from the camera/file picker or a generated demo still so the loop works on a desktop.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43177](http://127.0.0.1:43177). The app is a portrait-first PWA-style shell (max width 430px). Landscape is used only for share-card export.

State lives in `localStorage` (`street-heists.v0`). Use **Reset the table** on the home screen to restore seed jobs.

## Stack

Next.js App Router, TypeScript, Tailwind, mocked local state. No auth, no backend, no live map provider.

## Design locks

Midnight Crew: keyhole mark, condensed display / serif titles / clean UI sans, `#0B0B0C` / `#161618` / `#C9A227` / `#8A6E2F` / `#C43C3C` / `#F2F0EA`. Difficulty is stars 1–5. Fail pills are awards, not status tags.
