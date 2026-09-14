"use client";

import { EvidenceArt } from "@/components/evidence-art";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { isCorrectPairForChain } from "@/lib/deduction";
import type { CaseFile, ClueLink, Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link2, Pencil, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function PinClueSheet({
  open,
  onOpenChange,
  caseFile,
  evidence,
  pinned,
  links,
  playerNote,
  onSaveNote,
  onLink,
  onCompare,
  onUnpin,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseFile: CaseFile;
  evidence: Evidence | null;
  pinned: Evidence[];
  links: ClueLink[];
  playerNote: string;
  onSaveNote: (note: string) => void;
  onLink: (
    a: string,
    b: string,
  ) => { sound: boolean; message: string };
  onCompare: (otherId: string) => void;
  onUnpin: () => void;
}) {
  const [note, setNote] = useState(playerNote);
  const [mode, setMode] = useState<"idle" | "link" | "compare">("idle");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setNote(playerNote);
    setMode("idle");
    setToast(null);
  }, [open, evidence?.id, playerNote]);

  const linkedIds = useMemo(() => {
    if (!evidence) return [] as string[];
    const ids = new Set<string>();
    for (const link of links) {
      if (link.a === evidence.id) ids.add(link.b);
      if (link.b === evidence.id) ids.add(link.a);
    }
    return [...ids];
  }, [evidence, links]);

  const chainPreview = useMemo(() => {
    if (!evidence) return [] as Evidence[];
    const order = [evidence.id, ...linkedIds].slice(0, 3);
    return order
      .map((id) => caseFile.evidence.find((item) => item.id === id) ?? null)
      .filter((item): item is Evidence => Boolean(item));
  }, [caseFile.evidence, evidence, linkedIds]);

  if (!evidence) return null;

  const others = pinned.filter((item) => item.id !== evidence.id);

  function pickTarget(otherId: string) {
    if (mode === "link") {
      const result = onLink(evidence!.id, otherId);
      setToast(result.message);
      setMode("idle");
      return;
    }
    if (mode === "compare") {
      onCompare(otherId);
      setMode("idle");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Pin clue"
        className="max-h-[min(92vh,40rem)] overflow-y-auto border-[#C4A574]/60 bg-[#F7F1E6]"
      >
        <article className="relative rounded-sm border border-[#E8DCC8] bg-[#FFF9F0] p-3 shadow-[0_6px_0_rgba(80,50,20,0.12)]">
          <span
            className="absolute -top-2 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-[#1B2430] shadow"
            aria-hidden
          />
          <EvidenceArt evidence={evidence} className="aspect-square w-full rounded-sm" />
          <h2 className="mt-3 font-display text-sm font-bold tracking-[0.12em] text-ink uppercase">
            Evidence · {evidence.title}
          </h2>
          <p className="mt-2 text-sm leading-snug text-ink">{evidence.description}</p>
          <p className="mt-3 border-t border-[#E8DCC8] pt-2 font-display text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
            Found · {evidence.timestamp} · {evidence.location}
          </p>
        </article>

        <section className="mt-4">
          <p className="inline-flex items-center gap-1.5 rounded-t-md bg-[#1E3A5F] px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.14em] text-white uppercase">
            <Pencil className="size-3" /> Player note
          </p>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            onBlur={() => onSaveNote(note)}
            placeholder="Pin your deduction…"
            rows={3}
            className="w-full resize-none rounded-b-md rounded-tr-md border border-dashed border-[#C4A574] bg-[#FFF8EE] px-3 py-2 text-sm text-ink outline-none focus:border-[#8A5A22]"
          />
        </section>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="bronze"
            className={cn(
              "h-11 rounded-xl border-dashed border-[#C4A574] bg-[#E8D4B0] font-display text-xs font-bold tracking-[0.12em] uppercase",
              mode === "link" && "ring-2 ring-[#8A5A22]",
            )}
            onClick={() => setMode((m) => (m === "link" ? "idle" : "link"))}
          >
            <Link2 className="size-3.5" /> Link to chain
          </Button>
          <Button
            type="button"
            className={cn(
              "h-11 rounded-xl bg-[#1E3A5F] font-display text-xs font-bold tracking-[0.12em] text-white uppercase hover:bg-[#162c48]",
              mode === "compare" && "ring-2 ring-[#8A5A22]",
            )}
            onClick={() => setMode((m) => (m === "compare" ? "idle" : "compare"))}
          >
            <Search className="size-3.5" /> Compare
          </Button>
        </div>

        {mode !== "idle" ? (
          <div className="mt-3 rounded-lg border border-[#C4A574]/50 bg-[#FFF8EE] p-3">
            <p className="font-display text-[10px] font-bold tracking-[0.14em] text-[#8A5A22] uppercase">
              {mode === "link" ? "Pick a pin to string yarn" : "Pick a pin to compare"}
            </p>
            {others.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Pin another clue first.</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {others.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => pickTarget(item.id)}
                      className="w-full rounded-lg border border-[#C4A574]/40 bg-white px-3 py-2 text-left text-sm font-semibold text-ink hover:bg-[#E8D4B0]/40"
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {toast ? (
          <p className="mt-2 text-sm font-semibold text-ink">{toast}</p>
        ) : null}

        <section className="mt-4">
          <p className="inline-flex items-center gap-1.5 rounded-t-md bg-[#1E3A5F] px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.14em] text-white uppercase">
            Chain preview (2–3 linked clues)
          </p>
          <div className="rounded-b-md rounded-tr-md border border-[#C4A574]/40 bg-[#FFF8EE] p-3">
            {chainPreview.length < 2 ? (
              <p className="text-sm text-muted">
                Link this pin to another clue — yarn shows here (2–3 cards).
              </p>
            ) : (
              <div className="flex items-stretch gap-1">
                {chainPreview.map((item, index) => {
                  const next = chainPreview[index + 1];
                  const sound =
                    next &&
                    (caseFile.deductionChains ?? []).some((chain) =>
                      isCorrectPairForChain(chain, item.id, next.id),
                    );
                  return (
                    <div key={item.id} className="flex min-w-0 flex-1 items-center gap-1">
                      <div className="min-w-0 flex-1 rounded-md border border-[#E8DCC8] bg-white p-2 shadow-sm">
                        <p className="truncate font-display text-[9px] font-bold tracking-[0.1em] text-ink uppercase">
                          {item.title}
                        </p>
                      </div>
                      {next ? (
                        <span
                          className={cn(
                            "shrink-0 text-lg leading-none",
                            sound ? "text-[#C62828]" : "text-[#C62828]/50",
                          )}
                          aria-hidden
                        >
                          ∿
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <button
          type="button"
          onClick={onUnpin}
          className="mt-4 w-full text-center text-xs font-semibold text-muted underline"
        >
          Unpin from corkboard
        </button>
      </DialogContent>
    </Dialog>
  );
}
