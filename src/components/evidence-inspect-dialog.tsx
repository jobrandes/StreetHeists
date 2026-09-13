"use client";

import { LinkChips } from "@/components/compare-board";
import { PhotoExamine } from "@/components/photo-examine";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { linksForEvidence } from "@/lib/case-file";
import type { CaseFile, CaseProgress, Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Beaker,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Minus,
  Pin,
  Plus,
  RotateCcw,
  Scale,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export function EvidenceInspectDialog({
  caseFile,
  openEvidence,
  openIndex,
  totalClues,
  clues,
  zoom,
  setZoom,
  notes,
  setNotes,
  pinnedIds,
  comparisonItemsLength,
  progress,
  hotspotNote,
  setHotspotNote,
  labNote,
  setLabNote,
  onClose,
  goPrev,
  goNext,
  discoverHotspot,
  queueAnalysis,
  togglePin,
  onOpenCompare,
}: {
  caseFile: CaseFile;
  openEvidence: Evidence;
  openIndex: number;
  totalClues: number;
  clues: Evidence[];
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
  notes: Record<string, string>;
  setNotes: Dispatch<SetStateAction<Record<string, string>>>;
  pinnedIds: string[];
  comparisonItemsLength: number;
  progress: CaseProgress;
  hotspotNote: string | null;
  setHotspotNote: Dispatch<SetStateAction<string | null>>;
  labNote: string | null;
  setLabNote: Dispatch<SetStateAction<string | null>>;
  onClose: () => void;
  goPrev: () => void;
  goNext: () => void;
  discoverHotspot: (
    caseId: string,
    evidenceId: string,
    hotspotId: string,
  ) => string | null | undefined;
  queueAnalysis: (
    caseId: string,
    evidenceId: string,
  ) => { ok: boolean; reason?: string };
  togglePin: (caseId: string, evidenceId: string) => void;
  onOpenCompare: () => void;
}) {
  return (
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        {true ? (
          <DialogContent
            title={`Clue ${openIndex + 1} of ${totalClues}`}
            className="play-day max-h-[94dvh] overflow-y-auto"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-1 rounded-full border border-hairline bg-card px-3 py-1.5 font-display text-[10px] font-bold tracking-[0.12em] text-ink uppercase"
                aria-label="Previous clue"
              >
                <ChevronLeft className="size-4" /> Prev
              </button>
              <div className="flex items-center gap-1.5" aria-hidden>
                {clues.map((item, index) => (
                  <span
                    key={item.id}
                    className={cn(
                      "size-1.5 rounded-full",
                      index === openIndex ? "bg-gold" : "bg-hairline",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1 rounded-full border border-hairline bg-card px-3 py-1.5 font-display text-[10px] font-bold tracking-[0.12em] text-ink uppercase"
                aria-label="Next clue"
              >
                Next <ChevronRight className="size-4" />
              </button>
            </div>

            <p className="mb-2 text-center text-[11px] text-muted">
              Swipe the photo left or right for the next clue
            </p>

            <PhotoExamine
              evidence={openEvidence}
              discoveredHotspotIds={progress.discoveredHotspotIds}
              zoom={zoom}
              onDiscoverHotspot={(hotspotId) => {
                const reveal = discoverHotspot(caseFile.id, openEvidence.id, hotspotId);
                if (reveal) setHotspotNote(reveal);
              }}
            />
            {hotspotNote ? (
              <div className="mt-2 rounded-lg border border-gold/40 bg-[#DCE6FF]/55 p-3">
                <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                  Detail spotted
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{hotspotNote}</p>
              </div>
            ) : null}

            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-[9px] font-bold tracking-[0.16em] text-gold uppercase">
                  {openEvidence.kind}
                </p>
                <h2 className="font-serif text-xl font-bold leading-tight text-ink">
                  {openEvidence.title}
                </h2>
                <p className="mt-1 text-sm text-ink">{openEvidence.caption}</p>
              </div>
              <div
                className="flex shrink-0 items-center rounded-full border border-hairline bg-card"
                aria-label="Evidence zoom controls"
              >
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.max(1, value - 0.5))}
                  className="p-2 text-ink disabled:opacity-30"
                  disabled={zoom === 1}
                  aria-label="Zoom out"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-11 text-center text-xs font-bold text-ink">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.min(3, value + 0.5))}
                  className="p-2 text-ink disabled:opacity-30"
                  disabled={zoom === 3}
                  aria-label="Zoom in"
                >
                  <Plus className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="border-l border-hairline p-2 text-ink"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="size-4" />
                </button>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-hairline bg-card p-3 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-gold" />
                <div>
                  <dt className="sr-only">Timestamp</dt>
                  <dd>{openEvidence.timestamp}</dd>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-gold" />
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd>{openEvidence.location}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-3 rounded-lg border-2 border-[#1B2430] bg-[#F4F1EA] px-3 py-2.5">
              <p className="font-display text-[10px] font-bold tracking-[0.14em] text-ink uppercase">
                In the frame · look for this
              </p>
              <p className="mt-1 text-sm font-semibold leading-snug text-ink">
                {openEvidence.visualTell}
              </p>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-ink">
              {openEvidence.description}
            </p>

            {openEvidence.analysis ? (
              <div className="mt-3 rounded-lg border-2 border-gold bg-card p-3">
                <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                  Forensic queue
                </p>
                {progress.completedAnalysisIds.includes(openEvidence.id) ? (
                  <>
                    <p className="mt-2 font-serif text-lg font-bold text-ink">
                      {openEvidence.analysis.resultTitle}
                    </p>
                    <p className="mt-1 text-sm leading-snug text-ink">
                      {openEvidence.analysis.resultText}
                    </p>
                  </>
                ) : progress.pendingAnalyses.some((item) => item.evidenceId === openEvidence.id) ? (
                  <p className="mt-2 text-sm font-semibold text-ink">
                    Lab has the sample. Keep inspecting other clues — results return after the wait.
                  </p>
                ) : (
                  <Button
                    variant="bronze"
                    className="mt-2 w-full rounded-lg"
                    onClick={() => {
                      const result = queueAnalysis(caseFile.id, openEvidence.id);
                      setLabNote(
                        result.ok
                          ? "Sample sent. Keep working the file."
                          : (result.reason ?? null),
                      );
                    }}
                  >
                    <Beaker className="size-4" />
                    {openEvidence.analysis.buttonLabel}
                  </Button>
                )}
                {labNote ? <p className="mt-2 text-xs font-semibold text-ink">{labNote}</p> : null}
              </div>
            ) : null}

            {(openEvidence.howHint || openEvidence.whereHint) ? (
              <div className="mt-3 grid gap-2 rounded-lg border-2 border-gold bg-[#DCE6FF]/55 p-3">
                <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                  Case-file links · How / Where
                </p>
                {openEvidence.howHint ? (
                  <div className="rounded-md border border-hairline bg-card px-3 py-2">
                    <p className="font-display text-[9px] font-bold tracking-[0.14em] text-muted uppercase">
                      How this points
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-ink">
                      {openEvidence.howHint}
                    </p>
                  </div>
                ) : null}
                {openEvidence.whereHint ? (
                  <div className="rounded-md border border-hairline bg-card px-3 py-2">
                    <p className="font-display text-[9px] font-bold tracking-[0.14em] text-muted uppercase">
                      Where this points
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-ink">
                      {openEvidence.whereHint}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-3">
              <p className="mb-1.5 font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                Linked people & place
              </p>
              <LinkChips
                caseFile={caseFile}
                links={linksForEvidence(caseFile, openEvidence)}
              />
            </div>

            <div className="mt-4 border-l-4 border-gold bg-[#E8EEF8] p-3">
              <label
                className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase"
                htmlFor="inspect-note"
              >
                Your deduction note
              </label>
              <textarea
                id="inspect-note"
                rows={2}
                value={notes[openEvidence.id] ?? ""}
                onChange={(event) =>
                  setNotes((current) => ({
                    ...current,
                    [openEvidence.id]: event.target.value,
                  }))
                }
                className="mt-1 w-full resize-none rounded-md border border-hairline bg-card p-2 text-sm font-semibold text-ink outline-none focus:border-gold"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="bronze"
                className="rounded-lg"
                onClick={() => togglePin(caseFile.id, openEvidence.id)}
              >
                <Pin className="size-4" />
                {pinnedIds.includes(openEvidence.id) ? "On tray" : "Add to tray"}
              </Button>
              <Button
                variant="bronze"
                className="rounded-lg"
                disabled={comparisonItemsLength < 2}
                onClick={onOpenCompare}
              >
                <Scale className="size-4" /> Compare
              </Button>
            </div>

            <Button className="mt-2 w-full rounded-lg" onClick={goNext}>
              Next clue <ChevronRight className="size-4" />
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="mt-1 w-full text-ink">
                Close file
              </Button>
            </DialogClose>
          </DialogContent>
        ) : null}
      </Dialog>

  );
}
