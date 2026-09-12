# Agent / contributor notes

## Remotes

- **Cursor Origin** is where cloud agents commit by default.
- **Jo’s test clone** is [github.com/jobrandes/StreetHeists](https://github.com/jobrandes/StreetHeists).
- These are **not** the same remote. After finishing work, sync the same tree to GitHub `main` (GitHub MCP `push_files` or a configured `github` remote). Tell Jo to `git pull`.

## Product locks

- Couch crime-puzzle: Case Board → Briefing → Evidence Locker → Accuse → Verdict.
- No player camera, uploads, walking, or GPS.
- Play Day B2 cool paper on play screens (`#EEF2F6`); Midnight Crew only on solved share cards.
- Seed case: The Pigeon Job (`src/lib/seed.ts`).

## Quality gate

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

CI runs the same checks on every push/PR (`.github/workflows/ci.yml`).

## Stack

Next.js 16.3.x + React 19.2.x are intentional stable releases (not canaries).

## Speed rule

If GitHub MCP sync, image compression, or any single path spins past a few minutes without shipping, **stop and switch tactics** (smaller assets, direct file update, skip non-blocking polish). Do not wait for Jo to notice the stall.

## Always watch deploys

After every GitHub sync that should ship, **immediately check**:
1. GitHub Actions CI on `main` (must be green)
2. Netlify deploy / live asset sizes (e.g. evidence SVGs not 11-byte placeholders)

Do not wait for Jo to notice a red build.
