"use client";

import { CaseChrome } from "@/components/case-chrome";
import { EvidenceArt } from "@/components/evidence-art";
import { EvidenceInspectDialog } from "@/components/evidence-inspect-dialog";
import { FirstUseTip } from "@/components/first-use-tip";
import { Button } from "@/components/ui/button";
import { evidenceKindLabel } from "@/lib/case-journey";
import { isCaseUnlocked } from "@/lib/investigation";
import { getCase, playableCases } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import type { Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, FileText, ImageIcon, StickyNote } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function GatherPage() {
  const { id } = useParams<{ id: string }>();
  const caseFile = getCase(id);
  const {
    progressFor,
    inspectEvidence,
    discoverHotspot,
    queueAnalysis,
  } = useHeists();
  const progress = caseFile ? progressFor(caseFile.id) : progressFor("missing");
  const progressMap = useMemo(
    () =>
      Object.fromEntries(playableCases.map((item) => [item.id, progressFor(item.id)])),
    [progressFor],
  );

  const clues = caseFile?.evidence ?? [];
  const inspectedIds = progress.inspectedEvidenceIds ?? [];
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

  return (
    <CaseChrome
      caseFile={caseFile}
      progress={progress}
      step="gather"
      backHref={`/case/${caseFile.id}`}
      backLabel="Briefing"
    >
      <header className="border-b border-hairline pb-4">
        <h1 className="font-serif text-4xl font-bold leading-none text-ink">Gather</h1>
        <p className="mt-2 text-lg leading-snug text-ink">
          Clues we give you — photos, docs, notes. Open each one; takeaways land in Case file.
        </p>
        <FirstUseTip
          tipId="gather-room"
          className="mt-3"
          text="You don’t hunt for evidence in the real world. Everything you need is in this list."
        />
        <p className="mt-3 font-display text-sm font-bold tracking-[0.14em] text-[#2F5BFF] uppercase">
          Filed {filedCount}/{clues.length}
        </p>
      </header>

      <ul className="mt-4 space-y-3">
        {clues.map((item, index) => {
          const filed = inspectedIds.includes(item.id);
          const KindIcon =
            item.kind === "document" ? FileText : item.kind === "note" ? StickyNote : ImageIcon;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => openAt(index)}
                className={cn(
                  "flex min-h-[4.5rem] w-full items-stretch gap-3 overflow-hidden rounded-2xl border bg-card text-left transition-colors",
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
                    {filed ? item.deduction : "Tap to inspect"}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <Button
        asChild
        size="xl"
        className="mt-6 h-14 w-full rounded-xl font-display text-lg font-bold tracking-[0.12em] uppercase"
      >
        <Link href={`/case/${caseFile.id}/accuse`}>
          {filedCount === 0 ? "Skip to Decide" : "Review case notes → Decide"}
        </Link>
      </Button>

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
          goPrev={() => openAt((openIndex - 1 + clues.length) % clues.length)}
          goNext={() => openAt((openIndex + 1) % clues.length)}
          discoverHotspot={discoverHotspot}
          queueAnalysis={queueAnalysis}
        />
      ) : null}
    </CaseChrome>
  );
}
