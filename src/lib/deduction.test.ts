import { describe, expect, it } from "vitest";
import {
  canAccuse,
  isDeductionChainUnlocked,
  isDeductionUnlocked,
} from "@/lib/deduction";
import { lateFeeCase, lastToastCase, pigeonCase } from "@/lib/seed";
import type { CaseProgress } from "@/lib/types";

const emptyProgress = (): CaseProgress => ({
  startedAt: null,
  inspectedEvidenceIds: [],
  pinnedEvidenceIds: [],
  wrongAttempts: 0,
  lastVerdict: null,
  custodyLog: [],
  discoveredHotspotIds: [],
  pendingAnalyses: [],
  completedAnalysisIds: [],
  foundContradictionIds: [],
  corkLinks: [],
  clueLinks: [],
  securedChainIds: [],
  crackedConfrontationIds: [],
  confrontAttempts: 0,
  reconstructionPicks: {},
  accusationDraft: {
    whoEvidenceId: "",
    howEvidenceId: "",
    whereEvidenceId: "",
  },
  revealedConcealIds: [],
  playerNotes: {},
});

describe("deduction unlock", () => {
  it("unlocks takeaways on inspect without cork", () => {
    const evidence = pigeonCase.evidence[0];
    const progress = emptyProgress();
    progress.inspectedEvidenceIds = [evidence.id];
    expect(isDeductionUnlocked(pigeonCase, progress, evidence)).toBe(true);
  });

  it("locks accuse on Pigeon until the tutorial chain is linked", () => {
    const progress = emptyProgress();
    progress.inspectedEvidenceIds = ["crumb-trail", "statue-nest"];
    expect(canAccuse(pigeonCase, progress)).toBe(false);
    progress.clueLinks = [
      { id: "1", a: "crumb-trail", b: "statue-nest", createdAt: 1 },
    ];
    expect(canAccuse(pigeonCase, progress)).toBe(true);
  });

  it("unlocks Late Fee false-lead chain after clue pair + contradiction", () => {
    const chain = lateFeeCase.deductionChains!.find(
      (item) => item.id === "false-lead-collapses",
    )!;
    const progress = emptyProgress();
    progress.inspectedEvidenceIds = ["paz-statement", "rita-timecard"];
    progress.clueLinks = [
      { id: "1", a: "paz-statement", b: "rita-timecard", createdAt: 1 },
    ];
    expect(isDeductionChainUnlocked(lateFeeCase, progress, chain)).toBe(false);
    progress.foundContradictionIds = ["paz-vs-rita-clock"];
    expect(isDeductionChainUnlocked(lateFeeCase, progress, chain)).toBe(true);
  });

  it("requires two Last Toast chains before accuse", () => {
    const progress = emptyProgress();
    progress.inspectedEvidenceIds = [
      "cctv-912",
      "cctv-916",
      "kitchen-ticket",
      "seating-chart",
    ];
    progress.clueLinks = [
      { id: "1", a: "cctv-912", b: "cctv-916", createdAt: 1 },
    ];
    progress.foundContradictionIds = ["toast-vs-ticket"];
    expect(canAccuse(lastToastCase, progress)).toBe(false);
    progress.clueLinks.push({
      id: "2",
      a: "kitchen-ticket",
      b: "cctv-912",
      createdAt: 2,
    });
    expect(canAccuse(lastToastCase, progress)).toBe(true);
  });
});

describe("accusation draft shape", () => {
  it("keeps proof ids on the progress draft object", () => {
    const progress = emptyProgress();
    progress.accusationDraft = {
      whoEvidenceId: "tip-jar-video",
      howEvidenceId: "tip-jar-video",
      whereEvidenceId: "grease-bin",
    };
    expect(progress.accusationDraft.whoEvidenceId).toBe("tip-jar-video");
    expect(progress.accusationDraft.whereEvidenceId).toBe("grease-bin");
  });
});
