export type ProofType = "photo" | "video" | "selfie";
export type FailAward = "Legendary Fail" | "Best Fail";
export type HeistArt = "pigeon" | "gelato" | "library" | "fountain" | "laundry" | "opera" | "custom";
export type HomeFilter = "near" | "trending" | "fails";

export type Beat = {
  id: string;
  title: string;
  prompt: string;
  proofType: ProofType;
  tip: string;
  placeName: string;
  x: number;
  y: number;
};

export type Heist = {
  id: string;
  title: string;
  alias: string;
  tagline: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  beats: Beat[];
  neighborhood: string;
  art: HeistArt;
  featured?: boolean;
  trending?: boolean;
  nearMe?: boolean;
  comedyFailAward?: FailAward | null;
  wantedNumber: number;
  createdAt: number;
  published: boolean;
};

export type Proof = { beatId: string; dataUrl: string; style: number; isFail: boolean; failNote?: string };
export type ActiveRun = { heistId: string; startedAt: number; currentBeatIndex: number; proofs: Proof[]; failAward: FailAward | null; tipDismissed: boolean };
export type CompletedRun = { id: string; heistId: string; heistTitle: string; crewAlias: string; startedAt: number; finishedAt: number; elapsedMs: number; proofs: Proof[]; styleAvg: number; failAward: FailAward | null; wantedRank: number };
export type DraftHeist = Omit<Heist, "published" | "createdAt" | "wantedNumber"> & { wantedNumber?: number };
