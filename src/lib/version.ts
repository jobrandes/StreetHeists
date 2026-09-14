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
  patch: 2,
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
