"use client";

import {
  canAccuse,
  chainsRequiredToAccuse,
  unlockedDeductionChains,
} from "@/lib/deduction";
import type { CaseFile, CaseProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StickyNote } from "lucide-react";

/** Shows unlocked yellow notes only — no locked checklist spoiling the board. */
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
    <section className="rounded-xl border border-[#C4A574]/45 bg-[#FFF8EE] p-4">
      <div className="flex items-center gap-2">
        <StickyNote className="size-4 text-[#C9A227]" />
        <p className="font-display text-[10px] font-bold tracking-[0.16em] text-[#8A5A22] uppercase">
          Yellow notes
        </p>
      </div>
      <p
        className={cn(
          "mt-2 rounded-lg border px-3 py-2 text-sm font-semibold",
          accuseReady
            ? "border-[#2F5BFF]/30 bg-[#DCE6FF]/70 text-ink"
            : "border-[#C4A574]/40 bg-white text-ink",
        )}
      >
        {accuseReady
          ? `Notes unlocked ${unlocked.length}/${need || unlocked.length} · Accuse is open`
          : `Notes unlocked ${unlocked.length}/${need} · connect matching clues on the board`}
      </p>
      {unlocked.length === 0 ? (
        <p className="mt-3 text-sm leading-snug text-muted">
          No yellow notes yet. On the corkboard, tap two related clue photos.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {unlocked.map((chain) => (
            <li
              key={chain.id}
              className="rounded-lg border border-[#C9A227]/40 bg-[#F7E27A]/55 px-3 py-2"
            >
              <p className="font-serif text-base font-bold text-ink">{chain.title}</p>
              <p className="mt-1 text-sm leading-snug text-ink/85">{chain.insight}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
