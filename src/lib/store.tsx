"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  buildVerdict,
  hotspotKey,
  isSoundCorkLink,
  scoreAxis,
} from "./investigation";
import { getCase, PLAYER_DEFAULT_ALIAS, pigeonCase } from "./seed";
import type {
  Accusation,
  CaseProgress,
  CorkLink,
  CustodyEntry,
  PendingAnalysis,
  Verdict,
} from "./types";

const STORAGE_KEY = "street-heists.couch-case.v4";
const LEGACY_V3_KEY = "street-heists.couch-case.v3";
const LEGACY_V2_KEY = "street-heists.couch-case.v2";

type Persisted = {
  alias: string;
  progressByCase: Record<string, CaseProgress>;
};

const defaultProgress: CaseProgress = {
  startedAt: null,
  inspectedEvidenceIds: [],
  pinnedEvidenceIds: [],
  wrongAttempts: 0,
  lastVerdict: null,
  custodyLog: [],
  discoveredHotspotIds: [],
  pendingAnalyses: [],
  completedAnalysisIds: [],
  foundContradictionIds: [],
  corkLinks: [],
  crackedConfrontationIds: [],
  confrontAttempts: 0,
  reconstructionPicks: {},
};

const defaults: Persisted = {
  alias: PLAYER_DEFAULT_ALIAS,
  progressByCase: {},
};

function pushCustody(
  log: CustodyEntry[],
  entry: Omit<CustodyEntry, "at"> & { at?: number },
): CustodyEntry[] {
  return [
    ...log,
    {
      at: entry.at ?? Date.now(),
      evidenceId: entry.evidenceId,
      action: entry.action,
      detail: entry.detail,
    },
  ];
}

function normalizeProgress(raw?: Partial<CaseProgress> | null): CaseProgress {
  return {
    startedAt: typeof raw?.startedAt === "number" ? raw.startedAt : null,
    inspectedEvidenceIds: Array.isArray(raw?.inspectedEvidenceIds)
      ? raw.inspectedEvidenceIds.filter((id): id is string => typeof id === "string")
      : [],
    pinnedEvidenceIds: Array.isArray(raw?.pinnedEvidenceIds)
      ? raw.pinnedEvidenceIds.filter((id): id is string => typeof id === "string")
      : [],
    wrongAttempts:
      typeof raw?.wrongAttempts === "number" && Number.isFinite(raw.wrongAttempts)
        ? raw.wrongAttempts
        : 0,
    lastVerdict: raw?.lastVerdict ?? null,
    custodyLog: Array.isArray(raw?.custodyLog) ? raw.custodyLog : [],
    discoveredHotspotIds: Array.isArray(raw?.discoveredHotspotIds)
      ? raw.discoveredHotspotIds
      : [],
    pendingAnalyses: Array.isArray(raw?.pendingAnalyses) ? raw.pendingAnalyses : [],
    completedAnalysisIds: Array.isArray(raw?.completedAnalysisIds)
      ? raw.completedAnalysisIds
      : [],
    foundContradictionIds: Array.isArray(raw?.foundContradictionIds)
      ? raw.foundContradictionIds
      : [],
    corkLinks: Array.isArray(raw?.corkLinks) ? raw.corkLinks : [],
    crackedConfrontationIds: Array.isArray(raw?.crackedConfrontationIds)
      ? raw.crackedConfrontationIds
      : [],
    confrontAttempts:
      typeof raw?.confrontAttempts === "number" ? raw.confrontAttempts : 0,
    reconstructionPicks:
      raw?.reconstructionPicks &&
      typeof raw.reconstructionPicks === "object" &&
      !Array.isArray(raw.reconstructionPicks)
        ? Object.fromEntries(
            Object.entries(raw.reconstructionPicks).filter(
              (entry): entry is [string, string] =>
                typeof entry[0] === "string" && typeof entry[1] === "string",
            ),
          )
        : {},
  };
}

function progressFor(
  map: Record<string, CaseProgress>,
  caseId: string,
): CaseProgress {
  return normalizeProgress(map[caseId] ?? defaultProgress);
}

