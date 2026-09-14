import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Guardrail: public Midnight share cards must stay spoiler-safe.
 * Who / How / Where belong on the in-app verdict only.
 */
describe("Midnight share spoiler safety", () => {
  const source = readFileSync("src/components/share-cards.tsx", "utf8");

  it("never reads accusation or solution triad fields for card print", () => {
    expect(source).not.toMatch(/verdict\.accusation/);
    expect(source).not.toMatch(/caseFile\.solution/);
    expect(source).not.toMatch(/solution\.who|solution\.how|solution\.where/);
    expect(source).not.toMatch(/accusation\.who|accusation\.how|accusation\.where/);
  });

  it("ships seal + time + clean-solve payoff copy", () => {
    expect(source).toMatch(/Case closed/);
    expect(source).toMatch(/Clean solve/);
    expect(source).toMatch(/elapsedMs/);
    expect(source).toMatch(/wrongAttempts/);
    expect(source).toMatch(/Clean solve|Trophy/);
    expect(source).toMatch(/Case closed/);
    expect(source).toMatch(/spoiler-safe|Who \/ How \/ Where stay|never Who/i);
  });
});
