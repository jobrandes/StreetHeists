"use client";

import { CaseChrome } from "@/components/case-chrome";
import { ContradictionSpotter } from "@/components/contradiction-spotter";
import { DeductionChainsPanel } from "@/components/deduction-chains";
import { EvidenceArt } from "@/components/evidence-art";
import { EvidenceInspectDialog } from "@/components/evidence-inspect-dialog";
import { FirstUseTip } from "@/components/first-use-tip";
import { Button } from "@/components/ui/button";
import { evidenceKindLabel } from "@/lib/case-journey";
import {
  canAccuse,
  chainsRequiredToAccuse,
  isDeductionUnlocked,
  unlockedDeductionChains,
} from "@/lib/deduction";
import { isCaseUnlocked } from "@/lib/investigation";
import { getCase, playableCases } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import type { Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, FileText, ImageIcon, Lock, Pin, StickyNote } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function LockerPage() {
  const { id } = useParams<{ id: string }>();
  const caseFile = getCase(id);
  const {
    progressFor,
    inspectEvidence,
    togglePin,
    discoverHotspot,
    queueAnalysis,
    markContradiction,
    revealConceal,
  } = useHeists();
  const progress = caseFile ? progressFor(caseFile.id) : progressFor("missing");
  const progressMap = useMemo(
    () =>
      Object.fromEntries(playableCases.map((item) => [item.id, progressFor(item.id)])),
    [progressFor],
  );

  const clues = caseFile?.evidence ?? [];
  const inspectedIds = progress.inspectedEvidenceIds ?? [];
  const pinnedIds = progress.pinnedEvidenceIds ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(clues.map((item) => [item.id, item.deduction])),
  );
  const [hotspotNote, setHotspotNote] = useState<string | null>(null);
  const [labNote, setLabNote] = useState<string | null>(null);

  const openEvidence: Evidence | null =
    openIndex === null ? null : (clues[openIndex] ?? null);
  const filedCount = inspectedIds.length;

  function openAt(index: number) {
    if (!caseFile) return;
    const item = clues[index];
    if (!item) return;
    inspectEvidence(caseFile.id, item.id);
    setZoom(1);
    setHotspotNote(null);
    setLabNote(null);
    setOpenIndex(index);
  }

  if (!caseFile) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case not filed.</h1>
          <Button asChild className="mt-4">
            <Link href="/cases">Return to Case Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!isCaseUnlocked(caseFile, progressMap)) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case still locked.</h1>
          <Button asChild className="mt-4">
            <Link href="/cases">Return to Case Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  const ready = canAccuse(caseFile, progress);
  const need = chainsRequiredToAccuse(caseFile);
  const have = unlockedDeductionChains(caseFile, progress).length;

  return (
    <CaseChrome
      caseFile={caseFile}
      progress={progress}
      step="locker"
      backHref={`/case/${caseFile.id}`}
      backLabel="Briefing"
    >
      <header className="border-b border-hairline pb-4">
        <h1 className="font-serif text-4xl font-bold leading-none text-ink">Locker</h1>
        <p className="mt-2 text-lg leading-snug text-ink">
          Clues we give you — stills, docs, notes. File them, pin keepers to the Corkboard.
        </p>
        <FirstUseTip
          tipId="locker-room-v02"
          className="mt-3"
          text="Open each clue here. Pin the ones that itch, then string yarn on the Corkboard. No map in v0.2."
        />
        <p className="mt-3 font-display text-sm font-bold tracking-[0.14em] text-[#2F5BFF] uppercase">
          Filed {filedCount}/{clues.length} · Pinned {pinnedIds.length}
        </p>
      </header>

      <ul className="mt-4 space-y-3">
        {clues.map((item, index) => {
          const filed = inspectedIds.includes(item.id);
          const pinned = pinnedIds.includes(item.id);
          const KindIcon =
            item.kind === "document" ? FileText : item.kind === "note" ? StickyNote : ImageIcon;
          return (
            <li key={item.id} className="flex gap-2">
              <button
                type="button"
                onClick={() => openAt(index)}
                className={cn(
                  "flex min-h-[4.5rem] min-w-0 flex-1 items-stretch gap-3 overflow-hidden rounded-2xl border bg-card text-left transition-colors",
                  filed
                    ? "border-[#2F5BFF]/40 bg-[#DCE6FF]/35"
                    : "border-hairline hover:bg-[#E8EEF8]",
                )}
              >
                <EvidenceArt evidence={item} className="h-auto w-24 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col justify-center py-3 pr-3">
                  <p className="inline-flex items-center gap-1.5 font-display text-xs font-bold tracking-[0.14em] text-[#2F5BFF] uppercase">
                    <KindIcon className="size-3.5" />
                    {evidenceKindLabel(item.kind)}
                    {filed ? (
                      <span className="ml-1 inline-flex items-center gap-0.5 rounded-md bg-[#2F5BFF] px-1.5 py-0.5 text-[10px] text-white">
                        <Check className="size-3" /> Filed
                      </span>
                    ) : null}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-bold leading-tight text-ink">
                    {item.title}
                  </h2>
                  <p className="mt-1 truncate text-base text-muted">
                    {filed
                      ? isDeductionUnlocked(caseFile, progress, item)
                        ? item.deduction
                        : "Filed — pin it, then string yarn on the Corkboard"
                      : "Tap to inspect"}
                  </p>
                </div>
              </button>
              <button
                type="button"
                disabled={!filed}
                aria-label={pinned ? `Unpin ${item.title}` : `Pin ${item.title}`}
                onClick={() => togglePin(caseFile.id, item.id)}
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                  !filed && "opacity-40",
                  pinned
                    ? "border-[#C62828]/50 bg-[#F8D7D7]/50 text-[#C62828]"
                    : "border-hairline bg-card text-muted hover:bg-[#F7F1E6]",
                )}
              >
                <Pin className={cn("size-5", pinned && "fill-current")} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 space-y-4">
        <ContradictionSpotter
          caseFile={caseFile}
          inspectedIds={inspectedIds}
          foundIds={progress.foundContradictionIds}
          onFound={(contradictionId) => markContradiction(caseFile.id, contradictionId)}
        />
        <DeductionChainsPanel caseFile={caseFile} progress={progress} />
      </div>

      <Button
        asChild
        size="xl"
        className="mt-6 h-14 w-full rounded-xl bg-[#D4B483] font-display text-lg font-bold tracking-[0.12em] text-ink uppercase hover:bg-[#C9A574]"
      >
        <Link href={`/case/${caseFile.id}/corkboard`}>
          {pinnedIds.length === 0 ? "Open Corkboard" : "Corkboard · string yarn"}
        </Link>
      </Button>

      {!ready && need > 0 ? (
        <div className="mt-4 rounded-xl border border-hairline bg-card p-4">
          <p className="inline-flex items-center gap-2 font-display text-xs font-bold tracking-[0.14em] text-muted uppercase">
            <Lock className="size-3.5" /> Accuse locked
          </p>
          <p className="mt-2 text-sm leading-snug text-ink">
            String sound pairs on the Corkboard until{" "}
            {need === 1 ? "your sticky deduction" : `${need} sticky deductions`} unlock ({have}/
            {need}).
          </p>
          <Button
            size="xl"
            disabled
            className="mt-4 h-14 w-full rounded-xl font-display text-lg font-bold tracking-[0.12em] uppercase opacity-60"
          >
            Accuse locked
          </Button>
        </div>
      ) : (
        <Button
          asChild
          size="xl"
          className="mt-4 h-14 w-full rounded-xl font-display text-lg font-bold tracking-[0.12em] uppercase"
        >
          <Link href={`/case/${caseFile.id}/accuse`}>
            {filedCount === 0 ? "Skip to Accuse" : "Open Accuse"}
          </Link>
        </Button>
      )}

      {openEvidence && openIndex !== null ? (
        <EvidenceInspectDialog
          caseFile={caseFile}
          openEvidence={openEvidence}
          openIndex={openIndex}
          totalClues={clues.length}
          clues={clues}
          zoom={zoom}
          setZoom={setZoom}
          notes={notes}
          setNotes={setNotes}
          progress={progress}
          hotspotNote={hotspotNote}
          setHotspotNote={setHotspotNote}
          labNote={labNote}
          setLabNote={setLabNote}
          onClose={() => setOpenIndex(null)}
          goPrev={() => {
            if (openIndex <= 0) return;
            openAt(openIndex - 1);
          }}
          goNext={() => {
            if (openIndex >= clues.length - 1) {
              setOpenIndex(null);
              return;
            }
            openAt(openIndex + 1);
          }}
          discoverHotspot={discoverHotspot}
          queueAnalysis={queueAnalysis}
          revealConceal={revealConceal}
        />
      ) : null}
    </CaseChrome>
  );
}
