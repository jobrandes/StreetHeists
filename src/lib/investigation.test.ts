import { describe, expect, it } from "vitest";
import {
  isAccusationCorrect,
  isSoundCorkLink,
  scoreAxis,
} from "./investigation";
import { lateFeeCase, pigeonCase } from "./seed";

describe("evidence-backed accusation scoring", () => {
  it("accepts the full correct accusation with proving exhibits", () => {
    const accusation = {
      who: pigeonCase.solution.who,
      how: pigeonCase.solution.how,
      where: pigeonCase.solution.where,
      whoEvidenceId: pigeonCase.solutionEvidence.who[0],
      howEvidenceId: pigeonCase.solutionEvidence.how[0],
      whereEvidenceId: pigeonCase.solutionEvidence.where[0],
    };
    const axis = scoreAxis(pigeonCase, accusation);
    expect(isAccusationCorrect(axis)).toBe(true);
  });

  it("fails when the suspect is right but the who-proof is wrong", () => {
    const accusation = {
      who: pigeonCase.solution.who,
      how: pigeonCase.solution.how,
      where: pigeonCase.solution.where,
      whoEvidenceId: "receipt",
      howEvidenceId: pigeonCase.solutionEvidence.how[0],
      whereEvidenceId: pigeonCase.solutionEvidence.where[0],
    };
    const axis = scoreAxis(pigeonCase, accusation);
    expect(axis.who).toBe(true);
    expect(axis.whoEvidence).toBe(false);
    expect(isAccusationCorrect(axis)).toBe(false);
  });
});

describe("corkboard link validation", () => {
  it("marks Marcel ↔ nest as sound", () => {
    expect(
      isSoundCorkLink(pigeonCase, {
        evidenceId: "statue-nest",
        suspectId: "marcel",
      }),
    ).toBe(true);
  });

  it("rejects an unsupported string", () => {
    expect(
      isSoundCorkLink(pigeonCase, {
        evidenceId: "receipt",
        suspectId: "marcel",
      }),
    ).toBe(false);
  });
});

describe("confrontations", () => {
  it("wires Marcel’s window claim to the feather exhibit", () => {
    const confrontation = pigeonCase.confrontations?.find(
      (item) => item.id === "marcel-window",
    );
    expect(confrontation?.correctEvidenceId).toBe("blue-feather");
  });

  it("wires Paz’s Rita claim to the depot card", () => {
    const confrontation = lateFeeCase.confrontations?.find(
      (item) => item.id === "paz-blames-rita",
    );
    expect(confrontation?.correctEvidenceId).toBe("rita-timecard");
  });
});

describe("solution evidence coverage", () => {
  it("lists proving exhibits for every axis on both cases", () => {
    for (const caseFile of [pigeonCase, lateFeeCase]) {
      expect(caseFile.solutionEvidence.who.length).toBeGreaterThan(0);
      expect(caseFile.solutionEvidence.how.length).toBeGreaterThan(0);
      expect(caseFile.solutionEvidence.where.length).toBeGreaterThan(0);
    }
  });
});
