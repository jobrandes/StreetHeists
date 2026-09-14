"use client";

import type { CasePack, DeductionChain } from "@/lib/types";
import { CHAIN_TIER_LABEL } from "@/lib/types";

export function DeductionChainsPanel({
  casePack,
  completedChains,
}: {
  casePack: CasePack;
  completedChains: string[];
}) {
  const chains = casePack.deductionChains ?? [];
  if (chains.length === 0) return null;

  const done = new Set(completedChains);

  return (
    <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div>
        <h2 className="font-display text-lg tracking-wide text-amber-200">Deduction chains</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Link clues on the corkboard in order. Completing a chain unlocks a case insight — and may
          open more yarn.
        </p>
      </div>
      <ul className="space-y-2">
        {chains.map((chain) => (
          <ChainRow key={chain.id} chain={chain} complete={done.has(chain.id)} />
        ))}
      </ul>
    </section>
  );
}

function ChainRow({ chain, complete }: { chain: DeductionChain; complete: boolean }) {
  return (
    <li
      className={`rounded-lg border px-3 py-2 ${
        complete
          ? "border-emerald-800/60 bg-emerald-950/30"
          : "border-zinc-800 bg-zinc-900/50"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-zinc-100">{chain.title}</span>
        <span className="text-[10px] uppercase tracking-wide text-zinc-500">
          {CHAIN_TIER_LABEL[chain.tier]}
          {complete ? " · secured" : ""}
        </span>
      </div>
      {complete ? (
        <p className="mt-1 text-xs text-emerald-200/90">{chain.rewardInsight}</p>
      ) : (
        <p className="mt-1 text-xs text-zinc-500">
          {chain.orderedClueIds.length} pins · follow the yarn order on the board
        </p>
      )}
    </li>
  );
}
