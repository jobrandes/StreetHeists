import { describe, expect, it } from "vitest";
import {
  isAccusationCorrect,
  isCaseUnlocked,
  isSoundCorkLink,
  reconstructionScore,
  sceneLinesForPicks,
  scoreAxis,
} from "./investigation";
import { lateFeeCase, lastToastCase, pigeonCase } from "./seed";

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

describe("difficulty unlocks", () => {
  it("keeps the tutorial open with no prior case", () => {
    expect(isCaseUnlocked(pigeonCase, {})).toBe(true);
  });

  it("locks The Last Toast until The Pigeon Job is solved correctly", () => {
    expect(isCaseUnlocked(lastToastCase, {})).toBe(false);
    expect(
      isCaseUnlocked(lastToastCase, {
        "pigeon-job": { lastVerdict: { correct: false } },
      }),
    ).toBe(false);
    expect(
      isCaseUnlocked(lastToastCase, {
        "pigeon-job": { lastVerdict: { correct: true } },
      }),
    ).toBe(true);
  });

  it("locks The Late Fee until The Last Toast is solved correctly", () => {
    expect(isCaseUnlocked(lateFeeCase, {})).toBe(false);
    expect(
      isCaseUnlocked(lateFeeCase, {
        "pigeon-job": { lastVerdict: { correct: true } },
      }),
    ).toBe(false);
    expect(
      isCaseUnlocked(lateFeeCase, {
        "pigeon-job": { lastVerdict: { correct: true } },
        "last-toast": { lastVerdict: { correct: true } },
      }),
    ).toBe(true);
  });
});

describe("scene reconstruction", () => {
  it("scores picks and builds live scene lines", () => {
    const picks = {
      who: "marcel",
      how: "window-cord",
      where: "statue-nest",
    };
    const score = reconstructionScore(pigeonCase, picks);
    expect(score).toMatchObject({
      filled: 3,
      total: 3,
      correct: 3,
      complete: true,
      perfect: true,
    });
    const lines = sceneLinesForPicks(pigeonCase, picks);
    expect(lines).toHaveLength(3);
    expect(lines[0]).toMatch(/pigeon/i);
  });

  it("does not count empty slots as correct", () => {
    const score = reconstructionScore(pigeonCase, { who: "celine" });
    expect(score.filled).toBe(1);
    expect(score.correct).toBe(0);
    expect(score.complete).toBe(false);
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
