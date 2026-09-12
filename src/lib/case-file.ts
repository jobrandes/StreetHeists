import type { CaseFile, Evidence, Suspect } from "./types";

export type PlaceDossier = {
  name: string;
  clueIds: string[];
  clues: Evidence[];
};

export type SuspectDossier = Suspect & {
  linkedClues: Evidence[];
};

export type EvidenceLinks = {
  people: Suspect[];
  place: string;
};

export type CompareLink = {
  kind: "person" | "place";
  id: string;
  label: string;
  detail?: string;
  evidenceIds: string[];
  evidenceTitles: string[];
  shared: boolean;
};

const PERSON_CHIP_STYLES = [
  "border-[#2F5BFF] bg-[#DCE6FF] text-[#1B2430]",
  "border-[#1B2430] bg-[#E8EEF8] text-[#1B2430]",
  "border-[#C62828] bg-[#F8D7D7] text-[#1B2430]",
  "border-[#5B6675] bg-[#Eef2f6] text-[#1B2430]",
] as const;

/** Unique evidence locations with the clues that cite them. */
export function placesFromCase(caseFile: CaseFile): PlaceDossier[] {
  const byName = new Map<string, Evidence[]>();
  for (const clue of caseFile.evidence) {
    const bucket = byName.get(clue.location) ?? [];
    bucket.push(clue);
    byName.set(clue.location, bucket);
  }
  return Array.from(byName.entries()).map(([name, clues]) => ({
    name,
    clueIds: clues.map((item) => item.id),
    clues,
  }));
}

function clueMentionsSuspect(clue: Evidence, suspect: Suspect): boolean {
  if (clue.linkedSuspectIds?.includes(suspect.id)) return true;
  const needle = suspect.name.toLowerCase();
  const parts = needle.split(/\s+/).filter((part) => part.length > 2);
  const haystack =
    `${clue.title} ${clue.caption} ${clue.description} ${clue.deduction}`.toLowerCase();
  if (haystack.includes(needle)) return true;
  return parts.some((part) => haystack.includes(part));
}

/** Suspect bios plus clues that name or explicitly link them. */
export function suspectDossiers(caseFile: CaseFile): SuspectDossier[] {
  return caseFile.suspects.map((suspect) => ({
    ...suspect,
    linkedClues: caseFile.evidence.filter((clue) =>
      clueMentionsSuspect(clue, suspect),
    ),
  }));
}

/** People + place attached to one clue (for chips / inspect). */
export function linksForEvidence(
  caseFile: CaseFile,
  evidence: Evidence,
): EvidenceLinks {
  const people = caseFile.suspects.filter((suspect) =>
    clueMentionsSuspect(evidence, suspect),
  );
  return { people, place: evidence.location };
}

/** Stable Play Day chip class for a suspect id. */
export function personChipClass(suspectId: string, suspects: Suspect[]): string {
  const index = Math.max(
    0,
    suspects.findIndex((suspect) => suspect.id === suspectId),
  );
  return PERSON_CHIP_STYLES[index % PERSON_CHIP_STYLES.length];
}

/**
 * Build compare-board links: per-clue people/places, plus which ones
 * appear across more than one compared clue.
 */
export function compareLinks(
  caseFile: CaseFile,
  items: Evidence[],
): { perClue: Record<string, EvidenceLinks>; board: CompareLink[] } {
  const perClue: Record<string, EvidenceLinks> = {};
  for (const item of items) {
    perClue[item.id] = linksForEvidence(caseFile, item);
  }

  const personMap = new Map<string, CompareLink>();
  const placeMap = new Map<string, CompareLink>();

  for (const item of items) {
    const links = perClue[item.id];
    for (const person of links.people) {
      const existing = personMap.get(person.id);
      if (existing) {
        if (!existing.evidenceIds.includes(item.id)) {
          existing.evidenceIds.push(item.id);
          existing.evidenceTitles.push(item.title);
        }
      } else {
        personMap.set(person.id, {
          kind: "person",
          id: person.id,
          label: person.name,
          detail: person.role,
          evidenceIds: [item.id],
          evidenceTitles: [item.title],
          shared: false,
        });
      }
    }
    const placeExisting = placeMap.get(links.place);
    if (placeExisting) {
      if (!placeExisting.evidenceIds.includes(item.id)) {
        placeExisting.evidenceIds.push(item.id);
        placeExisting.evidenceTitles.push(item.title);
      }
    } else {
      placeMap.set(links.place, {
        kind: "place",
        id: links.place,
        label: links.place,
        evidenceIds: [item.id],
        evidenceTitles: [item.title],
        shared: false,
      });
    }
  }

  const board = [...personMap.values(), ...placeMap.values()]
    .map((link) => ({ ...link, shared: link.evidenceIds.length > 1 }))
    .sort((a, b) => Number(b.shared) - Number(a.shared) || a.label.localeCompare(b.label));

  return { perClue, board };
}
