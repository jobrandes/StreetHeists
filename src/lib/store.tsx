"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCase, PLAYER_DEFAULT_ALIAS, pigeonCase } from "./seed";
import type { Accusation, CaseProgress, Verdict } from "./types";

const STORAGE_KEY = "street-heists.couch-case.v3";
const LEGACY_KEY = "street-heists.couch-case.v2";

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
};

const defaults: Persisted = {
  alias: PLAYER_DEFAULT_ALIAS,
  progressByCase: {},
};

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
  };
}

function progressFor(
  map: Record<string, CaseProgress>,
  caseId: string,
): CaseProgress {
  return normalizeProgress(map[caseId] ?? defaultProgress);
}

type Store = {
  ready: boolean;
  alias: string;
  setAlias: (alias: string) => void;
  progressFor: (caseId: string) => CaseProgress;
  openCase: (caseId: string) => void;
  inspectEvidence: (caseId: string, evidenceId: string) => void;
  togglePin: (caseId: string, evidenceId: string) => void;
  submitAccusation: (caseId: string, accusation: Accusation) => Verdict;
  resetCase: (caseId: string) => void;
};

const StoreContext = createContext<Store | null>(null);

function load(): Persisted {
  if (typeof window === "undefined") return defaults;
  try {
    const rawV3 = window.localStorage.getItem(STORAGE_KEY);
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

    // Migrate single-case v2 progress onto the pigeon job.
    const rawV2 = window.localStorage.getItem(LEGACY_KEY);
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
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (progress) => ({
            ...progress,
            startedAt: progress.startedAt ?? Date.now(),
            inspectedEvidenceIds: Array.from(
              new Set([...progress.inspectedEvidenceIds, evidenceId]),
            ),
          })),
        }));
      },
      togglePin(caseId, evidenceId) {
        setState((current) => ({
          ...current,
          progressByCase: patchCase(current.progressByCase, caseId, (progress) => {
            const pinned = progress.pinnedEvidenceIds;
            return {
              ...progress,
              pinnedEvidenceIds: pinned.includes(evidenceId)
                ? pinned.filter((item) => item !== evidenceId)
                : [...pinned, evidenceId],
            };
          }),
        }));
      },
      submitAccusation(caseId, accusation) {
        const caseFile = getCase(caseId);
        if (!caseFile) {
          throw new Error(`Unknown case: ${caseId}`);
        }
        const currentProgress = progressFor(state.progressByCase, caseId);
        const correct =
          accusation.who === caseFile.solution.who &&
          accusation.how === caseFile.solution.how &&
          accusation.where === caseFile.solution.where;
        const submittedAt = Date.now();
        const wrongAttempts = currentProgress.wrongAttempts + (correct ? 0 : 1);
        const verdict: Verdict = {
          accusation,
          correct,
          submittedAt,
          elapsedMs: submittedAt - (currentProgress.startedAt ?? submittedAt),
          wrongAttempts,
        };
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