function tickPendingOnInspect(
  progress: CaseProgress,
  inspectedEvidenceId: string,
  caseId: string,
): CaseProgress {
  if (progress.pendingAnalyses.length === 0) return progress;
  const caseFile = getCase(caseId);
  const nextPending: PendingAnalysis[] = [];
  const completed = [...progress.completedAnalysisIds];
  let log = progress.custodyLog;

  for (const pending of progress.pendingAnalyses) {
    if (pending.evidenceId === inspectedEvidenceId) {
      nextPending.push(pending);
      continue;
    }
    const remaining = pending.remainingInspects - 1;
    if (remaining > 0) {
      nextPending.push({ ...pending, remainingInspects: remaining });
      continue;
    }
    if (completed.includes(pending.evidenceId)) continue;
    completed.push(pending.evidenceId);
    const evidence = caseFile?.evidence.find((item) => item.id === pending.evidenceId);
    log = pushCustody(log, {
      evidenceId: pending.evidenceId,
      action: "lab-returned",
      detail: evidence?.analysis?.resultTitle ?? "Lab results returned",
    });
  }

  return {
    ...progress,
    pendingAnalyses: nextPending,
    completedAnalysisIds: completed,
    custodyLog: log,
  };
}

type ConfrontResult =
  | { ok: true; cracked: boolean; feedback: string }
  | { ok: false; reason: string };

type AnalysisResult = { ok: true } | { ok: false; reason: string };

type Store = {
  ready: boolean;
  alias: string;
  setAlias: (alias: string) => void;
  progressFor: (caseId: string) => CaseProgress;
  openCase: (caseId: string) => void;
  inspectEvidence: (caseId: string, evidenceId: string) => void;
  togglePin: (caseId: string, evidenceId: string) => void;
  discoverHotspot: (
    caseId: string,
    evidenceId: string,
    hotspotId: string,
  ) => string | null;
  queueAnalysis: (
    caseId: string,
    evidenceId: string,
    sampleId: string,
  ) => AnalysisResult;
  markContradiction: (caseId: string, contradictionId: string) => void;
  setCorkLink: (
    caseId: string,
    evidenceId: string,
    suspectId: string | null,
  ) => CorkLink | null;
  confrontSuspect: (
    caseId: string,
    confrontationId: string,
    evidenceId: string,
  ) => ConfrontResult;
  submitAccusation: (caseId: string, accusation: Accusation) => Verdict;
  setReconstructionPick: (
    caseId: string,
    slotId: string,
    optionId: string | null,
  ) => void;
  resetCase: (caseId: string) => void;
};

const StoreContext = createContext<Store | null>(null);

function load(): Persisted {
  if (typeof window === "undefined") return defaults;
  try {
    const rawV4 = window.localStorage.getItem(STORAGE_KEY);
    if (rawV4) {
      const parsed = JSON.parse(rawV4) as Partial<Persisted> | null;
      const map =
        parsed?.progressByCase && typeof parsed.progressByCase === "object"
          ? Object.fromEntries(
              Object.entries(parsed.progressByCase).map(([id, value]) => [
                id,
                normalizeProgress(value),
              ]),
            )
          : {};
      return {
        alias: parsed?.alias || defaults.alias,
        progressByCase: map,
      };
    }

    const rawV3 = window.localStorage.getItem(LEGACY_V3_KEY);
    if (rawV3) {
      const parsed = JSON.parse(rawV3) as Partial<Persisted> | null;
      const map =
        parsed?.progressByCase && typeof parsed.progressByCase === "object"
          ? Object.fromEntries(
              Object.entries(parsed.progressByCase).map(([id, value]) => [
                id,
                normalizeProgress(value),
              ]),
            )
          : {};
      return {
        alias: parsed?.alias || defaults.alias,
        progressByCase: map,
      };
    }

    const rawV2 = window.localStorage.getItem(LEGACY_V2_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as {
        alias?: string;
        progress?: Partial<CaseProgress>;
      } | null;
      return {
        alias: parsed?.alias || defaults.alias,
        progressByCase: {
          [pigeonCase.id]: normalizeProgress(parsed?.progress),
        },
      };
    }
    return defaults;
  } catch {
    return defaults;
  }
}

function patchCase(
  map: Record<string, CaseProgress>,
  caseId: string,
  patch: (current: CaseProgress) => CaseProgress,
): Record<string, CaseProgress> {
  return {
    ...map,
    [caseId]: patch(progressFor(map, caseId)),
  };
}

