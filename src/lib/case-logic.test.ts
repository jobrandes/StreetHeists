import { describe, expect, it } from "vitest";
import { compareLinks, linksForEvidence, suspectDossiers } from "./case-file";
import { pigeonCase } from "./seed";

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
