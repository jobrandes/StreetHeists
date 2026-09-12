"use client";

import { PeopleRoster, PlacesRoster } from "@/components/case-file-rosters";
import { CompareBoard, LinkChips } from "@/components/compare-board";
import { EvidenceArt } from "@/components/evidence-art";
import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { linksForEvidence } from "@/lib/case-file";
import { getCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import type { Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FolderOpen,
  MapPin,
  MapPinned,
  Minus,
  Pin,
  Plus,
  RotateCcw,
  Scale,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

type LockerTab = "clues" | "people" | "places";

export default function EvidenceLockerPage() {
  const { id } = useParams<{ id: string }>();
  const caseFile = getCase(id);
  const { progressFor, inspectEvidence, togglePin } = useHeists();
  const progress = caseFile ? progressFor(caseFile.id) : progressFor("missing");
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
  const swipeStartX = useRef<number | null>(null);

  const openEvidence: Evidence | null =
    openIndex === null ? null : (CLUES[openIndex] ?? null);
  const inspected = CLUES.filter((item) => inspectedIds.includes(item.id));
  const pinned = CLUES.filter((item) => pinnedIds.includes(item.id));
  const comparisonItems = inspected.length > 1 ? inspected : pinned;
  const inspectedCount = inspectedIds.length;
  const totalClues = CLUES.length;

  const openAt = useCallback(
    (index: number) => {
      if (!caseFile) return;
      const item = CLUES[index];
      if (!item) return;
      inspectEvidence(caseFile.id, item.id);
      // Opening a clue auto-adds it to the compare tray.
      if (!pinnedIds.includes(item.id)) togglePin(caseFile.id, item.id);
      setZoom(1);
      setOpenIndex(index);
    },
    [CLUES, caseFile, inspectEvidence, pinnedIds, togglePin],
  );

  function goPrev() {
    if (openIndex === null) return;
    openAt((openIndex - 1 + CLUES.length) % CLUES.length);
  }

  function goNext() {
    if (openIndex === null) return;
    openAt((openIndex + 1) % CLUES.length);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (zoom !== 1) return;
    swipeStartX.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (swipeStartX.current === null || zoom !== 1) {
      swipeStartX.current = null;
      return;
    }
    const delta = event.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(delta) < 56) return;
    if (delta < 0) goNext();
    else goPrev();
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
        className="mt-4 grid grid-cols-3 gap-1 rounded-xl border border-hairline bg-card p-1"
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

      {tab === "people" ? <PeopleRoster caseFile={caseFile} /> : null}
      {tab === "places" ? <PlacesRoster caseFile={caseFile} /> : null}

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[430px] border-t border-hairline bg-[#EEF2F6]/95 p-4 backdrop-blur">
        <Button
          asChild
          size="lg"
          className="w-full rounded-lg font-display text-base font-bold tracking-[0.12em] uppercase"
        >
          <Link href={`/case/${caseFile.id}/accuse`}>Accuse when ready</Link>
        </Button>
        <p className="mt-1 text-center text-[11px] text-muted">
          {inspectedCount} of {totalClues} clues opened · swipe inside a clue to keep moving
        </p>
      </div>

      <Dialog
        open={openEvidence !== null}
        onOpenChange={(open) => {
          if (!open) setOpenIndex(null);
        }}
      >
        {openEvidence && openIndex !== null ? (
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
                {CLUES.map((item, index) => (
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

            <div
              className="relative h-[min(42dvh,20rem)] touch-pan-y overflow-hidden rounded-lg bg-[#1B2430]"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                swipeStartX.current = null;
              }}
            >
              <div
                className="h-full w-full origin-center transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
              >
                <EvidenceArt evidence={openEvidence} className="h-full w-full" />
              </div>
            </div>

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

            <p className="mt-2 text-sm leading-relaxed text-ink">
              {openEvidence.description}
            </p>

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
                disabled={comparisonItems.length < 2}
                onClick={() => setCompareOpen(true)}
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
