import { isSoundCorkLink } from "@/lib/investigation";
import type {
  CaseFile,
  CaseProgress,
  ClueLink,
  CorkLink,
  DeductionChain,
  Evidence,
} from "@/lib/types";

export function normalizePair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export function pairKey(a: string, b: string): string {
  const [x, y] = normalizePair(a, b);
  return `${x}::${y}`;
}

export function clueLinkExists(links: ClueLink[], a: string, b: string): boolean {
  const key = pairKey(a, b);
  return links.some((link) => pairKey(link.a, link.b) === key);
}

export function isCorrectPairForChain(
  chain: DeductionChain,
  a: string,
  b: string,
): boolean {
  const key = pairKey(a, b);
  return (chain.correctPairs ?? []).some(
    ([pa, pb]) => pairKey(pa, pb) === key,
  );
}

/** Takeaways unlock after inspect — chains (not cork-to-suspect) gate Accuse. */
export function isDeductionUnlocked(
  _caseFile: CaseFile,
  progress: CaseProgress,
  evidence: Evidence,
): boolean {
  return progress.inspectedEvidenceIds.includes(evidence.id);
}

export function unlockedDeductionEvidenceIds(
  caseFile: CaseFile,
  progress: CaseProgress,
): string[] {
  return caseFile.evidence
    .filter((item) => isDeductionUnlocked(caseFile, progress, item))
    .map((item) => item.id);
}

function corkSatisfied(
  caseFile: CaseFile,
  links: CorkLink[],
  required: { evidenceId: string; suspectId: string },
): boolean {
  return links.some(
    (link) =>
      link.evidenceId === required.evidenceId &&
      link.suspectId === required.suspectId &&
      isSoundCorkLink(caseFile, link),
  );
}

function correctPairsSatisfied(
  chain: DeductionChain,
  clueLinks: ClueLink[],
): boolean {
  const pairs = chain.correctPairs ?? [];
  if (pairs.length === 0) return true;
  const need = chain.pairsRequired ?? pairs.length;
  let matched = 0;
  for (const [a, b] of pairs) {
    if (clueLinkExists(clueLinks, a, b)) matched += 1;
  }
  return matched >= need;
}

export function isDeductionChainUnlocked(
  caseFile: CaseFile,
  progress: CaseProgress,
  chain: DeductionChain,
): boolean {
  // Secured chains survive CLEAR YARN (yarn lines go; yellow notes stay).
  if ((progress.securedChainIds ?? []).includes(chain.id)) return true;

  const unlocked = new Set(unlockedDeductionEvidenceIds(caseFile, progress));
  if (!chain.requiredEvidenceIds.every((id) => unlocked.has(id))) return false;
  if (chain.unlockOnContradictionId) {
    if (!progress.foundContradictionIds.includes(chain.unlockOnContradictionId)) {
      return false;
    }
  }
  if (!correctPairsSatisfied(chain, progress.clueLinks ?? [])) return false;
  for (const required of chain.requiredCorkLinks ?? []) {
    if (!corkSatisfied(caseFile, progress.corkLinks, required)) return false;
  }
  return true;
}

export function unlockedDeductionChains(
  caseFile: CaseFile,
  progress: CaseProgress,
): DeductionChain[] {
  return (caseFile.deductionChains ?? []).filter((chain) =>
    isDeductionChainUnlocked(caseFile, progress, chain),
  );
}

export function chainsRequiredToAccuse(caseFile: CaseFile): number {
  const chains = caseFile.deductionChains ?? [];
  if (chains.length === 0) return 0;
  if (typeof caseFile.chainsRequiredToAccuse === "number") {
    return Math.max(0, Math.min(caseFile.chainsRequiredToAccuse, chains.length));
  }
  return chains.length;
}

/** Accuse / Decide endgame unlocks only after required deduction cards open. */
export function canAccuse(caseFile: CaseFile, progress: CaseProgress): boolean {
  const need = chainsRequiredToAccuse(caseFile);
  if (need === 0) return true;
  return unlockedDeductionChains(caseFile, progress).length >= need;
}

export type ClueLinkGrade = {
  sound: boolean;
  unlockedChainIds: string[];
  message: string;
  /** Why it failed, in plain English (misses only). */
  missReason?: string;
  /** What kind of pair to try next (misses only). */
  hint?: string;
};

function defaultMissHint(caseFile: CaseFile): string {
  const hints = (caseFile.deductionChains ?? [])
    .map((chain) => chain.missHint)
    .filter((item): item is string => Boolean(item));
  if (hints[0]) return hints[0];
  return "Try two clues that prove the same beat (trail → place, tool → who).";
}

/**
 * Grade a proposed clue link against any chain.
 * Invalid links are misses — callers must not wipe the board / inflate progress.
 */
export function gradeClueLink(
  caseFile: CaseFile,
  progress: CaseProgress,
  a: string,
  b: string,
): ClueLinkGrade {
  if (a === b) {
    return {
      sound: false,
      unlockedChainIds: [],
      message: "Need two different clues.",
      missReason: "Same pin twice.",
      hint: "Open one pin, then choose a second clue.",
    };
  }
  if (
    !progress.inspectedEvidenceIds.includes(a) ||
    !progress.inspectedEvidenceIds.includes(b)
  ) {
    return {
      sound: false,
      unlockedChainIds: [],
      message: "Inspect both clues in the Locker first.",
      missReason: "A pin isn’t filed yet.",
      hint: "Open each clue in the Locker, then link them here.",
    };
  }

  const chains = caseFile.deductionChains ?? [];
  const matching = chains.filter((chain) => isCorrectPairForChain(chain, a, b));
  if (matching.length === 0) {
    return {
      sound: false,
      unlockedChainIds: [],
      message: "No chain there — that pair doesn’t fit.",
      missReason: "Wrong pair.",
      hint: defaultMissHint(caseFile),
    };
  }

  const nextLinks: ClueLink[] = [
    ...(progress.clueLinks ?? []),
    { id: "preview", a, b, createdAt: Date.now() },
  ];
  const nextProgress = { ...progress, clueLinks: nextLinks };
  const newlyUnlocked = matching.filter(
    (chain) =>
      !isDeductionChainUnlocked(caseFile, progress, chain) &&
      isDeductionChainUnlocked(caseFile, nextProgress, chain),
  );

  if (newlyUnlocked.length > 0) {
    const need = chainsRequiredToAccuse(caseFile);
    const have =
      unlockedDeductionChains(caseFile, progress).length + newlyUnlocked.length;
    const celebrate =
      need > 0 && have >= need
        ? ` · Chain ${have}/${need} — Accuse unlocked`
        : ` · Chain ${have}/${need || have}`;
    return {
      sound: true,
      unlockedChainIds: newlyUnlocked.map((c) => c.id),
      message: `Chain unlocked: ${newlyUnlocked.map((c) => c.title).join(" · ")}${celebrate}`,
    };
  }

  return {
    sound: true,
    unlockedChainIds: [],
    message: "Nice — those clues go together.",
  };
}
