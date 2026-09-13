import type {
  Accusation,
  CaseFile,
  CorkLink,
  Verdict,
  VerdictAxis,
} from "./types";

export function scoreAxis(
  caseFile: CaseFile,
  accusation: Accusation,
): VerdictAxis {
  const { solution, solutionEvidence } = caseFile;
  return {
    who: accusation.who === solution.who,
    how: accusation.how === solution.how,
    where: accusation.where === solution.where,
    whoEvidence: solutionEvidence.who.includes(accusation.whoEvidenceId),
    howEvidence: solutionEvidence.how.includes(accusation.howEvidenceId),
    whereEvidence: solutionEvidence.where.includes(accusation.whereEvidenceId),
  };
}

export function isAccusationCorrect(axis: VerdictAxis): boolean {
  return (
    axis.who &&
    axis.how &&
    axis.where &&
    axis.whoEvidence &&
    axis.howEvidence &&
    axis.whereEvidence
  );
}

export function buildVerdict(
  accusation: Accusation,
  axis: VerdictAxis,
  submittedAt: number,
  startedAt: number | null,
  wrongAttempts: number,
): Verdict {
  return {
    accusation,
    correct: isAccusationCorrect(axis),
    submittedAt,
    elapsedMs: submittedAt - (startedAt ?? submittedAt),
    wrongAttempts,
    axis,
  };
}

export function isSoundCorkLink(caseFile: CaseFile, link: CorkLink): boolean {
  const evidence = caseFile.evidence.find((item) => item.id === link.evidenceId);
  return evidence?.linkedSuspectIds?.includes(link.suspectId) ?? false;
}

export function evidenceTitle(caseFile: CaseFile, evidenceId: string): string {
  return (
    caseFile.evidence.find((item) => item.id === evidenceId)?.title ?? evidenceId
  );
}

export function hotspotKey(evidenceId: string, hotspotId: string): string {
  return `${evidenceId}:${hotspotId}`;
}

export function difficultyLabel(
  difficulty: CaseFile["difficulty"],
): string {
  switch (difficulty) {
    case "tutorial":
      return "Tutorial";
    case "standard":
      return "Standard";
    case "hard":
      return "Hard";
  }
}

/** Case opens only after the prior case (if any) was solved correctly. */
export function isCaseUnlocked(
  caseFile: CaseFile,
  progressByCase: Record<string, { lastVerdict?: { correct: boolean } | null }>,
): boolean {
  if (!caseFile.unlockAfterCaseId) return true;
  return Boolean(progressByCase[caseFile.unlockAfterCaseId]?.lastVerdict?.correct);
}

export function reconstructionScore(
  caseFile: CaseFile,
  picks: Record<string, string>,
): { filled: number; total: number; correct: number; complete: boolean; perfect: boolean } {
  const slots = caseFile.reconstruction.slots;
  const total = slots.length;
  let filled = 0;
  let correct = 0;
  for (const slot of slots) {
    const pick = picks[slot.id];
    if (!pick) continue;
    filled += 1;
    if (pick === slot.correctOptionId) correct += 1;
  }
  return {
    filled,
    total,
    correct,
    complete: filled === total,
    perfect: filled === total && correct === total,
  };
}

export function sceneLinesForPicks(
  caseFile: CaseFile,
  picks: Record<string, string>,
): string[] {
  const lines: string[] = [];
  for (const slot of caseFile.reconstruction.slots) {
    const pick = picks[slot.id];
    if (!pick) continue;
    const line = slot.sceneLineByOption[pick];
    if (line) lines.push(line);
  }
  return lines;
}
