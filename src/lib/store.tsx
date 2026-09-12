"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { pigeonCase, PLAYER_DEFAULT_ALIAS } from "./seed";
import type { Accusation, CaseProgress, Verdict } from "./types";

const STORAGE_KEY = "street-heists.couch-case.v2";

type Persisted = {
  alias: string;
  progress: CaseProgress;
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
  progress: defaultProgress,
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

type Store = Persisted & {
  ready: boolean;
  setAlias: (alias: string) => void;
  openCase: () => void;
  inspectEvidence: (id: string) => void;
  togglePin: (id: string) => void;
  submitAccusation: (accusation: Accusation) => Verdict;
  resetCase: () => void;
};

const StoreContext = createContext<Store | null>(null);

function load(): Persisted {
  if (typeof window === "undefined") return defaults;
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "null",
    ) as Partial<Persisted> | null;
    return {
      alias: parsed?.alias || defaults.alias,
      progress: normalizeProgress(parsed?.progress),
    };
  } catch {
    return defaults;
  }
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
      ...state,
      ready,
      setAlias(alias) {
        setState((current) => ({
          ...current,
          alias: alias.trim() || PLAYER_DEFAULT_ALIAS,
        }));
      },
      openCase() {
        setState((current) => ({
          ...current,
          progress: {
            ...current.progress,
            startedAt: current.progress.startedAt ?? Date.now(),
          },
        }));
      },
      inspectEvidence(id) {
        setState((current) => ({
          ...current,
          progress: {
            ...current.progress,
            startedAt: current.progress.startedAt ?? Date.now(),
            inspectedEvidenceIds: Array.from(
              new Set([...current.progress.inspectedEvidenceIds, id]),
            ),
          },
        }));
      },
      togglePin(id) {
        setState((current) => {
          const pinned = current.progress.pinnedEvidenceIds;
          return {
            ...current,
            progress: {
              ...current.progress,
              pinnedEvidenceIds: pinned.includes(id)
                ? pinned.filter((item) => item !== id)
                : [...pinned, id],
            },
          };
        });
      },
      submitAccusation(accusation) {
        const correct =
          accusation.who === pigeonCase.solution.who &&
          accusation.how === pigeonCase.solution.how &&
          accusation.where === pigeonCase.solution.where;
        const submittedAt = Date.now();
        const wrongAttempts = state.progress.wrongAttempts + (correct ? 0 : 1);
        const verdict: Verdict = {
          accusation,
          correct,
          submittedAt,
          elapsedMs: submittedAt - (state.progress.startedAt ?? submittedAt),
          wrongAttempts,
        };
        setState((current) => ({
          ...current,
          progress: {
            ...current.progress,
            wrongAttempts,
            lastVerdict: verdict,
          },
        }));
        return verdict;
      },
      resetCase() {
        setState((current) => ({ ...current, progress: defaultProgress }));
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
