/**
 * App version — bump this when shipping player-facing updates.
 *
 * MAJOR.MINOR.PATCH (semver-ish for Street Heists):
 * - MAJOR — big product reset / incompatible flow change
 * - MINOR — new cases, rooms, or meaningful features
 * - PATCH — copy, bugfixes, polish
 *
 * Keep `updatedOn` as the ship date (YYYY-MM-DD) and add a short note to `updates`.
 * Also bump `package.json` `"version"` to match.
 */

export const APP_VERSION = {
  major: 0,
  minor: 5,
  patch: 11,
  /** ISO date of this release */
  updatedOn: "2026-09-14",
} as const;

export type VersionNote = {
  version: string;
  date: string;
  note: string;
};

/** Newest first — keep this short; the stamp only shows the tip. */
export const VERSION_UPDATES: VersionNote[] = [
  {
    version: "0.5.11",
    date: "2026-09-14",
    note: "Corkboard teaching pass: Open pin → Link → second clue; Chains x/N (not yarn attempts); miss hints; CLEAR YARN; Pigeon rails; Accuse lock copy; Start tutorial primary.",
  },
  {
    version: "0.5.10",
    date: "2026-09-14",
    note: "iPad composition: corkboard two-column on tablet, denser chrome, board is the main surface — not a stretched phone stack.",
  },
  {
    version: "0.5.9",
    date: "2026-09-14",
    note: "iPad layout for real: widen from 600px (iPad Mini sits under Tailwind md), full-bleed tablet shell instead of phone column.",
  },
  {
    version: "0.5.8",
    date: "2026-09-14",
    note: "Tutorial corkboard example: named pair (Crumb Trail ↔ Fountain Telephoto), Hang / Connect-for-me CTAs, Example badges.",
  },
  {
    version: "0.5.7",
    date: "2026-09-14",
    note: "iPad layout: widen case shell past 430px phone column, bigger corkboard + touch targets.",
  },
  {
    version: "0.5.6",
    date: "2026-09-14",
    note: "Corkboard guided mode: one step at a time, tap-two-clues connect, wrong pairs don’t stick, Accuse when yellow note unlocks.",
  },
  {
    version: "0.5.5",
    date: "2026-09-14",
    note: "Corkboard clarity: red dots = pins, yarn connects clues, stickies unlock Accuse; String yarn mode + plain coach copy.",
  },
  {
    version: "0.5.4",
    date: "2026-09-14",
    note: "Final Case Board SoT: Featured Last Toast + Tutorial Pigeon START HERE, NO MAP; pigeon still uses seed location/caption.",
  },
  {
    version: "0.5.3",
    date: "2026-09-14",
    note: "Prism lock: Start Here → Pigeon tutorial; Last Toast 21:47 glass hide vs alibi; public share stays spoiler-safe.",
  },
  {
    version: "0.5.2",
    date: "2026-09-14",
    note: "Mosaic Last Toast case board + inspect alibi chrome; public share SoT (CASE CLOSED / time / Clean Solve / seal, no triad).",
  },
  {
    version: "0.5.1",
    date: "2026-09-14",
    note: "Stronger Midnight share: CASE CLOSED seal + corkboard yarn + trophy moment. Public cards stay spoiler-safe (no Who/How/Where).",
  },
  {
    version: "0.5.0",
    date: "2026-09-14",
    note: "Mosaic v0.2 corkboard: Locker | Corkboard | Accuse, red-yarn chains, sticky deductions, pin detail sheet. Prism brief kept.",
  },
  {
    version: "0.4.0",
    date: "2026-09-14",
    note: "PRISM Formal: clue-pair corkboard, accuse locked on chains, The Last Toast flagship, spoiler-safe Midnight share.",
  },
  {
    version: "0.3.0",
    date: "2026-09-14",
    note: "Corkboard deduction chains, Late Fee stakes, proof-preserve on wrong accuse, richer inspect + share payoff.",
  },
  {
    version: "0.2.0",
    date: "2026-09-14",
    note: "Gather/Decide flow, Case file, Velvet Teaspoon + Dessert Trolley, clearer clue finish.",
  },
  {
    version: "0.1.0",
    date: "2026-09-11",
    note: "First playable build — Pigeon Job tutorial.",
  },
];

export function versionLabel(): string {
  const { major, minor, patch } = APP_VERSION;
  return `${major}.${minor}.${patch}`;
}

/** Compact stamp: v0.2.0 · Sep 14 */
export function versionStampLabel(): string {
  const date = formatShortDate(APP_VERSION.updatedOn);
  return `v${versionLabel()} · ${date}`;
}

function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[month - 1]} ${day}`;
}

/** Synced teaching pass v0.5.11 → GitHub main via one push_files call with all 12 full file contents. */
