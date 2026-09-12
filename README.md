# Street Heists

Street Heists is a short comedy-heist mystery for the phone. Open a case, inspect the clues supplied by the game, pin deductions, compare evidence, and make one Who / How / Where accusation.

**Jo’s test clone:** [github.com/jobrandes/StreetHeists](https://github.com/jobrandes/StreetHeists). Agents must sync finished work to this GitHub repo whenever they push Cursor Origin — Origin and GitHub are not the same remote. See `docs/AGENT_NOTES.md`.

The seed mystery, **The Pigeon Job**, is a complete 5–10 minute case with six evidence items, four suspects, retry-aware verdicts, and two exportable Midnight Crew share cards.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43177](http://127.0.0.1:43177).

Quality checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

CI runs those checks on every push/PR. Desktop uses an intentional phone-stage frame over a dark plaza wash; phones stay full-bleed cream. Pinch-zoom is allowed.

## Product flow

- `/` — Case Board
- `/case/pigeon-job` — three-part Briefing
- `/case/pigeon-job/evidence` — provided evidence locker, deductions, and compare tray
- `/case/pigeon-job/accuse` — Who / How / Where accusation
- `/case/pigeon-job/verdict` — wrong-answer retry or solved result and share cards

Legacy `/heist/*`, `/run/*`, `/plan`, and `/complete` links redirect into the case flow.

## Stack and state

Next.js App Router, React, TypeScript, Tailwind CSS, and local browser storage. There is no authentication, backend, payment flow, or external service requirement. Case content and its correct solution are centralized in `src/lib/seed.ts`.
