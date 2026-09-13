import type { CaseFile, CaseProgress } from "@/lib/types";

/** Direction C — two rooms only (briefing is entry, not a room tab). */
export type CaseStep = "briefing" | "gather" | "decide";

export const CASE_STEPS: { id: CaseStep; label: string }[] = [
  { id: "briefing", label: "Briefing" },
  { id: "gather", label: "Gather" },
  { id: "decide", label: "Decide" },
];

/** Top-room switcher destinations. */
export const CASE_NAV: {
  id: Exclude<CaseStep, "briefing">;
  label: string;
  href: (caseId: string) => string;
}[] = [
  { id: "gather", label: "Gather", href: (caseId) => `/case/${caseId}/evidence` },
  { id: "decide", label: "Decide", href: (caseId) => `/case/${caseId}/accuse` },
];

export function stepIndex(step: CaseStep): number {
  return CASE_STEPS.findIndex((item) => item.id === step);
}

export function caseJourneyStats(caseFile: CaseFile, progress: CaseProgress) {
  const clueTotal = caseFile.evidence.length;
  const cluesOpened = progress.inspectedEvidenceIds.length;
  const decideFilled = ["who", "how", "where"].filter((slot) =>
    Boolean(progress.reconstructionPicks[slot] || false),
  ).length;
  // Prefer reconstruction picks; accuse page also tracks local picks.
  const corkLinks = progress.corkLinks.length;

  return {
    clueTotal,
    cluesOpened,
    decideFilled,
    corkLinks,
  };
}

export function progressStripCopy(
  step: CaseStep,
  caseFile: CaseFile,
  progress: CaseProgress,
): { stepLabel: string; detail: string } {
  const stats = caseJourneyStats(caseFile, progress);

  switch (step) {
    case "briefing":
      return {
        stepLabel: "Briefing",
        detail: "Read the beats, then Gather clues we give you.",
      };
    case "gather":
      return {
        stepLabel: "Gather",
        detail: `Clues filed ${stats.cluesOpened}/${stats.clueTotal} · then Decide`,
      };
    case "decide":
      return {
        stepLabel: "Decide",
        detail: `Clues filed ${stats.cluesOpened}/${stats.clueTotal} · fill Who / How / Where + proof`,
      };
  }
}

/** Soft-gate: thin if few clues opened (confront is optional in Direction C). */
export function accuseLooksThin(caseFile: CaseFile, progress: CaseProgress): boolean {
  const stats = caseJourneyStats(caseFile, progress);
  return stats.cluesOpened < Math.max(2, Math.ceil(stats.clueTotal / 2));
}

export function evidenceKindLabel(kind: CaseFile["evidence"][number]["kind"]): string {
  switch (kind) {
    case "still":
      return "Photo";
    case "document":
      return "Doc";
    case "note":
      return "Note";
  }
}
