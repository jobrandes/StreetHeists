import type { CasePack, DeductionChain } from "./types";

/** True if `path` is exactly the chain's ordered clue ids (same length, same order). */
export function pathMatchesChain(path: string[], chain: DeductionChain): boolean {
  if (path.length !== chain.orderedClueIds.length) return false;
  return chain.orderedClueIds.every((id, i) => id === path[i]);
}

/** First incomplete chain whose ordered path equals `path`, or null. */
export function findMatchingIncompleteChain(
  casePack: CasePack,
  path: string[],
  completedChainIds: string[],
): DeductionChain | null {
  const done = new Set(completedChainIds);
  for (const chain of casePack.deductionChains ?? []) {
    if (done.has(chain.id)) continue;
    if (pathMatchesChain(path, chain)) return chain;
  }
  return null;
}

export type ChainProgress = {
  completed: number;
  total: number;
  /** True when every defined chain is secured (or there are no chains). */
  allComplete: boolean;
};

export function getChainProgress(casePack: CasePack, completedChainIds: string[]): ChainProgress {
  const total = casePack.deductionChains?.length ?? 0;
  const completed = completedChainIds.filter((id) =>
    (casePack.deductionChains ?? []).some((c) => c.id === id),
  ).length;
  return {
    completed,
    total,
    allComplete: total === 0 || completed >= total,
  };
}

/** Human-readable miss copy when a yarn path does not match any incomplete chain. */
export function yarnMissHint(casePack: CasePack, path: string[], completedChainIds: string[]): string {
  const chains = (casePack.deductionChains ?? []).filter((c) => !completedChainIds.includes(c.id));
  if (chains.length === 0) {
    return "No open chains left — you already secured every deduction on this board.";
  }
  if (path.length < 2) {
    return "Need at least two pins in order. Open a pin, tap Link, then open the next clue.";
  }

  const exactLen = chains.filter((c) => c.orderedClueIds.length === path.length);
  if (exactLen.length === 0) {
    const lengths = [...new Set(chains.map((c) => c.orderedClueIds.length))].sort((a, b) => a - b);
    return `That path has ${path.length} pin${path.length === 1 ? "" : "s"}. Open chains need ${lengths.join(" or ")} in the right order — try CLEAR YARN and rebuild.`;
  }

  // Same length as at least one chain but wrong order / wrong pins
  const sample = exactLen[0]!;
  return `Close — ${sample.orderedClueIds.length} pins is the right length for “${sample.title},” but the order or clues don’t match. CLEAR YARN and follow the chain’s sequence.`;
}
