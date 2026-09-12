"use client";

import { PeopleRoster, PlacesRoster } from "@/components/case-file-rosters";
import { CompareBoard, LinkChips } from "@/components/compare-board";
import { linksForEvidence } from "@/lib/case-file";
import { EvidenceArt } from "@/components/evidence-art";
import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { pigeonCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import type { Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
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
import { useState, type ReactNode } from "react";

type LockerTab = "clues" | "people" | "places";

export default function EvidenceLockerPage() {
  const { progress, inspectEvidence, togglePin } = useHeists();
  const [tab, setTab] = useState<LockerTab>("clues");
  const [openEvidence, setOpenEvidence] = useState<Evidence | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence>(
    pigeonCase.evidence[0],
  );
  const [compareOpen, setCompareOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      pigeonCase.evidence.map((item) => [item.id, item.deduction]),
    ),
  );
  const pinned = pigeonCase.evidence.filter((item) =>
    progress.pinnedEvidenceIds.includes(item.id),
  );
  const comparisonItems = [
    selectedEvidence,
    ...pinned.filter((item) => item.id !== selectedEvidence.id),
  ];
  const inspectedCount = progress.inspectedEvidenceIds.length;
  const totalClues = pigeonCase.evidence.length;

  function inspect(item: Evidence) {
    inspectEvidence(item.id);
    setSelectedEvidence(item);
    setZoom(1);
    setOpenEvidence(item);
  }

  return (
    <main className="play-day min-h-dvh px-4 pb-28 pt-4">
      <Link href={`/case/${pigeonCase.id}`} className="inline-flex items-center gap-1 font-display text-xs font-bold tracking-[0.16em] text-muted uppercase">
        <ChevronLeft className="size-4" /> Briefing
      </Link>
      <header className="mt-4 border-b border-hairline pb-4 text-center">
        <KeyholeLogo className="mx-auto size-8" />
        <p className="mt-1 font-display text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
          Street Heists · Case {String(pigeonCase.number).padStart(2, "0")}
        </p>
        <h1 className="mt-1 font-serif text-4xl font-bold leading-none text-ink">
          Evidence Locker
        </h1>
        <p className="mt-1 font-serif text-lg font-semibold text-ink">{pigeonCase.title}</p>
        <p className="mt-2 text-sm leading-snug text-ink">
          Inspect clues, read People & Places, pin the notes that make your case.
        </p>
      </header>

      <div
        className="mt-4 grid grid-cols-3 gap-1 rounded-xl border border-hairline bg-card p-1"
        role="tablist"
        aria-label="Case file sections"
      >
        <TabButton active={tab === "clues"} onClick={() => setTab("clues")} icon={<FolderOpen className="size-3.5" />} label="Clues" />
        <TabButton active={tab === "people"} onClick={() => setTab("people")} icon={<Users className="size-3.5" />} label="People" />
        <TabButton active={tab === "places"} onClick={() => setTab("places")} icon={<MapPinned className="size-3.5" />} label="Places" />
      </div>

      {tab === "clues" ? (
        <>
          <p className="mt-4 font-display text-xs font-bold tracking-[0.18em] text-gold uppercase">
            Clue file · {inspectedCount}/{totalClues} inspected
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {pigeonCase.evidence.map((item) => {
              const inspected = progress.inspectedEvidenceIds.includes(item.id);
              const isPinned = progress.pinnedEvidenceIds.includes(item.id);
              return (
                <article
                  key={item.id}
                  className={cn(
                    "relative overflow-hidden rounded-xl border bg-card",
                    selectedEvidence.id === item.id ? "border-gold ring-1 ring-gold" : "border-hairline",
                    inspected && "bg-[#FFF9EC]",
                  )}
                >
                  {inspected ? (
                    <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md bg-gold px-1.5 py-0.5 font-display text-[9px] font-bold tracking-[0.12em] text-ink uppercase shadow-sm">
                      <Check className="size-3" /> Seen
                    </span>
                  ) : null}
                  <button type="button" onClick={() => inspect(item)} className="block w-full text-left" aria-label={`Inspect ${item.title}`}>
                    <EvidenceArt evidence={item} className="h-28" />
                    <div className="p-3">
                      <p className="font-display text-[9px] font-bold tracking-[0.16em] text-gold uppercase">{item.kind}</p>
                      <h2 className="mt-0.5 font-serif text-lg font-bold leading-tight text-ink">{item.title}</h2>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                        <MapPin className="size-3 shrink-0 text-gold" />
                        <span className="truncate">{item.location}</span>
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-ink">
                        {inspected ? (
                          <><Check className="size-3 text-gold" /> Already opened</>
                        ) : (
                          "Tap to inspect"
                        )}
                      </p>
                    </div>
                  </button>
                  {isPinned ? (
                    <p className="flex items-center justify-center gap-1 border-t border-hairline bg-gold py-2 font-display text-[10px] font-bold tracking-[0.12em] text-ink uppercase">
                      <Pin className="size-3" /> Note pinned
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>

          <section className="mt-5 rounded-xl border-2 border-gold bg-card p-4">
            <p className="font-display text-[10px] font-bold tracking-[0.18em] text-gold uppercase">
              Selected clue
            </p>
            <button
              type="button"
              onClick={() => inspect(selectedEvidence)}
              className="mt-1 w-full text-left"
            >
              <h2 className="font-serif text-2xl font-bold text-ink">{selectedEvidence.title}</h2>
              <p className="mt-1 text-xs text-muted">Tap to inspect image, caption, and details</p>
            </button>
            <label className="mt-4 block font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase" htmlFor="deduction-note">
              Deduction note
            </label>
            <textarea
              id="deduction-note"
              rows={3}
              value={notes[selectedEvidence.id]}
              onChange={(event) =>
                setNotes((current) => ({
                  ...current,
                  [selectedEvidence.id]: event.target.value,
                }))
              }
              className="mt-1 w-full resize-none rounded-lg border border-hairline bg-[#F7F1E6] p-3 text-sm leading-snug text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
            <Button
              variant={progress.pinnedEvidenceIds.includes(selectedEvidence.id) ? "gold" : "bronze"}
              className="mt-3 w-full rounded-lg"
              onClick={() => togglePin(selectedEvidence.id)}
            >
              <Pin className="size-4" />
              {progress.pinnedEvidenceIds.includes(selectedEvidence.id) ? "Note pinned" : "Pin this note"}
            </Button>
          </section>

          <section className="mt-5 rounded-xl border border-hairline bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-xs font-bold tracking-[0.16em] text-gold uppercase">Pinned tray · {pinned.length}</p>
                <p className="text-xs text-muted">{pinned.length > 1 ? "Ready to compare deductions." : "Pin two clues to compare them."}</p>
              </div>
              <Button variant="bronze" disabled={pinned.length < 2} onClick={() => setCompareOpen(true)}>
                <Scale className="size-4" /> Compare
              </Button>
            </div>
            {pinned.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {pinned.map((item) => <span key={item.id} className="rounded-full bg-[#F7F1E6] px-2 py-1 text-[11px] text-ink">{item.title}</span>)}
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      {tab === "people" ? <PeopleRoster caseFile={pigeonCase} /> : null}
      {tab === "places" ? <PlacesRoster caseFile={pigeonCase} /> : null}

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[430px] border-t border-hairline bg-[#F7F1E6]/95 p-4 backdrop-blur">
        <Button asChild size="lg" className="w-full rounded-lg font-display text-base font-bold tracking-[0.12em] uppercase">
          <Link href={`/case/${pigeonCase.id}/accuse`}>Accuse when ready</Link>
        </Button>
        <p className="mt-1 text-center text-[11px] text-muted">{inspectedCount} of {totalClues} clues opened · People & Places stay in this locker</p>
      </div>

      <Dialog open={Boolean(openEvidence)} onOpenChange={(open) => !open && setOpenEvidence(null)}>
        {openEvidence ? (
          <DialogContent title="Inspect evidence" className="play-day max-h-[94dvh] overflow-y-auto">
            <p className="mb-3 font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
              Progress · {inspectedCount}/{totalClues} clues inspected
            </p>
            {pinned.length ? (
              <div className="mb-3 rounded-lg border border-hairline bg-[#F7F1E6] p-2">
                <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                  Pinned while you look · {pinned.length}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {pinned.map((item) => (
                    <span
                      key={item.id}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px]",
                        item.id === openEvidence.id ? "bg-gold font-semibold text-ink" : "bg-card text-ink",
                      )}
                    >
                      {item.title}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="relative h-[min(42dvh,20rem)] touch-pinch-zoom overflow-hidden rounded-lg bg-[#24282d]">
              <div
                className="h-full w-full origin-center transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
              >
                <EvidenceArt evidence={openEvidence} className="h-full w-full" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="font-serif text-xl font-bold leading-tight text-ink">{openEvidence.caption}</p>
              <div className="flex items-center rounded-full border border-hairline bg-card" aria-label="Evidence zoom controls">
                <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.5))} className="p-2 text-ink disabled:opacity-30" disabled={zoom === 1} aria-label="Zoom out"><Minus className="size-4" /></button>
                <span className="w-11 text-center text-xs font-bold text-ink">{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.5))} className="p-2 text-ink disabled:opacity-30" disabled={zoom === 3} aria-label="Zoom in"><Plus className="size-4" /></button>
                <button type="button" onClick={() => setZoom(1)} className="border-l border-hairline p-2 text-ink" aria-label="Reset zoom"><RotateCcw className="size-4" /></button>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-hairline bg-card p-3 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-gold" />
                <div><dt className="sr-only">Timestamp</dt><dd>{openEvidence.timestamp}</dd></div>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-gold" />
                <div><dt className="sr-only">Location</dt><dd>{openEvidence.location}</dd></div>
              </div>
            </dl>
            <p className="mt-2 text-sm leading-relaxed text-ink">{openEvidence.description}</p>
            <div className="mt-3">
              <p className="mb-1.5 font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                Linked people & place
              </p>
              <LinkChips caseFile={pigeonCase} links={linksForEvidence(pigeonCase, openEvidence)} />
            </div>
            <div className="mt-4 border-l-4 border-gold bg-[#F7F1E6] p-3">
              <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">Your deduction note</p>
              <p className="mt-1 text-sm font-semibold text-ink">{notes[openEvidence.id]}</p>
            </div>
            <Button className="mt-4 w-full rounded-lg" onClick={() => togglePin(openEvidence.id)}>
              <Pin className="size-4" /> {progress.pinnedEvidenceIds.includes(openEvidence.id) ? "Pinned to notes" : "Pin to notes"}
            </Button>
            <Button
              variant="bronze"
              className="mt-2 w-full rounded-lg"
              onClick={() => setCompareOpen(true)}
            >
              <Scale className="size-4" /> Compare
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="mt-2 w-full text-ink">Back to locker</Button>
            </DialogClose>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent title="Compare deductions" className="play-day max-h-[90dvh] overflow-y-auto">
          <p className="mb-3 text-sm leading-snug text-ink">
            Same person or place on more than one clue lights up under Shared links.
          </p>
          <CompareBoard caseFile={pigeonCase} items={comparisonItems} />
          <p className="mt-4 text-sm font-semibold text-ink">
            {comparisonItems.length > 1
              ? "Use the shared links to name Who / How / Where — then Accuse."
              : "Pin another clue to compare it with this evidence."}
          </p>
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
        active ? "bg-gold text-ink" : "text-muted hover:text-ink",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
