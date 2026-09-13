"use client";

import { Button } from "@/components/ui/button";
import { difficultyLabel, isCaseUnlocked } from "@/lib/investigation";
import { getCase, playableCases } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import { ChevronLeft, Clapperboard } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function BriefingPage() {
  const { id } = useParams<{ id: string }>();
  const { openCase, progressFor } = useHeists();
  const caseFile = getCase(id);

  const progressMap = useMemo(
    () =>
      Object.fromEntries(playableCases.map((item) => [item.id, progressFor(item.id)])),
    [progressFor],
  );

  if (!caseFile) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case not filed.</h1>
          <Button asChild className="mt-4">
            <Link href="/">Return to Case Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!isCaseUnlocked(caseFile, progressMap)) {
    const prior = playableCases.find((item) => item.id === caseFile.unlockAfterCaseId);
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case still locked.</h1>
          <p className="mt-2 text-sm text-muted">
            Solve {prior?.title ?? "the prior case"} correctly to unlock this file.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Return to Case Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="play-day min-h-dvh px-4 pb-8 pt-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 font-display text-xs font-bold tracking-[0.16em] text-muted uppercase"
      >
        <ChevronLeft className="size-4" /> Case Board
      </Link>

      <header className="mt-5 border-b border-hairline pb-4">
        <p className="font-display text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
          Briefing · Case {String(caseFile.number).padStart(2, "0")} ·{" "}
          {difficultyLabel(caseFile.difficulty)}
        </p>
        <h1 className="mt-1 font-serif text-[3.4rem] font-bold leading-[0.83] text-ink">
          {caseFile.title}
        </h1>
        <p className="mt-3 text-base leading-snug text-ink">{caseFile.subtitle}</p>
        <p className="mt-4 inline-block border-l-4 border-gold bg-card px-3 py-2 text-sm font-semibold text-ink">
          Read the beats, then work the locker and scene desk before you accuse.
        </p>
      </header>

      <ol className="divide-y divide-hairline border-b border-hairline">
        {caseFile.briefing.map((row, index) => (
          <li key={row.title} className="grid grid-cols-[2.25rem_1fr] gap-3 py-4">
            <span className="font-display text-3xl font-bold leading-none text-gold">
              {index + 1}
            </span>
            <div>
              <h2 className="font-display text-sm font-bold tracking-[0.06em] text-ink uppercase">
                {row.title}
              </h2>
              <p className="mt-1 text-sm leading-snug text-ink">{row.copy}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-2">
        <Button
          asChild
          size="xl"
          className="w-full rounded-lg font-display text-lg font-bold tracking-[0.12em] uppercase"
        >
          <Link href={`/case/${caseFile.id}/evidence`} onClick={() => openCase(caseFile.id)}>
            OPEN EVIDENCE LOCKER
          </Link>
        </Button>
        <Button
          asChild
          variant="bronze"
          size="lg"
          className="w-full rounded-lg font-display text-sm font-bold tracking-[0.1em] uppercase"
        >
          <Link href={`/case/${caseFile.id}/reconstruct`} onClick={() => openCase(caseFile.id)}>
            <Clapperboard className="size-4" /> Scene desk
          </Link>
        </Button>
      </div>
    </main>
  );
}
