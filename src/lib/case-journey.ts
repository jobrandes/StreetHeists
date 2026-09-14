import type { CaseFile, CaseProgress } from "@/lib/types";
import { canAccuse, chainsRequiredToAccuse, unlockedDeductionChains } from "@/lib/deduction";

/** Briefing is entry; Mosaic v0.2 rooms are Locker · Corkboard · Accuse. */
export type CaseStep = "briefing" | "locker" | "corkboard" | "accuse";

export const CASE_STEPS: { id: CaseStep; label: string }[] = [
  { id: "briefing", label: "Briefing" },
  { id: "locker", label: "Locker" },
  { id: "corkboard", label: "Corkboard" },
  { id: "accuse", label: "Accuse" },
];

/** Mosaic v0.2 top tabs — Map chrome intentionally dropped. */
export const CASE_NAV: {
  id: Exclude<CaseStep, "briefing">;
  label: string;
  href: (caseId: string) => string;
}[] = [
  { id: "locker", label: "Locker", href: (caseId) => `/case/${caseId}/evidence` },
  { id: "corkboard", label: "Corkboard", href: (caseId) => `/case/${caseId}/corkboard` },
  { id: "accuse", label: "Accuse", href: (caseId) => `/case/${caseId}/accuse` },
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
  const pins = progress.pinnedEvidenceIds.length;
  const chains = unlockedDeductionChains(caseFile, progress).length;

  return {
    clueTotal,
    cluesOpened,
    decideFilled,
    pins,
    chains,
    clueLinks: progress.clueLinks?.length ?? 0,
  };
}

export function progressStripCopy(
  step: CaseStep,
  caseFile: CaseFile,
  progress: CaseProgress,
): { stepLabel: string; detail: string } {
  const stats = caseJourneyStats(caseFile, progress);
  const need = chainsRequiredToAccuse(caseFile);
  const ready = canAccuse(caseFile, progress);

  switch (step) {
    case "briefing":
      return {
        stepLabel: "Briefing",
        detail: "Read the beats, then open the Locker for clues we give you.",
      };
    case "locker":
      return {
        stepLabel: "Locker",
        detail: `Clues filed ${stats.cluesOpened}/${stats.clueTotal} · pin them on the Corkboard`,
      };
    case "corkboard":
      return {
        stepLabel: "Corkboard",
        detail: ready
          ? `Stickies ${stats.chains}/${need || stats.chains} · Accuse unlocked`
          : `Pins ${stats.pins} · yarn ${stats.clueLinks} · need ${need} ${need === 1 ? "sticky" : "stickies"}`,
      };
    case "accuse":
      return {
        stepLabel: "Accuse",
        detail: ready
          ? `Clues filed ${stats.cluesOpened}/${stats.clueTotal} · fill Who / How / Where + proof`
          : `Locked until corkboard stickies unlock (${stats.chains}/${need})`,
      };
  }
}

/** Soft-gate: thin if few clues opened. */
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
