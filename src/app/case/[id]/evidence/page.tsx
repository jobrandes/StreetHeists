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
