"use client";

import {
  canAccuse,
  chainsRequiredToAccuse,
  isDeductionChainUnlocked,
  unlockedDeductionChains,
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

  const unlocked = unlockedDeductionChains(caseFile, progress);
  const need = chainsRequiredToAccuse(caseFile);
  const accuseReady = canAccuse(caseFile, progress);

  return (
    <section className="rounded-xl border-2 border-gold bg-[#DCE6FF]/35 p-4">
      <div className="flex items-center gap-2">
        <GitBranch className="size-4 text-gold" />
        <p className="font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
          Deduction cards
        </p>
      </div>
      <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
        Grade the chain — not three naked guesses
      </h2>
      <p className="mt-1 text-sm leading-snug text-ink">
        String sound clue pairs on the corkboard. Accuse stays locked until{" "}
        {need === 1 ? "the required card" : `${need} cards`} open.
      </p>
      <p
        className={cn(
          "mt-3 rounded-lg border px-3 py-2 text-sm font-semibold",
          accuseReady
            ? "border-gold/40 bg-[#DCE6FF]/80 text-ink"
            : "border-hairline bg-card text-muted",
        )}
      >
        {accuseReady
          ? `Decide unlocked · ${unlocked.length}/${need} required cards`
          : `Accuse locked · ${unlocked.length}/${need} required cards`}
      </p>
      <ul className="mt-4 space-y-3">
        {chains.map((chain) => {
          const open = isDeductionChainUnlocked(caseFile, progress, chain);
          const filed = chain.requiredEvidenceIds.filter((id) =>
            progress.inspectedEvidenceIds.includes(id),
          ).length;
          const pairs = chain.correctPairs ?? [];
          const linkedPairs = pairs.filter(([a, b]) =>
            (progress.clueLinks ?? []).some(
              (link) =>
                (link.a === a && link.b === b) || (link.a === b && link.b === a),
            ),
          ).length;
          return (
            <li
              key={chain.id}
              className={cn(
                "rounded-xl border p-3",
                open ? "border-gold/40 bg-[#DCE6FF]/70" : "border-hairline bg-card",
              )}
            >
              <div className="flex items-start gap-2">
                {open ? (
                  <Unlock className="mt-0.5 size-4 shrink-0 text-gold" />
                ) : (
                  <Lock className="mt-0.5 size-4 shrink-0 text-muted" />
                )}
                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold text-ink">{chain.title}</p>
                  {open ? (
                    <p className="mt-1 text-sm font-semibold leading-snug text-ink">
                      {chain.insight}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-muted">
                      Filed {filed}/{chain.requiredEvidenceIds.length}
                      {pairs.length
                        ? ` · sound pairs ${linkedPairs}/${chain.pairsRequired ?? pairs.length}`
                        : ""}
                      {chain.unlockOnContradictionId ? " · spot the contradiction" : ""}
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
