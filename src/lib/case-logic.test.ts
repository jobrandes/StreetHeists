import { describe, expect, it } from "vitest";
import { compareLinks, linksForEvidence, suspectDossiers } from "./case-file";
import { lateFeeCase, pigeonCase, playableCases } from "./seed";

describe("The Pigeon Job solution", () => {
  it("has a coherent who/how/where solution", () => {
    const { solution, suspects, howChoices, whereChoices } = pigeonCase;
    expect(suspects.some((s) => s.id === solution.who)).toBe(true);
    expect(howChoices.some((c) => c.id === solution.how)).toBe(true);
    expect(whereChoices.some((c) => c.id === solution.where)).toBe(true);
  });

  it("marks Marcel as the culprit with window-cord and statue-nest", () => {
    expect(pigeonCase.solution).toEqual({
      who: "marcel",
      how: "window-cord",
      where: "statue-nest",
    });
  });
});

describe("accusation scoring", () => {
  function score(who: string, how: string, where: string) {
    const s = pigeonCase.solution;
    return who === s.who && how === s.how && where === s.where;
  }

  it("accepts the correct accusation", () => {
    expect(score("marcel", "window-cord", "statue-nest")).toBe(true);
  });

  it("rejects a wrong who", () => {
    expect(score("celine", "window-cord", "statue-nest")).toBe(false);
  });

  it("rejects a wrong how", () => {
    expect(score("marcel", "inside-job", "statue-nest")).toBe(false);
  });
});

describe("evidence links", () => {
  it("links Marcel to the nest still", () => {
    const nest = pigeonCase.evidence.find((e) => e.id === "statue-nest");
    expect(nest).toBeTruthy();
    const links = linksForEvidence(pigeonCase, nest!);
    expect(links.people.map((p) => p.id)).toContain("marcel");
    expect(links.place).toBe(nest!.location);
  });

  it("surfaces Marcel as a shared compare link across feather + nest", () => {
    const items = pigeonCase.evidence.filter((e) =>
      ["blue-feather", "statue-nest"].includes(e.id),
    );
    const { board } = compareLinks(pigeonCase, items);
    const marcel = board.find((l) => l.kind === "person" && l.id === "marcel");
    expect(marcel?.shared).toBe(true);
    expect(marcel?.evidenceIds.length).toBeGreaterThanOrEqual(2);
  });

  it("builds suspect dossiers with linked clues", () => {
    const marcel = suspectDossiers(pigeonCase).find((s) => s.id === "marcel");
    expect(marcel?.linkedClues.length).toBeGreaterThan(0);
  });
});

describe("evidence how/where hints", () => {
  it("attaches howHint and whereHint on every clue", () => {
    for (const item of pigeonCase.evidence) {
      expect(item.howHint?.length).toBeGreaterThan(0);
      expect(item.whereHint?.length).toBeGreaterThan(0);
    }
  });

  it("points feather how toward the awning cord", () => {
    const feather = pigeonCase.evidence.find((e) => e.id === "blue-feather");
    expect(feather?.howHint?.toLowerCase()).toMatch(/cord|awning/);
  });

  it("points nest where toward the statue", () => {
    const nest = pigeonCase.evidence.find((e) => e.id === "statue-nest");
    expect(nest?.whereHint?.toLowerCase()).toMatch(/statue|nest|fountain/);
  });
});



describe("The Late Fee solution", () => {
  it("is registered as a playable case", () => {
    expect(playableCases.map((item) => item.id)).toContain(lateFeeCase.id);
  });

  it("has a coherent who/how/where solution", () => {
    const { solution, suspects, howChoices, whereChoices } = lateFeeCase;
    expect(suspects.some((s) => s.id === solution.who)).toBe(true);
    expect(howChoices.some((c) => c.id === solution.how)).toBe(true);
    expect(whereChoices.some((c) => c.id === solution.where)).toBe(true);
  });

  it("marks Paz as the culprit via vest-key ruse and grease-bin stash", () => {
    expect(lateFeeCase.solution).toEqual({
      who: "paz",
      how: "vest-key-ruse",
      where: "grease-bin",
    });
  });

  it("uses a witness contradiction: Paz blames Rita, depot card clears Rita", () => {
    const statement = lateFeeCase.evidence.find((e) => e.id === "paz-statement");
    const timecard = lateFeeCase.evidence.find((e) => e.id === "rita-timecard");
    expect(statement?.linkedSuspectIds).toEqual(expect.arrayContaining(["paz", "rita"]));
    expect(timecard?.linkedSuspectIds).toEqual(expect.arrayContaining(["rita"]));
    expect(timecard?.deduction.toLowerCase()).toMatch(/rita|cannot|collapse|clear/);
  });

  it("attaches how/where hints on every clue", () => {
    for (const item of lateFeeCase.evidence) {
      expect(item.howHint?.length).toBeGreaterThan(0);
      expect(item.whereHint?.length).toBeGreaterThan(0);
    }
  });
});
