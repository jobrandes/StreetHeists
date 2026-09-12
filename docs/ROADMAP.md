# Street Heists — Roadmap to App Store

From single-case demo to a game you could actually sell.

## Phase 1: Prove the Loop (Content & Core Gameplay)

**Goal:** Get enough real content and variety to know if this is actually fun beyond one case.

- Build out to 8–12 launch cases (not just "coming soon" teasers)
- Vary mechanics between cases — not just new character names on the same puzzle shape:
  - Physical evidence puzzles
  - Witness statement contradictions
  - Timeline/alibi puzzles
  - Occasional red herrings / false leads
- Design a difficulty curve: tutorial case → escalating mid-tier → one genuinely hard "master case"
- Playtest with a few real strangers (not just yourself) — watch where they get stuck or bored
- Fix the CI lockfile issue (land full `package-lock.json`, drop the `npm install` fallback)
- Confirm Next/React versions are stable releases, not canary tags
- Evidence art must fail the build if missing (no silent placeholders in production)

**Exit criteria:** A real library of cases, and outside playtesters genuinely want to keep playing.

## Phase 2: Make It a Habit (Retention & Progression)

**Goal:** Give people a reason to open the app again tomorrow, not just once.

- Detective rank / XP system that persists across cases
- Streaks or a "case of the week" rotation
- Push notifications for new case drops (requires native wrapper — see Phase 3)
- Double down on the share-card feature — make results genuinely fun to post
- Basic analytics: which cases people finish, where they quit, replay rate
- Sound design / haptics pass — small but makes solving a case feel satisfying

**Exit criteria:** People come back on their own, and you have data on what's working.

## Phase 3: Store-Ready Packaging (Ship It)

**Goal:** Get from "web app on Netlify" to something the App Store will accept.

- Pick a wrap strategy:
  - **Capacitor/Expo wrap** of existing React code (fastest, reuses everything) — recommended first move
  - vs. full React Native rebuild (more native feel, much more work — revisit only if Phase 1–2 prove demand)
- Real device testing across screen sizes, notches, safe areas
- Privacy policy page (required even with zero backend/accounts)
- App Store age rating questionnaire
- Pick **ONE** monetization model, don't blend:
  - Free tutorial + paid case packs, or
  - One flat purchase for everything, or
  - Monthly subscription for new cases (needs a steady content pipeline)
- TestFlight beta with real strangers before public submission
- App Store listing: screenshots, description, keywords

**Exit criteria:** Submitted to App Store review.

## Evidence art rule (locked)

Street Heists is a **detective desk**: players read notes **and** look at case-file images, then tie both together.

- Every clue gets **its own** image — never reuse art across cases or across unrelated clues.
- If a detail matters to the solution, it must be **visible in the image** and restated in the text (`visualTell` + description).
- Images are not decoration. They are evidence you inspect.

## Current focus

Phase 1 content: Case 07 + Case 08 are playable with per-clue readable art. Next: more mechanic variety toward 8–12 cases, then stranger playtests.
