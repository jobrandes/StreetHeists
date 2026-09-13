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
