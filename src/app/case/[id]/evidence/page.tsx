"use client";

import { PeopleRoster, PlacesRoster } from "@/components/case-file-rosters";
import { CompareBoard } from "@/components/compare-board";
import { ContradictionSpotter } from "@/components/contradiction-spotter";
import { CorkboardConnect } from "@/components/corkboard";
import { CustodyLog } from "@/components/custody-log";
import { EvidenceArt } from "@/components/evidence-art";
import { KeyholeLogo } from "@/components/keyhole-logo";
import { EvidenceInspectDialog } from "@/components/evidence-inspect-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { isCaseUnlocked } from "@/lib/investigation";
import { getCase, playableCases } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import type { Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  Clapperboard,
  ClipboardList,
  FolderOpen,
  MapPin,
  MapPinned,
  Pin,
  Scale,
  MessageSquareWarning,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

type LockerTab = "clues" | "people" | "places" | "binder";

export default function EvidenceLockerPage() {
  const { id } = useParams<{ id: string }>();
  const caseFile = getCase(id);
  const {
    progressFor,
    inspectEvidence,
    togglePin,
    discoverHotspot,
    queueAnalysis,
    markContradiction,
    setCorkLink,
  } = useHeists();
  const progress = caseFile ? progressFor(caseFile.id) : progressFor("missing");
  const progressMap = useMemo(
    () =>
      Object.fromEntries(playableCases.map((item) => [item.id, progressFor(item.id)])),
    [progressFor],
  );
  const CLUES = caseFile?.evidence ?? [];
  const pinnedIds = progress.pinnedEvidenceIds ?? [];
  const inspectedIds = progress.inspectedEvidenceIds ?? [];
  const [tab, setTab] = useState<LockerTab>("clues");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(CLUES.map((item) => [item.id, item.deduction])),
  );
  const [compareOpen, setCompareOpen] = useState(false);
  const [labNote, setLabNote] = useState<string | null>(null);
  const [hotspotNote, setHotspotNote] = useState<string | null>(null);

  const openEvidence: Evidence | null =
    openIndex === null ? null : (CLUES[openIndex] ?? null);
  const inspected = CLUES.filter((item) => inspectedIds.includes(item.id));
  const pinned = CLUES.filter((item) => pinnedIds.includes(item.id));
  const comparisonItems = inspected.length > 1 ? inspected : pinned;
  const inspectedCount = inspectedIds.length;
  const totalClues = CLUES.length;

  function openAt(index: number) {
    if (!caseFile) return;
    const item = CLUES[index];
    if (!item) return;
    inspectEvidence(caseFile.id, item.id);
    // Opening a clue auto-adds it to the compare tray.
    if (!pinnedIds.includes(item.id)) togglePin(caseFile.id, item.id);
    setZoom(1);
    setHotspotNote(null);
    setLabNote(null);
    setOpenIndex(index);
  }

  function goPrev() {
    if (openIndex === null) return;
    openAt((openIndex - 1 + CLUES.length) % CLUES.length);
  }

  function goNext() {
    if (openIndex === null) return;
    openAt((openIndex + 1) % CLUES.length);
  }

  if (!caseFile) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case not filed.</h1>
          <Button asChild className="mt-4"><Link href="/">Return to Case Board</Link></Button>
        </div>
      </main>
    );
  }

  if (!isCaseUnlocked(caseFile, progressMap)) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case still locked.</h1>
          <p className="mt-2 text-sm text-muted">
            Solve the prior case correctly before this locker opens.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Return to Case Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="play-day min-h-dvh px-4 pb-28 pt-4">
      <Link
        href={`/case/${caseFile.id}`}
        className="inline-flex items-center gap-1 font-display text-xs font-bold tracking-[0.16em] text-muted uppercase"
      >
        <ChevronLeft className="size-4" /> Briefing
      </Link>

      <header className="mt-4 border-b border-hairline pb-4 text-center">
        <KeyholeLogo className="mx-auto size-8" />
        <p className="mt-1 font-display text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
          Street Heists · Case {String(caseFile.number).padStart(2, "0")}
        </p>
        <h1 className="mt-1 font-serif text-4xl font-bold leading-none text-ink">
          Evidence Locker
        </h1>
        <p className="mt-1 font-serif text-lg font-semibold text-ink">
          {caseFile.title}
        </p>
        <p className="mt-2 text-sm leading-snug text-ink">
          Flip through every clue, then compare who / how / where they point to.
        </p>
      </header>

      <div
        className="mt-4 grid grid-cols-4 gap-1 rounded-xl border border-hairline bg-card p-1"
        role="tablist"
        aria-label="Case file sections"
      >
        <TabButton
          active={tab === "clues"}
          onClick={() => setTab("clues")}
          icon={<FolderOpen className="size-3.5" />}
          label="Clues"
        />
        <TabButton
          active={tab === "people"}
          onClick={() => setTab("people")}
          icon={<Users className="size-3.5" />}
          label="People"
        />
        <TabButton
          active={tab === "places"}
          onClick={() => setTab("places")}
          icon={<MapPinned className="size-3.5" />}
          label="Places"
        />
        <TabButton
          active={tab === "binder"}
          onClick={() => setTab("binder")}
          icon={<ClipboardList className="size-3.5" />}
          label="Binder"
        />
      </div>

      {tab === "clues" ? (
        <>
          <p className="mt-4 font-display text-xs font-bold tracking-[0.18em] text-gold uppercase">
            Clue file · {inspectedCount}/{totalClues} inspected
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {CLUES.map((item, index) => {
              const seen = inspectedIds.includes(item.id);
              const isPinned = pinnedIds.includes(item.id);
              return (
                <article
                  key={item.id}
                  className={cn(
                    "relative overflow-hidden rounded-xl border bg-card",
                    openEvidence?.id === item.id
                      ? "border-gold ring-1 ring-gold"
                      : "border-hairline",
                    seen && "bg-[#E8EEF8]",
                  )}
                >
                  {seen ? (
                    <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md bg-gold px-1.5 py-0.5 font-display text-[9px] font-bold tracking-[0.12em] text-white uppercase shadow-sm">
                      <Check className="size-3" /> Seen
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => openAt(index)}
                    className="block w-full text-left"
                    aria-label={`Inspect ${item.title}`}
                  >
                    <EvidenceArt evidence={item} className="h-28" />
                    <div className="p-3">
                      <p className="font-display text-[9px] font-bold tracking-[0.16em] text-gold uppercase">
                        {item.kind}
                      </p>
                      <h2 className="mt-0.5 font-serif text-lg font-bold leading-tight text-ink">
                        {item.title}
                      </h2>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                        <MapPin className="size-3 shrink-0 text-gold" />
                        <span className="truncate">{item.location}</span>
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-ink">
                        {seen ? "Tap to reopen · swipe inside" : "Tap to inspect"}
                      </p>
                    </div>
                  </button>
                  {isPinned ? (
                    <p className="flex items-center justify-center gap-1 border-t border-hairline bg-gold py-2 font-display text-[10px] font-bold tracking-[0.12em] text-white uppercase">
                      <Pin className="size-3" /> On compare tray
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>

          <section className="mt-5 rounded-xl border-2 border-gold bg-card p-4">
            <p className="font-display text-[10px] font-bold tracking-[0.18em] text-gold uppercase">
              Link board
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
              Compare people, how & where
            </h2>
            <p className="mt-1 text-sm leading-snug text-ink">
              Opened clues land on the tray automatically. Shared names and places
              light up so you can accuse with a clear map.
            </p>
            <Button
              variant="gold"
              className="mt-3 w-full rounded-lg"
              disabled={comparisonItems.length < 2}
              onClick={() => setCompareOpen(true)}
            >
              <Scale className="size-4" />
              {comparisonItems.length < 2
                ? `Open ${2 - comparisonItems.length} more clue${comparisonItems.length === 1 ? "" : "s"}`
                : `Compare ${comparisonItems.length} clues`}
            </Button>
            {comparisonItems.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {comparisonItems.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full bg-[#E8EEF8] px-2 py-1 text-[11px] text-ink"
                  >
                    {item.title}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      {tab === "binder" ? (
        <div className="mt-4 space-y-4">
          <CustodyLog caseFile={caseFile} entries={progress.custodyLog} />
          <CorkboardConnect
            caseFile={caseFile}
            evidence={inspected}
            suspects={caseFile.suspects}
            links={progress.corkLinks}
            onLink={(evidenceId, suspectId) => setCorkLink(caseFile.id, evidenceId, suspectId)}
          />
          <ContradictionSpotter
            caseFile={caseFile}
            inspectedIds={inspectedIds}
            foundIds={progress.foundContradictionIds}
            onFound={(contradictionId) => markContradiction(caseFile.id, contradictionId)}
          />
        </div>
      ) : null}

      {tab === "people" ? <PeopleRoster caseFile={caseFile} /> : null}
      {tab === "places" ? <PlacesRoster caseFile={caseFile} /> : null}

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[430px] border-t border-hairline bg-[#EEF2F6]/95 p-4 backdrop-blur">
        <div className="grid grid-cols-3 gap-2">
          <Button
            asChild
            variant="bronze"
            size="lg"
            className="rounded-lg font-display text-[10px] font-bold tracking-[0.08em] uppercase"
          >
            <Link href={`/case/${caseFile.id}/confront`}>
              <MessageSquareWarning className="size-3.5" /> Confront
            </Link>
          </Button>
          <Button
            asChild
            variant="bronze"
            size="lg"
            className="rounded-lg font-display text-[10px] font-bold tracking-[0.08em] uppercase"
          >
            <Link href={`/case/${caseFile.id}/reconstruct`}>
              <Clapperboard className="size-3.5" /> Scene
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-lg font-display text-[10px] font-bold tracking-[0.08em] uppercase"
          >
            <Link href={`/case/${caseFile.id}/accuse`}>Accuse</Link>
          </Button>
        </div>
        <p className="mt-1 text-center text-[11px] text-muted">
          {inspectedCount} of {totalClues} clues · scene desk rebuilds as you pick
        </p>
      </div>

      {openEvidence && openIndex !== null ? (
        <EvidenceInspectDialog
          caseFile={caseFile}
          openEvidence={openEvidence}
          openIndex={openIndex}
          totalClues={totalClues}
          clues={CLUES}
          zoom={zoom}
          setZoom={setZoom}
          notes={notes}
          setNotes={setNotes}
          pinnedIds={pinnedIds}
          comparisonItemsLength={comparisonItems.length}
          progress={progress}
          hotspotNote={hotspotNote}
          setHotspotNote={setHotspotNote}
          labNote={labNote}
          setLabNote={setLabNote}
          onClose={() => setOpenIndex(null)}
          goPrev={goPrev}
          goNext={goNext}
          discoverHotspot={discoverHotspot}
          queueAnalysis={queueAnalysis}
          togglePin={togglePin}
          onOpenCompare={() => setCompareOpen(true)}
        />
      ) : null}

      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent
          title="Compare deductions"
          className="play-day max-h-[90dvh] overflow-y-auto"
        >
          <p className="mb-3 text-sm leading-snug text-ink">
            Shared people and places across your opened clues light up here — use
            that overlap to lock Who / How / Where.
          </p>
          <CompareBoard caseFile={caseFile} items={comparisonItems} />
          <p className="mt-4 text-sm font-semibold text-ink">
            {comparisonItems.length > 1
              ? "When the shared links name a clear theory, head to Accuse."
              : "Open at least two clues to compare links."}
          </p>
          <Button asChild className="mt-3 w-full rounded-lg">
            <Link href={`/case/${caseFile.id}/accuse`}>Go to Accuse</Link>
          </Button>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2.5 font-display text-[11px] font-bold tracking-[0.12em] uppercase transition-colors",
        active ? "bg-gold text-white" : "text-muted hover:text-ink",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