export function HeistProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<Persisted>(defaults);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore after matching SSR paint
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const value = useMemo<Store>(
    () => ({
      ready,
      alias: state.alias,
      setAlias(alias) {
        setState((current) => ({
          ...current,
          alias: alias.trim() || PLAYER_DEFAULT_ALIAS,
        }));
      },
      progressFor(caseId) {
        return progressFor(state.progressByCase, caseId);
      },
      openCase(caseId) {
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (progress) => ({
            ...progress,
            startedAt: progress.startedAt ?? Date.now(),
          })),
        }));
      },
      inspectEvidence(caseId, evidenceId) {
        const caseFile = getCase(caseId);
        const evidence = caseFile?.evidence.find((item) => item.id === evidenceId);
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (progress) => {
            const already = progress.inspectedEvidenceIds.includes(evidenceId);
            let next: CaseProgress = {
              ...progress,
              startedAt: progress.startedAt ?? Date.now(),
              inspectedEvidenceIds: already
                ? progress.inspectedEvidenceIds
                : [...progress.inspectedEvidenceIds, evidenceId],
            };
            if (!already) {
              next = {
                ...next,
                custodyLog: pushCustody(next.custodyLog, {
                  evidenceId,
                  action: "collected",
                  detail: evidence
                    ? `Bagged · ${evidence.location} · ${evidence.timestamp}`
                    : "Bagged from scene",
                }),
              };
              next = tickPendingOnInspect(next, evidenceId, caseId);
            } else {
              next = {
                ...next,
                custodyLog: pushCustody(next.custodyLog, {
                  evidenceId,
                  action: "examined",
                  detail: "Re-opened in locker",
                }),
              };
            }
            return next;
          }),
        }));
      },
      togglePin(caseId, evidenceId) {
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (progress) => {
            const pinned = progress.pinnedEvidenceIds;
            const removing = pinned.includes(evidenceId);
            return {
              ...progress,
              pinnedEvidenceIds: removing
                ? pinned.filter((item) => item !== evidenceId)
                : [...pinned, evidenceId],
              custodyLog: removing
                ? progress.custodyLog
                : pushCustody(progress.custodyLog, {
                    evidenceId,
                    action: "pinned",
                    detail: "Pinned to compare tray",
                  }),
            };
          }),
        }));
      },
      discoverHotspot(caseId, evidenceId, hotspotId) {
        const caseFile = getCase(caseId);
        const evidence = caseFile?.evidence.find((item) => item.id === evidenceId);
        const hotspot = evidence?.hotspots?.find((item) => item.id === hotspotId);
        if (!hotspot) return null;
        const key = hotspotKey(evidenceId, hotspotId);
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (progress) => {
            if (progress.discoveredHotspotIds.includes(key)) return progress;
            return {
              ...progress,
              discoveredHotspotIds: [...progress.discoveredHotspotIds, key],
              custodyLog: pushCustody(progress.custodyLog, {
                evidenceId,
                action: "examined",
                detail: `Hotspot · ${hotspot.label}`,
              }),
            };
          }),
        }));
        return hotspot.reveal;
      },
      queueAnalysis(caseId, evidenceId, sampleId) {
        const caseFile = getCase(caseId);
        const evidence = caseFile?.evidence.find((item) => item.id === evidenceId);
        if (!evidence?.analysis) {
          return { ok: false, reason: "Nothing here needs lab work." };
        }
        const sample = evidence.analysis.samples.find((item) => item.id === sampleId);
        if (!sample) {
          return { ok: false, reason: "Pick a sample before you send." };
        }
        if (sampleId !== evidence.analysis.correctSampleId) {
          return { ok: false, reason: evidence.analysis.wrongSampleResponse };
        }
        const progress = progressFor(state.progressByCase, caseId);
        if (!progress.inspectedEvidenceIds.includes(evidenceId)) {
          return { ok: false, reason: "Inspect the exhibit before sending it out." };
        }
        if (progress.completedAnalysisIds.includes(evidenceId)) {
          return { ok: false, reason: "Lab already returned results for this." };
        }
        if (progress.pendingAnalyses.some((item) => item.evidenceId === evidenceId)) {
          return { ok: false, reason: "Already in the lab queue." };
        }
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (p) => ({
            ...p,
            pendingAnalyses: [
              ...p.pendingAnalyses,
              {
                evidenceId,
                remainingInspects: Math.max(1, evidence.analysis!.inspectDelay),
              },
            ],
            custodyLog: pushCustody(p.custodyLog, {
              evidenceId,
              action: "lab-sent",
              detail: `Sent · ${sample.label}`,
            }),
          })),
        }));
        return { ok: true };
      },
      markContradiction(caseId, contradictionId) {
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (progress) => {
            if (progress.foundContradictionIds.includes(contradictionId)) {
              return progress;
            }
            return {
              ...progress,
              foundContradictionIds: [
                ...progress.foundContradictionIds,
                contradictionId,
              ],
            };
          }),
        }));
      },
      setCorkLink(caseId, evidenceId, suspectId) {
        if (!getCase(caseId)) return null;
        let saved: CorkLink | null = null;
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (progress) => {
            const without = progress.corkLinks.filter(
              (link) => link.evidenceId !== evidenceId,
            );
            if (!suspectId) {
              return { ...progress, corkLinks: without };
            }
            saved = { evidenceId, suspectId };
            return { ...progress, corkLinks: [...without, saved] };
          }),
        }));
        return saved;
      },
      confrontSuspect(caseId, confrontationId, evidenceId) {
        const caseFile = getCase(caseId);
        const confrontation = caseFile?.confrontations?.find(
          (item) => item.id === confrontationId,
        );
        if (!confrontation) {
          return { ok: false, reason: "No interrogation on the docket." };
        }
        const progress = progressFor(state.progressByCase, caseId);
        if (!progress.inspectedEvidenceIds.includes(evidenceId)) {
          return { ok: false, reason: "That exhibit is not in your bag yet." };
        }
        if (progress.crackedConfrontationIds.includes(confrontationId)) {
          return {
            ok: true,
            cracked: true,
            feedback: confrontation.successResponse,
          };
        }
        const cracked = evidenceId === confrontation.correctEvidenceId;
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (p) => ({
            ...p,
            confrontAttempts: p.confrontAttempts + 1,
            crackedConfrontationIds: cracked
              ? [...p.crackedConfrontationIds, confrontationId]
              : p.crackedConfrontationIds,
            custodyLog: pushCustody(p.custodyLog, {
              evidenceId,
              action: "confronted-with",
              detail: cracked
                ? `Cracked · ${confrontation.id}`
                : `Missed · ${confrontation.id}`,
            }),
          })),
        }));
        return {
          ok: true,
          cracked,
          feedback: cracked
            ? confrontation.successResponse
            : confrontation.failureResponse,
        };
      },
      submitAccusation(caseId, accusation) {
        const caseFile = getCase(caseId);
        if (!caseFile) {
          throw new Error(`Unknown case: ${caseId}`);
        }
        const currentProgress = progressFor(state.progressByCase, caseId);
        const axis = scoreAxis(caseFile, accusation);
        const correct =
          axis.who &&
          axis.how &&
          axis.where &&
          axis.whoEvidence &&
          axis.howEvidence &&
          axis.whereEvidence;
        const submittedAt = Date.now();
        const wrongAttempts = currentProgress.wrongAttempts + (correct ? 0 : 1);
        const verdict = buildVerdict(
          accusation,
          axis,
          submittedAt,
          currentProgress.startedAt,
          wrongAttempts,
        );
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (progress) => ({
            ...progress,
            wrongAttempts,
            lastVerdict: verdict,
          })),
        }));
        return verdict;
      },
      setReconstructionPick(caseId, slotId, optionId) {
        if (!getCase(caseId)) return;
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (progress) => {
            const next = { ...progress.reconstructionPicks };
            if (!optionId) {
              delete next[slotId];
            } else {
              next[slotId] = optionId;
            }
            return { ...progress, reconstructionPicks: next };
          }),
        }));
      },
      resetCase(caseId) {
        setState((current) => ({
          ...current,
          progressByCase: {
            ...current.progressByCase,
            [caseId]: defaultProgress,
          },
        }));
      },
    }),
    [ready, state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useHeists() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useHeists must be used inside HeistProvider");
  return context;
}

export function corkLinkIsSound(caseId: string, link: CorkLink): boolean {
  const caseFile = getCase(caseId);
  if (!caseFile) return false;
  return isSoundCorkLink(caseFile, link);
}
