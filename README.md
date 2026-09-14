# Street Heists

Street Heists is a short comedy-heist mystery for the phone. The splash home leads with the brand; the case board lives at `/cases`. Cases start easy and unlock harder ones only after a correct solve.

**v0.3** — Corkboard deduction chains, flagship Late Fee stakes (rent + Rita’s badge), proof preserved on wrong accuse, richer inspect + share cards.

**Direction C flow:** Briefing → **Gather** (clues we give you: photos, docs, notes) → **Decide** (Who / How / Where + attach proof → Accuse). Tap **Case file** anytime for a running sheet that auto-keeps takeaways. Phone text defaults larger; toggle Large / Comfortable on home and the case board.

Playable cases: **The Pigeon Job** (tutorial), **The Late Fee** (clock contradiction · real stakes), **The Velvet Teaspoon** (place-card fraud + lipstick ID), **Murder on the Dessert Trolley** (route timing + diversion).

**Jo’s test clone:** [github.com/jobrandes/StreetHeists](https://github.com/jobrandes/StreetHeists). Agents must sync finished work to this GitHub repo whenever they push Cursor Origin — Origin and GitHub are not the same remote. See `docs/AGENT_NOTES.md`.

The seed mystery, **The Pigeon Job**, is a complete 5–10 minute case with six evidence items, four suspects, retry-aware verdicts, and two exportable Midnight Crew share cards.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm ci
npm run dev
```

Open [http://127.0.0.1:43177](http://127.0.0.1:43177).

Product roadmap: [`docs/ROADMAP.md`](./docs/ROADMAP.md).

Quality checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

CI runs those checks on every push/PR. Desktop uses an intentional phone-stage frame over a cool paper wash; phones stay full-bleed B2 paper (`#EEF2F6`). Pinch-zoom is allowed.

## Phone preview (Netlify)

Easiest way to open the app on your phone: deploy a preview from GitHub.

1. Go to [app.netlify.com](https://app.netlify.com) and sign in (GitHub is fine).
2. **Add new site → Import an existing project → GitHub**.
3. Pick `jobrandes/StreetHeists`.
4. Leave the defaults (build: `npm run build`, plugin handles Next.js) and deploy.

Netlify will give you a URL like `https://something.netlify.app`. Open that on your phone — no same-Wi‑Fi dance.

Every push to `main` can auto-rebuild. Blessed production phone preview: [https://streetheists.netlify.app](https://streetheists.netlify.app).

## Product flow

- `/` — Case Board
- `/case/pigeon-job` — Briefing
- `/case/pigeon-job/evidence` — **Gather** (provided clues + corkboard)
- `/case/pigeon-job/accuse` — **Decide** (Who / How / Where + proof)
- `/case/pigeon-job/verdict` — retry or solved + share cards

Confront / reconstruct URLs redirect into Gather / Decide.

Legacy `/heist/*`, `/run/*`, `/plan`, and `/complete` links redirect into the case flow.

## Stack and state

Next.js App Router, React, TypeScript, Tailwind CSS, and local browser storage. There is no authentication, backend, payment flow, or external service requirement. Case content and its correct solution are centralized in `src/lib/seed.ts`.
