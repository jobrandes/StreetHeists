import { describe, expect, it } from "vitest";
import {
  isDeductionChainUnlocked,
  isDeductionUnlocked,
} from "@/lib/deduction";
import { lateFeeCase, pigeonCase } from "@/lib/seed";
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
  crackedConfrontationIds: [],
  confrontAttempts: 0,
  reconstructionPicks: {},
  accusationDraft: {
    whoEvidenceId: "",
    howEvidenceId: "",
    whereEvidenceId: "",
  },
  revealedConcealIds: [],
});

describe("deduction unlock", () => {
  it("unlocks tutorial deductions on inspect without cork", () => {
    const evidence = pigeonCase.evidence[0];
    const progress = emptyProgress();
    progress.inspectedEvidenceIds = [evidence.id];
    expect(isDeductionUnlocked(pigeonCase, progress, evidence)).toBe(true);
  });

  it("locks standard deductions until a sound cork link exists", () => {
    const evidence = lateFeeCase.evidence.find((item) => item.id === "tip-jar-video")!;
    const progress = emptyProgress();
    progress.inspectedEvidenceIds = [evidence.id];
    expect(isDeductionUnlocked(lateFeeCase, progress, evidence)).toBe(false);
    progress.corkLinks = [{ evidenceId: "tip-jar-video", suspectId: "paz" }];
    expect(isDeductionUnlocked(lateFeeCase, progress, evidence)).toBe(true);
  });

  it("unlocks the Late Fee false-lead chain after cork + contradiction", () => {
    const chain = lateFeeCase.deductionChains!.find((item) => item.id === "false-lead-collapses")!;
    const progress = emptyProgress();
    progress.inspectedEvidenceIds = ["paz-statement", "rita-timecard"];
    progress.corkLinks = [
      { evidenceId: "paz-statement", suspectId: "paz" },
      { evidenceId: "rita-timecard", suspectId: "rita" },
    ];
    expect(isDeductionChainUnlocked(lateFeeCase, progress, chain)).toBe(false);
    progress.foundContradictionIds = ["paz-vs-rita-clock"];
    expect(isDeductionChainUnlocked(lateFeeCase, progress, chain)).toBe(true);
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
