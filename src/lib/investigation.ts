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
