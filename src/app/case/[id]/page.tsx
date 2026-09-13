"use client";

import { CaseChrome } from "@/components/case-chrome";
import { FirstUseTip } from "@/components/first-use-tip";
import { Button } from "@/components/ui/button";
import { difficultyLabel, isCaseUnlocked } from "@/lib/investigation";
import { getCase, playableCases } from "@/lib/seed";
import { useHeists } from "@/lib/store";
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
            <Link href="/cases">Return to Case Board</Link>
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
          <p className="mt-2 text-base text-muted">
            Solve {prior?.title ?? "the prior case"} correctly to unlock this file.
          </p>
          <Button asChild className="mt-4">
            <Link href="/cases">Return to Case Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  const progress = progressFor(caseFile.id);

  return (
    <CaseChrome
      caseFile={caseFile}
      progress={progress}
      step="briefing"
      backHref="/cases"
      backLabel="Case Board"
    >
      <header className="border-b border-hairline pb-4">
        <p className="font-display text-xs font-bold tracking-[0.22em] text-gold uppercase">
          Briefing · Case {String(caseFile.number).padStart(2, "0")} ·{" "}
          {difficultyLabel(caseFile.difficulty)}
        </p>
        <h1 className="mt-1 font-serif text-[3.4rem] font-bold leading-[0.83] text-ink">
          {caseFile.title}
        </h1>
        <p className="mt-3 text-lg leading-snug text-ink">{caseFile.subtitle}</p>
        <FirstUseTip
          tipId="briefing-two-rooms"
          className="mt-3"
          text="Only two rooms after this: Gather (clues we give you) and Decide (Who / How / Where + proof). Case file remembers everything."
        />
        <p className="mt-4 inline-block border-l-4 border-gold bg-card px-3 py-2 text-base font-semibold text-ink">
          Read the beats, then Gather clues before you Decide.
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
              <p className="mt-1 text-base leading-snug text-ink">{row.copy}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-2">
        <Button
          asChild
          size="xl"
          className="h-14 w-full rounded-xl font-display text-lg font-bold tracking-[0.12em] uppercase"
        >
          <Link href={`/case/${caseFile.id}/evidence`} onClick={() => openCase(caseFile.id)}>
            Start Gather
          </Link>
        </Button>
        <Button
          asChild
          variant="bronze"
          size="lg"
          className="h-12 w-full rounded-xl font-display text-sm font-bold tracking-[0.1em] uppercase"
        >
          <Link href={`/case/${caseFile.id}/accuse`} onClick={() => openCase(caseFile.id)}>
            Jump to Decide
          </Link>
        </Button>
      </div>
    </CaseChrome>
  );
}
