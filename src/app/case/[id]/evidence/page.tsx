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
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { getCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import type { Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
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
import { useState, type ReactNode } from "react";

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
