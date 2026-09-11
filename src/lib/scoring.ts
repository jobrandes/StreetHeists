import { average } from "./utils";
import type { CompletedRun, FailAward, Proof } from "./types";

export function styleAverage(proofs: Proof[]) { return Number(average(proofs.map((proof) => proof.style)).toFixed(2)); }
export function awardWeight(award: FailAward | null) {
  if (award === "Legendary Fail") return 0.4;
  if (award === "Best Fail") return 0.2;
  return 0;
}
export function styleWeightedScore(run: Pick<CompletedRun, "styleAvg" | "failAward">) { return run.styleAvg + awardWeight(run.failAward); }
export function rankRuns(runs: CompletedRun[]) {
  return [...runs].sort((a, b) => {
    const scoreDelta = styleWeightedScore(b) - styleWeightedScore(a);
    if (scoreDelta !== 0) return scoreDelta;
    return a.elapsedMs - b.elapsedMs;
  });
}
export function assignRanks(runs: CompletedRun[]): CompletedRun[] { return rankRuns(runs).map((run, index) => ({ ...run, wantedRank: index + 1 })); }
export function pickHeroProof(proofs: Proof[]) { return proofs.length ? [...proofs].sort((a, b) => b.style - a.style)[0] : null; }
