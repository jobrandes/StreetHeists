import { dessertTrolleyCase } from "@/lib/cases/dessert-trolley";
import { lateFeeCase } from "@/lib/cases/late-fee";
import { lastToastCase } from "@/lib/cases/last-toast";
import { pigeonCase } from "@/lib/cases/pigeon-job";
import { velvetTeaspoonCase } from "@/lib/cases/velvet-teaspoon";
import type { CaseFile } from "./types";

export { dessertTrolleyCase, lateFeeCase, lastToastCase, pigeonCase, velvetTeaspoonCase };

export const PLAYER_DEFAULT_ALIAS = "Detective";

export const playableCases: CaseFile[] = [
  pigeonCase,
  lastToastCase,
  lateFeeCase,
  velvetTeaspoonCase,
  dessertTrolleyCase,
];

/** Title stubs only — next hooks after the hard pair. */
export const moreCases = [
  {
    title: "The Midnight Concierge",
    label: "Hard · unlocks after Murder on the Dessert Trolley",
    difficulty: "hard" as const,
    unlockAfterCaseId: "dessert-trolley",
  },
  {
    title: "Felony Fondue",
    label: "Hard · unlocks after The Midnight Concierge",
    difficulty: "hard" as const,
    unlockAfterCaseId: "midnight-concierge",
  },
];

export function getCase(id: string): CaseFile | undefined {
  return playableCases.find((item) => item.id === id);
}

export function requireCase(id: string): CaseFile {
  const found = getCase(id);
  if (!found) throw new Error(`Unknown case: ${id}`);
  return found;
}
