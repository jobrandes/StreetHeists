"use client";

import { EvidenceArt } from "@/components/evidence-art";
import { FirstRunCoach } from "@/components/first-run-coach";
import { KeyholeLogo } from "@/components/keyhole-logo";
import { TextScaleToggle } from "@/components/text-scale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VersionStamp } from "@/components/version-stamp";
import { difficultyLabel, isCaseUnlocked } from "@/lib/investigation";
import {
  lastToastCase,
  moreCases,
  playableCases,
  pigeonCase,
} from "@/lib/seed";
import { useHeists } from "@/lib/store";
import { Fingerprint, Lock, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

/** Pigeon board still — seed location/caption only (never mock “Shadow Heights”). */
const pigeonBoardStill =
  pigeonCase.evidence.find((item) => item.id === "statue-nest") ??
  pigeonCase.evidence[0];

const lastToastBoardStill =
  lastToastCase.evidence.find((item) => item.id === "cctv-916") ??
  lastToastCase.evidence[0];

export default function CaseBoardPage() {
  const { alias, setAlias, progressFor, resetCase } = useHeists();
  const [nextAlias, setNextAlias] = useState(alias);
  const featuredProgress = progressFor(lastToastCase.id);
  const tutorialProgress = progressFor(pigeonCase.id);
  const resumeFeatured = Boolean(featuredProgress.startedAt);
  const resumeTutorial = Boolean(tutorialProgress.startedAt);

  const progressMap = useMemo(
    () =>
      Object.fromEntries(
        playableCases.map((item) => [item.id, progressFor(item.id)]),
      ),
    [progressFor],
  );

  const secondaryCases = playableCases.filter(
    (item) => item.id !== lastToastCase.id && item.id !== pigeonCase.id,
  );

  return (
    <main className="play-day relative flex min-h-dvh flex-col overflow-x-hidden px-4 pb-10 pt-0">
      <header className="sticky top-0 z-20 -mx-4 flex items-center justify-between gap-3 border-b border-[#1B2430]/80 bg-[#1B2430] px-4 py-3 text-[#F2F0EA]">
        <Link href="/" className="min-w-0">
          <div className="flex items-center gap-2">
            <KeyholeLogo className="size-7" gold />
            <div>
              <p className="font-display text-sm font-bold tracking-[0.2em] uppercase">
                Street Heists
              </p>
              <p className="font-display text-[10px] font-bold tracking-[0.18em] text-[#C9A227] uppercase">
                Case board v0.2
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-1.5 font-display text-[10px] font-bold tracking-[0.16em] text-[#C9A227] uppercase sm:inline-flex">
            Play day
            <span className="inline-block size-1.5 rotate-45 bg-[#C9A227]" aria-hidden />
          </span>
          <span className="rounded-sm border border-[#F2F0EA]/35 px-2 py-1 font-display text-[10px] font-bold tracking-[0.18em] uppercase">
            No map
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="max-w-[5.5rem] truncate rounded-full border border-[#F2F0EA]/30 bg-[#F2F0EA]/10 px-3 py-1.5 text-xs font-semibold"
              >
                {alias}
              </button>
            </DialogTrigger>
            <DialogContent title="Investigator alias" className="play-day">
              <p className="mb-3 text-sm text-muted">
                Printed on your solved-case poster.
              </p>
              <Input
                value={nextAlias}
                onChange={(event) => setNextAlias(event.target.value)}
                maxLength={28}
              />
              <Button className="mt-4 w-full" onClick={() => setAlias(nextAlias)}>
                Save alias
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="mt-3 flex justify-end">
        <TextScaleToggle />
      </div>

      <FirstRunCoach />

      <div className="relative mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-5">
        <aside className="order-3 hidden space-y-3 lg:order-1 lg:block">
          <StickyNote rotate={-2}>
            Every case has a crack. Find it before they do.
          </StickyNote>
          <StickyNote rotate={1.5} tone="gold">
            Comedy in the cracks. Stakes in the case.
          </StickyNote>
        </aside>

        {/* FEATURED — The Last Toast */}
        <Link
          href={`/case/${lastToastCase.id}`}
          className="order-1 relative block overflow-hidden rounded-sm border border-[#1B2430]/25 bg-[#F7F1E6] shadow-[0_12px_28px_rgba(27,36,48,0.14)] lg:order-2"
        >
          <span className="absolute top-0 left-0 z-10 inline-flex items-center gap-1 bg-[#1B2430] px-3 py-1.5 font-display text-[10px] font-bold tracking-[0.14em] text-[#F2F0EA] uppercase shadow">
            <Star className="size-3 fill-current text-[#C9A227]" /> Featured
          </span>
          <div className="grid gap-0 sm:grid-cols-[1.1fr_0.9fr]">
            <EvidenceArt
              evidence={lastToastBoardStill}
              className="h-40 w-full sm:h-full sm:min-h-[11rem]"
              priority
            />
            <div className="relative border-t border-[#1B2430]/10 p-4 sm:border-t-0 sm:border-l">
              <p className="font-display text-[10px] font-bold tracking-[0.14em] text-[#8A5A22] uppercase">
                Charity gala · $2M necklace
              </p>
              <h1 className="mt-1 font-serif text-[2.15rem] font-bold leading-[0.9] tracking-tight text-ink uppercase">
                {lastToastCase.title}
              </h1>
              <p className="mt-2 text-sm leading-snug text-ink">
                Elena Voss about to be blamed.
              </p>
              <p className="mt-3 line-clamp-2 text-xs text-muted">
                {lastToastCase.subtitle}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-sm border border-[#1B2430]/20 bg-[#1B2430] px-3 py-2.5 font-display text-[11px] font-bold tracking-[0.14em] text-[#F2F0EA] uppercase">
                <Fingerprint className="size-3.5 text-[#C9A227]" />
                {resumeFeatured ? "Resume this case" : "Start this case"}
                <span aria-hidden>→</span>
              </div>
            </div>
          </div>
        </Link>

        {/* TUTORIAL — The Pigeon Job + START HERE */}
        <div className="order-2 relative lg:order-3">
          <div className="mb-2 flex items-end justify-center gap-2 lg:absolute lg:-top-10 lg:right-2 lg:mb-0 lg:justify-end">
            <p className="start-here-nudge font-serif text-lg font-bold tracking-tight text-[#1B2430] italic">
              Start here
            </p>
            <svg
              className="start-here-arrow size-10 text-[#1B2430] lg:size-12"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden
            >
              <path
                d="M10 8c8 2 18 10 22 22"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M26 28l8 4-2 9"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <Link
            href={`/case/${pigeonCase.id}`}
            className="relative block overflow-hidden rounded-sm border-2 border-[#C9A227]/70 bg-[#FFFCF6] shadow-[0_12px_28px_rgba(27,36,48,0.12)]"
            aria-label={`Start here: ${pigeonCase.title} tutorial. Evidence still: ${pigeonBoardStill.location}`}
          >
            <span className="absolute top-0 left-0 z-10 inline-flex items-center gap-1 bg-[#C9A227] px-3 py-1.5 font-display text-[10px] font-bold tracking-[0.14em] text-[#1A1408] uppercase shadow">
              <Star className="size-3 fill-current" /> Tutorial
            </span>
            <div className="p-4 pt-10">
              <h2 className="font-serif text-[2.05rem] font-bold leading-[0.9] tracking-tight text-ink uppercase">
                {pigeonCase.title}
              </h2>
              <p className="mt-2 text-sm leading-snug text-ink">
                New players — learn the ropes here first, then the gala.
              </p>

              <div className="mt-4 rotate-1 border border-[#1B2430]/20 bg-white p-1.5 shadow-md">
                <EvidenceArt
                  evidence={pigeonBoardStill}
                  className="aspect-[4/3] w-full"
                />
                <div className="px-1.5 pt-1.5 pb-1">
                  <p className="font-display text-[9px] font-bold tracking-[0.14em] text-[#8A5A22] uppercase">
                    Evidence photo
                  </p>
                  {/* Seed location + caption — never mock “Shadow Heights rooftop” */}
                  <p className="mt-0.5 font-serif text-xs font-semibold text-ink">
                    {pigeonBoardStill.location}
                  </p>
                  <p className="text-[11px] text-muted">{pigeonBoardStill.caption}</p>
                </div>
              </div>

              <div className="mt-4 flex h-12 items-center justify-center rounded-sm bg-[#1B2430] font-display text-[12px] font-bold tracking-[0.14em] text-[#F2F0EA] uppercase">
                {resumeTutorial ? "Resume tutorial" : "Start tutorial"}
                <span className="ml-2" aria-hidden>
                  →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <aside className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
        <StickyNote rotate={-1.5}>
          Every case has a crack. Find it before they do.
        </StickyNote>
        <StickyNote rotate={1} tone="gold">
          Comedy in the cracks. Stakes in the case.
        </StickyNote>
      </aside>

      <section className="mt-8">
        <h2 className="border-b border-hairline pb-2 font-display text-lg font-bold tracking-[0.18em] text-ink uppercase">
          More cases
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {secondaryCases.map((item) => {
            const unlocked = isCaseUnlocked(item, progressMap);
            const progress = progressFor(item.id);
            const solved = Boolean(progress.lastVerdict?.correct);
            const prior = item.unlockAfterCaseId
              ? playableCases.find((c) => c.id === item.unlockAfterCaseId)
              : null;
            const body = (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 font-serif text-lg font-semibold text-ink">
                    {!unlocked ? <Lock className="size-3.5 text-muted" /> : null}
                    {item.title}
                  </p>
                  <p className="shrink-0 font-display text-[10px] font-bold tracking-[0.12em] text-gold uppercase">
                    {difficultyLabel(item.difficulty)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted">{item.subtitle}</p>
                <p className="mt-1 text-[11px] font-medium text-ink">
                  {!unlocked
                    ? `Locked · solve ${prior?.title ?? "the prior case"} first`
                    : solved
                      ? "Solved"
                      : progress.startedAt
                        ? "In progress"
                        : "Ready when you are"}
                </p>
              </>
            );
            return unlocked ? (
              <Link
                key={item.id}
                href={`/case/${item.id}`}
                className="rounded-xl border border-hairline bg-card p-3 transition-colors hover:bg-[#E8EEF8]"
              >
                {body}
              </Link>
            ) : (
              <div
                key={item.id}
                className="rounded-xl border border-hairline bg-card/70 p-3 opacity-75"
                aria-disabled
              >
                {body}
              </div>
            );
          })}
          {moreCases.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-dashed border-hairline bg-card/60 p-3 opacity-80"
            >
              <p className="inline-flex items-center gap-1.5 font-serif text-lg font-semibold text-ink">
                <Lock className="size-3.5 text-muted" />
                {item.title}
              </p>
              <p className="mt-1 text-xs text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {featuredProgress.startedAt || tutorialProgress.startedAt ? (
        <button
          type="button"
          onClick={() => resetCase(pigeonCase.id)}
          className="mt-6 text-xs text-muted underline underline-offset-2"
        >
          Reset tutorial case progress
        </button>
      ) : null}

      <div className="mt-8 flex flex-col items-center gap-2">
        <VersionStamp />
        <p className="font-display text-[9px] tracking-[0.16em] text-muted uppercase">
          Street Heists · field notes only
        </p>
      </div>
    </main>
  );
}

function StickyNote({
  children,
  rotate = 0,
  tone = "cream",
}: {
  children: React.ReactNode;
  rotate?: number;
  tone?: "cream" | "gold";
}) {
  return (
    <div
      className={`border border-[#1B2430]/15 px-3 py-3 font-serif text-sm leading-snug text-ink shadow-[0_2px_0_rgba(27,36,48,0.08)] ${
        tone === "gold" ? "bg-[#F0E0B8]" : "bg-[#FFF8EE]"
      }`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}
