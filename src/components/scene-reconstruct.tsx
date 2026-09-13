"use client";

import { Button } from "@/components/ui/button";
import {
  reconstructionScore,
  sceneLinesForPicks,
} from "@/lib/investigation";
import type { CaseFile, Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Clapperboard, RotateCcw } from "lucide-react";
import Link from "next/link";

export function SceneReconstruct({
  caseFile,
  picks,
  inspectedEvidence,
  onPick,
  onClearSlot,
}: {
  caseFile: CaseFile;
  picks: Record<string, string>;
  inspectedEvidence: Evidence[];
  onPick: (slotId: string, optionId: string) => void;
  onClearSlot: (slotId: string) => void;
}) {
  const { reconstruction } = caseFile;
  const lines = sceneLinesForPicks(caseFile, picks);
  const score = reconstructionScore(caseFile, picks);

  return (
    <div className="space-y-5">
      <header className="border-b border-hairline pb-4">
        <p className="inline-flex items-center gap-1.5 font-display text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
          <Clapperboard className="size-3.5" /> Scene desk
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold leading-none text-ink">
          {reconstruction.title}
        </h1>
        <p className="mt-2 text-sm leading-snug text-ink">{reconstruction.intro}</p>
      </header>

      <section
        aria-live="polite"
        className="relative overflow-hidden rounded-xl border border-hairline bg-[linear-gradient(165deg,#1B2430_0%,#2A3544_48%,#1B2430_100%)] p-4 text-[#EEF2F6] shadow-[inset_0_0_0_1px_rgba(238,242,246,0.08)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 20% 20%, rgba(47,91,255,0.35), transparent 55%), radial-gradient(ellipse 60% 40% at 85% 75%, rgba(212,168,67,0.2), transparent 50%)",
          }}
        />
        <p className="relative font-display text-[10px] font-bold tracking-[0.22em] text-[#DCE6FF] uppercase">
          Live reconstruction
        </p>
        <div className="relative mt-3 min-h-[9.5rem] space-y-2.5">
          {reconstruction.slots.map((slot, index) => {
            const pick = picks[slot.id];
            const line = pick ? slot.sceneLineByOption[pick] : null;
            return (
              <p
                key={slot.id}
                className={cn(
                  "font-serif text-[15px] leading-snug transition-all duration-500",
                  line
                    ? "translate-y-0 text-[#EEF2F6] opacity-100"
                    : "translate-y-1 text-[#EEF2F6]/35 opacity-70",
                )}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <span className="mr-2 font-display text-[10px] font-bold tracking-[0.14em] text-[#9EB0FF] uppercase">
                  {slot.label}
                </span>
                {line ?? "— waiting for your pick —"}
              </p>
            );
          })}
        </div>
        <p className="relative mt-4 border-t border-white/15 pt-3 text-[11px] text-[#DCE6FF]/90">
          {score.filled === 0
            ? "Key options below. Flip to the locker anytime — the frame keeps your picks."
            : score.complete
              ? "Frame is full. Cross-check with evidence, then accuse when you are sure."
              : `${score.filled} of ${score.total} beats keyed · ${lines.length} line${lines.length === 1 ? "" : "s"} on the frame`}
        </p>
      </section>

      {inspectedEvidence.length > 0 ? (
        <section>
          <p className="font-display text-[10px] font-bold tracking-[0.18em] text-gold uppercase">
            Evidence in hand
          </p>
          <p className="mt-1 text-xs text-muted">
            Use what you have opened — then key the matching beat below.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {inspectedEvidence.map((item) => (
              <span
                key={item.id}
                className="rounded-md border border-hairline bg-card px-2 py-1 text-[11px] text-ink"
              >
                {item.title}
              </span>
            ))}
          </div>
          <Button asChild variant="bronze" size="sm" className="mt-3 rounded-lg">
            <Link href={`/case/${caseFile.id}/evidence`}>Back to Evidence Locker</Link>
          </Button>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-hairline bg-card/70 p-4">
          <p className="font-serif text-lg font-semibold text-ink">No exhibits opened yet</p>
          <p className="mt-1 text-sm text-muted">
            You can sketch a theory now, or open the locker first and rebuild as you go.
          </p>
          <Button asChild className="mt-3 w-full rounded-lg">
            <Link href={`/case/${caseFile.id}/evidence`}>Open Evidence Locker</Link>
          </Button>
        </section>
      )}

      <div className="space-y-5">
        {reconstruction.slots.map((slot) => {
          const selected = picks[slot.id];
          return (
            <section key={slot.id} className="border-t border-hairline pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-sm font-bold tracking-[0.08em] text-ink uppercase">
                    {slot.label}
                  </h2>
                  <p className="mt-1 text-sm text-ink">{slot.prompt}</p>
                </div>
                {selected ? (
                  <button
                    type="button"
                    onClick={() => onClearSlot(slot.id)}
                    className="inline-flex shrink-0 items-center gap-1 text-[11px] text-muted underline-offset-2 hover:underline"
                  >
                    <RotateCcw className="size-3" /> Clear
                  </button>
                ) : null}
              </div>
              <div className="mt-3 grid gap-2">
                {slot.options.map((option) => {
                  const active = selected === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onPick(slot.id, option.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-left transition-colors",
                        active
                          ? "border-gold bg-[#DCE6FF] shadow-[3px_3px_0_rgba(47,91,255,0.25)]"
                          : "border-hairline bg-card hover:bg-[#E8EEF8]",
                      )}
                    >
                      <p className="font-serif text-base font-semibold text-ink">
                        {option.label}
                      </p>
                      <p className="text-[11px] text-muted">{option.detail}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
