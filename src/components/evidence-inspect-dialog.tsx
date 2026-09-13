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
