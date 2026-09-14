import { isSoundCorkLink } from "@/lib/investigation";
import type {
  CaseFile,
  CaseProgress,
  CorkLink,
  DeductionChain,
  Evidence,
} from "@/lib/types";

/** Tutorial teaches corkboard without hard-gating takeaways. */
export function isDeductionUnlocked(
  caseFile: CaseFile,
  progress: CaseProgress,
  evidence: Evidence,
): boolean {
  if (!progress.inspectedEvidenceIds.includes(evidence.id)) return false;
  if (caseFile.difficulty === "tutorial") return true;
  const linked = evidence.linkedSuspectIds ?? [];
  if (linked.length === 0) return true;
  return progress.corkLinks.some(
    (link) =>
      link.evidenceId === evidence.id &&
      linked.includes(link.suspectId) &&
      isSoundCorkLink(caseFile, link),
  );
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

export function isDeductionChainUnlocked(
  caseFile: CaseFile,
  progress: CaseProgress,
  chain: DeductionChain,
): boolean {
  const unlocked = new Set(unlockedDeductionEvidenceIds(caseFile, progress));
  if (!chain.requiredEvidenceIds.every((id) => unlocked.has(id))) return false;
  if (chain.unlockOnContradictionId) {
    if (!progress.foundContradictionIds.includes(chain.unlockOnContradictionId)) {
      return false;
    }
  }
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
