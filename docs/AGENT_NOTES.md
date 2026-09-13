# Agent / contributor notes

## Remotes

- **Cursor Origin** is where cloud agents commit by default.
- **Jo’s test clone** is [github.com/jobrandes/StreetHeists](https://github.com/jobrandes/StreetHeists).
- These are **not** the same remote. After finishing work, sync the same tree to GitHub `main` (GitHub MCP `push_files` or a configured `github` remote). Tell Jo to `git pull`.

## Product locks (Direction C)

- Couch crime-puzzle: Case Board → Briefing → **Gather** → **Decide** → Verdict.
- Only two case rooms. Case file holds memory. No Locker/Confront/Scene/Binder tab chrome.
- Comedy tone is a strategic bar — rewrite weak jokes; don’t ship competent-but-flat lines.
- Every new case must match the Gather/Decide `CaseFile` shape used by `pigeon-job` and `late-fee`.
- Distinct mechanical hook per case; unlock via `unlockAfterCaseId`.
- No player camera, uploads, walking, or GPS.

## Quality gate

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

CI runs `npm ci` only (full `package-lock.json` required — no `npm install` fallback).

## Evidence assets

- Each clue has unique `imageSrc` / `imageStamp` / `visualTell` in case seed data.
- Art lives under `public/evidence/<case-id>/…` — **never reuse** a file across clues.
- Prefer complete files on disk (jpg/png/svg). Do not leave partial/chunked WIP assets on `main`.
- `prebuild` (`scripts/assemble-evidence.mjs`) validates every `imageSrc` and **fails** if missing, tiny, placeholder, or reused.

## Judgment calls

Flag in the commit message when you invent comedy, difficulty curve, or a new puzzle hook Jo should review.
