export type EvidenceKind = "still" | "document" | "note";

export type Evidence = {
  id: string;
  title: string;
  kind: EvidenceKind;
  caption: string;
  timestamp: string;
  location: string;
  kicker: string;
  description: string;
  deduction: string;
  visual: "window" | "crumbs" | "feather" | "fountain" | "receipt" | "witness";
  /** Explicit people named or implicated by this clue (drives compare links). */
  linkedSuspectIds?: string[];
};

export type Suspect = {
  id: string;
  name: string;
  role: string;
  personality: string;
};

export type Accusation = {
  who: string;
  how: string;
  where: string;
};

export type Choice = {
  id: string;
  label: string;
  detail: string;
};

export type CaseFile = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  premise: string;
  suspects: Suspect[];
  evidence: Evidence[];
  howChoices: Choice[];
  whereChoices: Choice[];
  solution: Accusation;
  explanation: string[];
};

export type Verdict = {
  accusation: Accusation;
  correct: boolean;
  submittedAt: number;
  elapsedMs: number;
  wrongAttempts: number;
};

export type CaseProgress = {
  startedAt: number | null;
  inspectedEvidenceIds: string[];
  pinnedEvidenceIds: string[];
  wrongAttempts: number;
  lastVerdict: Verdict | null;
};
