"use client";

import { LinkChips } from "@/components/compare-board";
import { PhotoExamine } from "@/components/photo-examine";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { linksForEvidence } from "@/lib/case-file";
import { isDeductionUnlocked } from "@/lib/deduction";
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
  ShieldCheck,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

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
  revealConceal,
  onPinNote,
  onCompare,
  isPinned,
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
    sampleId: string,
  ) => { ok: boolean; reason?: string };
  revealConceal?: (caseId: string, evidenceId: string) => void;
  onPinNote?: () => void;
  onCompare?: () => void;
  isPinned?: boolean;
}) {
  const [sampleState, setSampleState] = useState<{
    evidenceId: string;
    sampleId: string | null;
  }>({ evidenceId: openEvidence.id, sampleId: null });
  const selectedSampleId =
    sampleState.evidenceId === openEvidence.id ? sampleState.sampleId : null;
  const isFirst = openIndex <= 0;
  const isLast = openIndex >= totalClues - 1;
  const deductionUnlocked = isDeductionUnlocked(caseFile, progress, openEvidence);
  const concealRevealed = progress.revealedConcealIds.includes(openEvidence.id);
  const relatedContradictions = (caseFile.contradictions ?? []).filter(
    (item) =>
      item.evidenceIdA === openEvidence.id || item.evidenceIdB === openEvidence.id,
  );

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
                disabled={isFirst}
                className="inline-flex items-center gap-1 rounded-full border border-hairline bg-card px-3 py-1.5 font-display text-[10px] font-bold tracking-[0.12em] text-ink uppercase disabled:opacity-40"
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
                aria-label={isLast ? "Finish clues" : "Next clue"}
              >
                {isLast ? "Done" : "Next"} <ChevronRight className="size-4" />
              </button>
            </div>

            <p className="mb-2 text-center text-[11px] text-muted">
              {isLast
                ? `Clue ${openIndex + 1} of ${totalClues} — last one`
                : `Clue ${openIndex + 1} of ${totalClues}`}
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

            {openEvidence.alibiCheck ? (
              <div className="mt-3 rounded-xl border-2 border-[#C4A574]/55 bg-[#F7F1E6] p-3 shadow-[0_2px_0_rgba(80,50,20,0.08)]">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                  <div className="min-w-0">
                    <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                      Alibi check — {openEvidence.alibiCheck.stage}
                    </p>
                    <p className="mt-1 font-display text-sm font-bold tracking-[0.08em] text-ink uppercase">
                      {openEvidence.alibiCheck.window}
                    </p>
                    <p className="mt-1 text-sm leading-snug text-ink">
                      {openEvidence.alibiCheck.detail}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {(onPinNote || onCompare) ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {onPinNote ? (
                  <Button
                    type="button"
                    variant="bronze"
                    className="h-12 rounded-xl font-display text-xs font-bold tracking-[0.12em] uppercase"
                    onClick={onPinNote}
                  >
                    <Pin className="size-4" />
                    {isPinned ? "Pinned note" : "Pin note"}
                  </Button>
                ) : <span />}
                {onCompare ? (
                  <Button
                    type="button"
                    className="h-12 rounded-xl bg-[#2F5BFF] font-display text-xs font-bold tracking-[0.12em] text-white uppercase hover:bg-[#2549d6]"
                    onClick={onCompare}
                  >
                    <Scale className="size-4" />
                    Compare to alibi
                  </Button>
                ) : null}
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

            <p className="mt-3 text-sm leading-relaxed text-ink">
              {openEvidence.description}
            </p>

            {openEvidence.analysis ? (
              <div className="mt-3 rounded-lg border-2 border-gold bg-card p-3">
                <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                  Lab desk
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
                    Lab has your sample. Keep inspecting other clues — results return after the wait.
                  </p>
                ) : (
                  <>
                    <p className="mt-2 text-sm font-semibold text-ink">
                      {openEvidence.analysis.prompt}
                    </p>
                    <div className="mt-2 grid gap-2" role="radiogroup" aria-label="Lab sample">
                      {openEvidence.analysis.samples.map((sample) => {
                        const selected = selectedSampleId === sample.id;
                        return (
                          <button
                            key={sample.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => {
                              setSampleState({
                                evidenceId: openEvidence.id,
                                sampleId: sample.id,
                              });
                              setLabNote(null);
                            }}
                            className={cn(
                              "rounded-lg border px-3 py-2.5 text-left transition-colors",
                              selected
                                ? "border-gold bg-[#DCE6FF] shadow-[3px_3px_0_rgba(47,91,255,0.25)]"
                                : "border-hairline bg-card hover:bg-[#E8EEF8]",
                            )}
                          >
                            <p className="font-serif text-base font-semibold text-ink">
                              {sample.label}
                            </p>
                            <p className="text-[11px] text-muted">{sample.detail}</p>
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      variant="bronze"
                      className="mt-3 w-full rounded-lg"
                      disabled={!selectedSampleId}
                      onClick={() => {
                        if (!selectedSampleId) return;
                        const result = queueAnalysis(
                          caseFile.id,
                          openEvidence.id,
                          selectedSampleId,
                        );
                        setLabNote(
                          result.ok
                            ? "Sample sent. Keep working the file."
                            : (result.reason ?? null),
                        );
                        if (!result.ok) {
                          setSampleState({
                            evidenceId: openEvidence.id,
                            sampleId: null,
                          });
                        }
                      }}
                    >
                      <Beaker className="size-4" />
                      Send to lab
                    </Button>
                  </>
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

            {openEvidence.conceal ? (
              <div className="mt-3 rounded-lg border border-dashed border-gold/50 bg-card p-3">
                <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                  Buried detail
                </p>
                {concealRevealed ? (
                  <p className="mt-1 text-sm font-semibold text-ink">{openEvidence.conceal.text}</p>
                ) : (
                  <button
                    type="button"
                    className="mt-2 w-full rounded-lg border border-hairline bg-[#E8EEF8] px-3 py-2 text-left text-sm font-semibold text-ink hover:border-gold"
                    onClick={() => revealConceal?.(caseFile.id, openEvidence.id)}
                  >
                    {openEvidence.conceal.label}
                  </button>
                )}
              </div>
            ) : null}

            {relatedContradictions.length > 0 ? (
              <div className="mt-3 rounded-lg border border-fail/30 bg-[#F8D7D7]/35 p-3">
                <p className="font-display text-[10px] font-bold tracking-[0.14em] text-fail uppercase">
                  Possible contradiction
                </p>
                <p className="mt-1 text-sm text-ink">
                  This clue may clash with another filed statement. Use Contradiction desk on Gather to pin it.
                </p>
                {relatedContradictions.map((item) => {
                  const found = progress.foundContradictionIds.includes(item.id);
                  return (
                    <p key={item.id} className="mt-2 text-xs font-semibold text-ink">
                      {found ? `Logged: ${item.insight}` : "Not spotted yet — compare the conflicting phrases."}
                    </p>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-3 rounded-lg border-2 border-gold bg-[#DCE6FF]/55 p-3">
              <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                Case takeaway
              </p>
              {deductionUnlocked ? (
                <p className="mt-1 text-sm font-semibold leading-snug text-ink">
                  {openEvidence.deduction}
                </p>
              ) : (
                <p className="mt-1 text-sm text-ink">
                  Takeaway locked. Inspect is not enough — string this clue to the right suspect on the corkboard to unlock what it means.
                </p>
              )}
            </div>

            <div className="mt-4 border-l-4 border-gold bg-[#E8EEF8] p-3">
              <label
                className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase"
                htmlFor="inspect-note"
              >
                Your working note
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

            <p className="mt-4 rounded-lg border border-[#2F5BFF]/25 bg-[#DCE6FF]/70 px-3 py-2 text-sm font-medium text-ink">
              Filed in Case file — ready to use as proof in Decide.
            </p>

            <Button className="mt-2 w-full rounded-lg" onClick={goNext}>
              {isLast ? (
                <>
                  Finish clues <ChevronRight className="size-4" />
                </>
              ) : (
                <>
                  Next clue <ChevronRight className="size-4" />
                </>
              )}
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
