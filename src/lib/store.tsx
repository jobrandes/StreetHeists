"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { assignRanks, styleAverage } from "./scoring";
import { PLAYER_DEFAULT_ALIAS, seedHeists, seedRuns } from "./seed";
import type { ActiveRun, CompletedRun, FailAward, Heist, Proof } from "./types";
import { uid } from "./utils";
const STORAGE_KEY = "street-heists.v0";
type Persisted = { alias: string; heists: Heist[]; runs: CompletedRun[]; activeRun: ActiveRun | null; lastCompletedId: string | null };
const defaults: Persisted = { alias: PLAYER_DEFAULT_ALIAS, heists: seedHeists, runs: seedRuns, activeRun: null, lastCompletedId: null };
type Store = Persisted & { ready: boolean; setAlias: (alias: string) => void; publishHeist: (heist: Omit<Heist, "published" | "createdAt" | "wantedNumber">) => Heist; startRun: (id: string) => void; dismissTip: () => void; submitProof: (proof: Proof) => void; logFailAward: (award: FailAward) => void; finishRun: () => CompletedRun | null; lastCompleted: CompletedRun | null; resetTable: () => void };
const StoreContext = createContext<Store | null>(null);
function load(): Persisted { try { const raw = window.localStorage.getItem(STORAGE_KEY); return raw ? { ...defaults, ...JSON.parse(raw) } : defaults; } catch { return defaults; } }
export function HeistProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false); const [state, setState] = useState<Persisted>(defaults);
  useEffect(() => { /* eslint-disable-next-line react-hooks/set-state-in-effect */ setState(load()); setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [ready, state]);
  const api = useMemo<Store>(() => ({ ...state, ready, lastCompleted: state.runs.find(r => r.id === state.lastCompletedId) ?? null,
    setAlias(alias) { setState(p => ({ ...p, alias: alias.trim() || PLAYER_DEFAULT_ALIAS })); },
    publishHeist(input) { const heist: Heist = { ...input, id: uid("heist"), published: true, createdAt: Date.now(), wantedNumber: Math.max(...state.heists.map(h => h.wantedNumber), 20) + 1, featured: false }; setState(p => ({ ...p, heists: [heist, ...p.heists] })); return heist; },
    startRun(heistId) { setState(p => ({ ...p, activeRun: p.activeRun?.heistId === heistId ? p.activeRun : { heistId, startedAt: Date.now(), currentBeatIndex: 0, proofs: [], failAward: null, tipDismissed: false } })); },
    dismissTip() { setState(p => p.activeRun ? { ...p, activeRun: { ...p.activeRun, tipDismissed: true } } : p); },
    submitProof(proof) { setState(p => { if (!p.activeRun) return p; const proofs = [...p.activeRun.proofs.filter(x => x.beatId !== proof.beatId), proof]; const heist = p.heists.find(h => h.id === p.activeRun?.heistId); return { ...p, activeRun: { ...p.activeRun, proofs, currentBeatIndex: Math.min((heist?.beats.length ?? 1) - 1, p.activeRun.currentBeatIndex + 1), tipDismissed: false } }; }); },
    logFailAward(award) { setState(p => p.activeRun ? { ...p, activeRun: { ...p.activeRun, failAward: award === "Legendary Fail" || p.activeRun.failAward === "Legendary Fail" ? "Legendary Fail" : award } } : p); },
    finishRun() { if (!state.activeRun) return null; const heist = state.heists.find(h => h.id === state.activeRun?.heistId); if (!heist) return null; const finishedAt = Date.now(); const draft: CompletedRun = { id: uid("run"), heistId: heist.id, heistTitle: heist.title, crewAlias: state.alias, startedAt: state.activeRun.startedAt, finishedAt, elapsedMs: finishedAt - state.activeRun.startedAt, proofs: state.activeRun.proofs, styleAvg: styleAverage(state.activeRun.proofs), failAward: state.activeRun.failAward, wantedRank: 0 }; const runs = assignRanks([draft, ...state.runs]); const done = runs.find(r => r.id === draft.id) ?? draft; setState({ ...state, runs, activeRun: null, lastCompletedId: draft.id }); return done; },
    resetTable() { localStorage.removeItem(STORAGE_KEY); setState(defaults); }
  }), [ready, state]);
  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}
export function useHeists() { const ctx = useContext(StoreContext); if (!ctx) throw new Error("useHeists must be used inside HeistProvider"); return ctx; }
