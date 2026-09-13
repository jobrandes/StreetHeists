# Street Heists

Street Heists is a short comedy-heist mystery for the phone. The splash home leads with the brand; the case board lives at `/cases`. Cases start easy and unlock harder ones only after a correct solve. Open a case, read a short story briefing, inspect clues, rebuild the scene on the desk as you key options, then make one Who / How / Where accusation.

**Jo's test clone:** [github.com/jobrandes/StreetHeists](https://github.com/jobrandes/StreetHeists). Agents must sync finished work to this GitHub repo whenever they push Cursor Origin — Origin and GitHub are not the same remote. See `docs/AGENT_NOTES.md`.

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

Every push to `main` can auto-rebuild. This is a private preview for testing, not a public launch.

## Product flow

- `/` — Case Board
- `/case/pigeon-job` — three-part Briefing
- `/case/pigeon-job/evidence` — provided evidence locker, deductions, and compare tray
- `/case/pigeon-job/accuse` — Who / How / Where accusation
- `/case/pigeon-job/verdict` — wrong-answer retry or solved result and share cards

Legacy `/heist/*`, `/run/*`, `/plan`, and `/complete` links redirect into the case flow.

## Stack and state

Next.js App Router, React, TypeScript, Tailwind CSS, and local browser storage. There is no authentication, backend, payment flow, or external service requirement. Case content and its correct solution are centralized in `src/lib/seed.ts`.
