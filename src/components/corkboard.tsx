"use client";

import { FirstUseTip } from "@/components/first-use-tip";
import { Button } from "@/components/ui/button";
import { isCorrectPairForChain, pairKey } from "@/lib/deduction";
import type { CaseFile, ClueLink, Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link2, Unlink } from "lucide-react";
import { useState } from "react";

export function CorkboardConnect({
  caseFile,
  evidence,
  links,
  onLink,
  onRemove,
}: {
  caseFile: CaseFile;
  evidence: Evidence[];
  links: ClueLink[];
  onLink: (
    a: string,
    b: string,
  ) => { sound: boolean; message: string; unlockedChainIds: string[] };
  onRemove: (linkId: string) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return [current[1], id];
      return [...current, id];
    });
  }

  function connect() {
    if (selected.length !== 2) return;
    const [a, b] = selected;
    const result = onLink(a, b);
    setToast(result.message);
    if (result.sound) setSelected([]);
  }

  function clearSelection() {
    setSelected([]);
    setToast(null);
  }

  return (
    <section className="rounded-xl border-2 border-gold bg-card p-4">
      <div className="flex items-center gap-2">
        <Link2 className="size-4 text-gold" />
        <p className="font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
          Corkboard
        </p>
      </div>
      <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
        Link two clues. Unlock a deduction.
      </h2>
      <p className="mt-1 text-sm leading-snug text-ink">
        Pick two filed pins and string them. A sound pair opens a deduction card. A miss stays as a
        frayed thread — nothing gets wiped.
      </p>
      <FirstUseTip
        tipId="corkboard-clue-pairs"
        className="mt-2"
        text="Tutorial: open two related clues, string them, watch the deduction card unlock — then Decide opens."
      />

      <div className="mt-4">
        <p className="mb-2 font-display text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
          Filed clues · pick two
        </p>
        {evidence.length === 0 ? (
          <p className="text-sm text-muted">File at least two clues, then come back to string.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {evidence.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-left text-xs font-semibold",
                  selected.includes(item.id)
                    ? "border-gold bg-gold text-white"
                    : "border-hairline bg-[#E8EEF8] text-ink",
                )}
              >
                {item.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          variant="gold"
          className="rounded-lg"
          disabled={selected.length !== 2}
          onClick={connect}
        >
          <Link2 className="size-4" /> String pair
        </Button>
        <Button
          variant="bronze"
          className="rounded-lg"
          disabled={selected.length === 0}
          onClick={clearSelection}
        >
          <Unlink className="size-4" /> Clear pick
        </Button>
      </div>

      {toast ? <p className="mt-3 text-sm font-semibold text-ink">{toast}</p> : null}

      {links.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-hairline pt-3">
          {links.map((link) => {
            const evA = evidence.find((item) => item.id === link.a) ??
              caseFile.evidence.find((item) => item.id === link.a);
            const evB = evidence.find((item) => item.id === link.b) ??
              caseFile.evidence.find((item) => item.id === link.b);
            const sound = (caseFile.deductionChains ?? []).some((chain) =>
              isCorrectPairForChain(chain, link.a, link.b),
            );
            return (
              <li
                key={link.id || pairKey(link.a, link.b)}
                className={cn(
                  "flex items-start justify-between gap-2 rounded-lg border px-3 py-2 text-sm",
                  sound
                    ? "border-gold/40 bg-[#DCE6FF]/55 text-ink"
                    : "border-fail/30 bg-[#F8D7D7]/40 text-ink",
                )}
              >
                <div>
                  <span className="font-semibold">{evA?.title ?? link.a}</span>
                  {" ↔ "}
                  <span className="font-semibold">{evB?.title ?? link.b}</span>
                  <span className="mt-0.5 block text-[11px] text-muted">
                    {sound ? "Sound link · feeds a deduction card" : "Miss / frayed — board kept"}
                  </span>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-[11px] font-semibold text-muted underline"
                  onClick={() => onRemove(link.id)}
                >
                  Pull
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
