export type EvidenceKind = "still" | "document" | "note";

export type EvidenceHotspot = {
  id: string;
  /** Percent position inside the photo frame (0–100). */
  x: number;
  y: number;
  label: string;
  reveal: string;
};

export type LabSampleOption = {
  id: string;
  label: string;
  detail: string;
};

export type EvidenceAnalysis = {
  /** Player-facing prompt — they choose the sample, we don't prescribe it. */
  prompt: string;
  /** Completes after this many later evidence inspections. */
  inspectDelay: number;
  samples: LabSampleOption[];
  correctSampleId: string;
  /** Immediate lab reply when the wrong sample is chosen. */
  wrongSampleResponse: string;
  resultTitle: string;
  resultText: string;
};

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
  imageSrc: string;
  imageStamp: string;
  visualTell: string;
  linkedSuspectIds?: string[];
  howHint?: string;
  whereHint?: string;
  hotspots?: EvidenceHotspot[];
  analysis?: EvidenceAnalysis;
};

export type Suspect = {
  id: string;
  name: string;
  role: string;
  personality: string;
};

export type Solution = {
  who: string;
  how: string;
  where: string;
};

export type Accusation = Solution & {
  whoEvidenceId: string;
  howEvidenceId: string;
  whereEvidenceId: string;
};

export type Choice = {
  id: string;
  label: string;
  detail: string;
};

export type Contradiction = {
  id: string;
  evidenceIdA: string;
  evidenceIdB: string;
  phraseA: string;
  phraseB: string;
  insight: string;
};

export type Confrontation = {
  id: string;
  suspectId: string;
  claim: string;
  correctEvidenceId: string;
  successResponse: string;
  failureResponse: string;
};

export type SolutionEvidence = {
  who: string[];
  how: string[];
  where: string[];
};

export type CaseDifficulty = "tutorial" | "standard" | "hard";

export type BriefingBeat = {
  title: string;
  copy: string;
};

/** One slot in the scene desk — player keys an option while browsing evidence. */
export type ReconstructionSlot = {
  id: string;
  label: string;
  prompt: string;
  /** Options the player can key in (ids match suspects / how / where / evidence). */
  options: Choice[];
  correctOptionId: string;
  /** When this option is chosen, the scene frame shows this line. */
  sceneLineByOption: Record<string, string>;
};

export type SceneReconstruction = {
  title: string;
  intro: string;
  slots: ReconstructionSlot[];
};

export type CaseFile = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  premise: string;
  /** Short story beats for the briefing (tight, not a novella). */
  briefing: BriefingBeat[];
  difficulty: CaseDifficulty;
  /** Prior case id that must be solved correctly before this one unlocks. */
  unlockAfterCaseId?: string;
  suspects: Suspect[];
  evidence: Evidence[];
  howChoices: Choice[];
  whereChoices: Choice[];
  solution: Solution;
  solutionEvidence: SolutionEvidence;
  explanation: string[];
  contradictions?: Contradiction[];
  confrontations?: Confrontation[];
  reconstruction: SceneReconstruction;
};

export type VerdictAxis = {
  who: boolean;
  how: boolean;
  where: boolean;
  whoEvidence: boolean;
  howEvidence: boolean;
  whereEvidence: boolean;
};

export type Verdict = {
  accusation: Accusation;
  correct: boolean;
  submittedAt: number;
  elapsedMs: number;
  wrongAttempts: number;
  axis: VerdictAxis;
};

export type CustodyEntry = {
  at: number;
  evidenceId: string;
  action:
    | "collected"
    | "examined"
    | "pinned"
    | "lab-sent"
    | "lab-returned"
    | "confronted-with";
  detail?: string;
};

export type CorkLink = {
  evidenceId: string;
  suspectId: string;
};

export type PendingAnalysis = {
  evidenceId: string;
  remainingInspects: number;
};

export type CaseProgress = {
  startedAt: number | null;
  inspectedEvidenceIds: string[];
  pinnedEvidenceIds: string[];
  wrongAttempts: number;
  lastVerdict: Verdict | null;
  custodyLog: CustodyEntry[];
  discoveredHotspotIds: string[];
  pendingAnalyses: PendingAnalysis[];
  completedAnalysisIds: string[];
  foundContradictionIds: string[];
  corkLinks: CorkLink[];
  crackedConfrontationIds: string[];
  confrontAttempts: number;
  /** slotId → chosen optionId for the scene desk */
  reconstructionPicks: Record<string, string>;
};
