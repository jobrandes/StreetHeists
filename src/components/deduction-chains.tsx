"use client";

import {
  isDeductionChainUnlocked,
  isDeductionUnlocked,
} from "@/lib/deduction";
import type { CaseFile, CaseProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GitBranch, Lock, Unlock } from "lucide-react";

export function DeductionChainsPanel({
  caseFile,
  progress,
}: {
  caseFile: CaseFile;
  progress: CaseProgress;
}) {
  const chains = caseFile.deductionChains ?? [];
  if (chains.length === 0) return null;

  return (
    <section className="rounded-xl border-2 border-gold bg-[#DCE6FF]/35 p-4">
      <div className="flex items-center gap-2">
        <GitBranch className="size-4 text-gold" />
        <p className="font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
          Deduction chains
        </p>
      </div>
      <h2 className="mt-1 font-serif text-2xl font-bold text-ink">Link clues. Unlock the take.</h2>
      <p className="mt-1 text-sm leading-snug text-ink">
        String sound corkboard links (and spot clashes) — deductions open as your theory holds.
        This is investigation, not a checklist.
      </p>
      <ul className="mt-4 space-y-3">
        {chains.map((chain) => {
          const unlocked = isDeductionChainUnlocked(caseFile, progress, chain);
          const readyCount = chain.requiredEvidenceIds.filter((id) => {
            const evidence = caseFile.evidence.find((item) => item.id === id);
            return evidence ? isDeductionUnlocked(caseFile, progress, evidence) : false;
          }).length;
          return (
            <li
              key={chain.id}
              className={cn(
                "rounded-xl border p-3",
                unlocked
                  ? "border-gold/40 bg-[#DCE6FF]/70"
                  : "border-hairline bg-card",
              )}
            >
              <div className="flex items-start gap-2">
                {unlocked ? (
                  <Unlock className="mt-0.5 size-4 shrink-0 text-gold" />
                ) : (
                  <Lock className="mt-0.5 size-4 shrink-0 text-muted" />
                )}
                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold text-ink">{chain.title}</p>
                  {unlocked ? (
                    <p className="mt-1 text-sm font-semibold leading-snug text-ink">
                      {chain.insight}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-muted">
                      {readyCount}/{chain.requiredEvidenceIds.length} linked takeaways
                      {chain.unlockOnContradictionId ? " · spot the contradiction" : ""}
                      {chain.requiredCorkLinks?.length
                        ? " · string the corkboard"
                        : ""}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
