"use client";

import { Button } from "@/components/ui/button";
import type { CaseFile, Contradiction, Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GitCompareArrows } from "lucide-react";
import { useMemo, useState } from "react";

function highlightPhrase(text: string, phrase: string, selected: boolean, onSelect: () => void) {
  const index = text.indexOf(phrase);
  if (index < 0) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "rounded-md px-1 py-0.5 text-left font-semibold underline decoration-dotted underline-offset-2",
          selected ? "bg-gold text-white" : "bg-[#F4F1EA] text-ink",
        )}
      >
        {phrase}
      </button>
    );
  }
  const before = text.slice(0, index);
  const after = text.slice(index + phrase.length);
  return (
    <>
      {before}
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "rounded-md px-1 py-0.5 font-semibold underline decoration-dotted underline-offset-2",
          selected ? "bg-gold text-white" : "bg-[#F4F1EA] text-ink hover:bg-gold/20",
        )}
      >
        {phrase}
      </button>
      {after}
    </>
  );
}

export function ContradictionSpotter({
  caseFile,
  inspectedIds,
  foundIds,
  onFound,
}: {
  caseFile: CaseFile;
  inspectedIds: string[];
  foundIds: string[];
  onFound: (id: string) => void;
}) {
  const [picked, setPicked] = useState<{
    contradictionId: string;
    side: "a" | "b";
  } | null>(null);
  const [miss, setMiss] = useState<string | null>(null);

  const ready = useMemo(
    () =>
      (caseFile.contradictions ?? []).filter(
        (item) =>
          inspectedIds.includes(item.evidenceIdA) &&
          inspectedIds.includes(item.evidenceIdB),
      ),
    [caseFile.contradictions, inspectedIds],
  );

  if ((caseFile.contradictions ?? []).length === 0) return null;

  function evidenceById(id: string): Evidence | undefined {
    return caseFile.evidence.find((item) => item.id === id);
  }

  function onPhrase(contradiction: Contradiction, side: "a" | "b") {
    setMiss(null);
    if (foundIds.includes(contradiction.id)) return;

    if (!picked || picked.contradictionId !== contradiction.id) {
      setPicked({ contradictionId: contradiction.id, side });
      return;
    }
    if (picked.side === side) {
      setPicked(null);
      return;
    }
    // Both sides of the same contradiction selected → mark found
    onFound(contradiction.id);
    setPicked(null);
  }

  return (
    <section className="rounded-xl border-2 border-gold bg-[#DCE6FF]/35 p-4">
      <div className="flex items-center gap-2">
        <GitCompareArrows className="size-4 text-gold" />
        <p className="font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
          Contradiction desk
        </p>
      </div>
      <h2 className="mt-1 font-serif text-2xl font-bold text-ink">Spot the clash</h2>
      <p className="mt-1 text-sm leading-snug text-ink">
        Tap the specific phrase in each statement that cannot both be true.
      </p>

      {ready.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Inspect both related statements first — then the clash becomes clickable.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {ready.map((item) => {
            const a = evidenceById(item.evidenceIdA);
            const b = evidenceById(item.evidenceIdB);
            const found = foundIds.includes(item.id);
            return (
              <li key={item.id} className="rounded-xl border border-hairline bg-card p-3">
                <div className="space-y-3">
                  <div>
                    <p className="font-display text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
                      {a?.title ?? "Statement A"}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink">
                      {highlightPhrase(
                        a?.description ?? item.phraseA,
                        item.phraseA,
                        picked?.contradictionId === item.id && picked.side === "a",
                        () => onPhrase(item, "a"),
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
                      {b?.title ?? "Statement B"}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink">
                      {highlightPhrase(
                        b?.description ?? item.phraseB,
                        item.phraseB,
                        picked?.contradictionId === item.id && picked.side === "b",
                        () => onPhrase(item, "b"),
                      )}
                    </p>
                  </div>
                </div>
                {found ? (
                  <div className="mt-3 rounded-lg border border-gold/40 bg-[#DCE6FF]/70 p-2.5">
                    <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                      Contradiction logged
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">{item.insight}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-[11px] text-muted">
                    Select one conflicting phrase in each statement.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {miss ? (
        <p className="mt-3 text-sm text-fail">
          {miss}
          <Button variant="ghost" className="ml-2 h-auto p-0 text-fail" onClick={() => setMiss(null)}>
            Dismiss
          </Button>
        </p>
      ) : null}
    </section>
  );
}
