import type { CaseFile, CaseProgress } from "@/lib/types";

export type CaseStep = "briefing" | "locker" | "confront" | "scene" | "accuse";

export const CASE_STEPS: { id: CaseStep; label: string }[] = [
  { id: "briefing", label: "Briefing" },
  { id: "locker", label: "Locker" },
  { id: "confront", label: "Confront" },
  { id: "scene", label: "Scene" },
  { id: "accuse", label: "Accuse" },
];

/** Sticky destinations (briefing stays a back-link, not a tab). */
export const CASE_NAV: {
  id: Exclude<CaseStep, "briefing">;
  label: string;
  href: (caseId: string) => string;
}[] = [
  { id: "locker", label: "Locker", href: (caseId) => `/case/${caseId}/evidence` },
  { id: "confront", label: "Confront", href: (caseId) => `/case/${caseId}/confront` },
  { id: "scene", label: "Scene", href: (caseId) => `/case/${caseId}/reconstruct` },
  { id: "accuse", label: "Accuse", href: (caseId) => `/case/${caseId}/accuse` },
];

export function stepIndex(step: CaseStep): number {
  return CASE_STEPS.findIndex((item) => item.id === step);
}

export function caseJourneyStats(caseFile: CaseFile, progress: CaseProgress) {
  const clueTotal = caseFile.evidence.length;
  const cluesOpened = progress.inspectedEvidenceIds.length;
  const confrontTotal = caseFile.confrontations?.length ?? 0;
  const confrontCracked = progress.crackedConfrontationIds.length;
  const sceneTotal = caseFile.reconstruction.slots.length;
  const sceneFilled = caseFile.reconstruction.slots.filter((slot) =>
    Boolean(progress.reconstructionPicks[slot.id]),
  ).length;
  const corkLinks = progress.corkLinks.length;

  return {
    clueTotal,
    cluesOpened,
    confrontTotal,
    confrontCracked,
    sceneTotal,
    sceneFilled,
    corkLinks,
  };
}

export function progressStripCopy(
  step: CaseStep,
  caseFile: CaseFile,
  progress: CaseProgress,
): { stepLabel: string; detail: string } {
  const index = stepIndex(step) + 1;
  const total = CASE_STEPS.length;
  const stats = caseJourneyStats(caseFile, progress);
  const stepLabel = `Step ${index} of ${total} · ${CASE_STEPS[index - 1]?.label ?? ""}`;

  switch (step) {
    case "briefing":
      return { stepLabel, detail: "Read the beats, then work the locker." };
    case "locker":
      return {
        stepLabel,
        detail: `Clues ${stats.cluesOpened}/${stats.clueTotal} · Cork links ${stats.corkLinks}`,
      };
    case "confront":
      return {
        stepLabel,
        detail:
          stats.confrontTotal > 0
            ? `Confronted ${stats.confrontCracked}/${stats.confrontTotal} · Clues ${stats.cluesOpened}/${stats.clueTotal}`
            : `Clues ${stats.cluesOpened}/${stats.clueTotal}`,
      };
    case "scene":
      return {
        stepLabel,
        detail: `Theory draft ${stats.sceneFilled}/${stats.sceneTotal} · Clues ${stats.cluesOpened}/${stats.clueTotal}`,
      };
    case "accuse":
      return {
        stepLabel,
        detail: `Clues ${stats.cluesOpened}/${stats.clueTotal} · Confronted ${stats.confrontCracked}/${Math.max(stats.confrontTotal, 1)}`,
      };
  }
}

/** Soft-gate: thin file if few clues opened or no confrontations cracked. */
export function accuseLooksThin(caseFile: CaseFile, progress: CaseProgress): boolean {
  const stats = caseJourneyStats(caseFile, progress);
  const thinClues = stats.cluesOpened < Math.max(2, Math.ceil(stats.clueTotal / 2));
  const noConfront = stats.confrontTotal === 0 || stats.confrontCracked === 0;
  return thinClues || noConfront;
}
