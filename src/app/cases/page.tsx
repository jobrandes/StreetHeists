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
import { Coffee, Lock, MapPin, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function CaseBoardPage() {
  const { alias, setAlias, progressFor, resetCase } = useHeists();
  const [nextAlias, setNextAlias] = useState(alias);
  const featuredProgress = progressFor(lastToastCase.id);
  const resume = Boolean(featuredProgress.startedAt);

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
    <main className="play-day flex min-h-dvh flex-col px-4 pb-10 pt-5">
      <header className="flex items-start justify-between gap-3">
        <Link href="/" className="min-w-0">
          <div className="flex items-center gap-2">
            <KeyholeLogo className="size-8" />
            <div>
              <p className="font-display text-sm font-bold tracking-[0.2em] text-ink uppercase">
                Street Heists
              </p>
              <p className="font-display text-[10px] font-bold tracking-[0.18em] text-gold uppercase">
                Case board v0.2
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden max-w-[9rem] items-center gap-1.5 rounded-md border border-dashed border-[#C4A574] bg-[#FFF8EE] px-2 py-1.5 sm:flex">
            <Coffee className="size-3.5 shrink-0 text-[#8A5A22]" />
            <p className="font-serif text-[10px] leading-tight text-ink italic">
              Coffee. Clues. Questionable decisions.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="max-w-[5.5rem] truncate rounded-full border border-hairline bg-card px-3 py-1.5 text-xs font-semibold text-ink"
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

      <FirstRunCoach />

      <div className="mt-3 flex justify-end">
        <TextScaleToggle />
      </div>

      <p className="mt-4 inline-flex items-center gap-2 font-display text-[11px] font-bold tracking-[0.16em] text-[#2F5BFF] uppercase">
        <span aria-hidden>→</span> Start here
      </p>
      <p className="mt-1 text-sm text-ink">
        New to Street Heists? Begin with{" "}
        <span className="font-semibold">The Last Toast</span>.
      </p>

      <Link
        href={`/case/${lastToastCase.id}`}
        className="relative mt-3 block overflow-hidden rounded-2xl border-2 border-[#C4A574]/70 bg-[#F7F1E6] shadow-[0_14px_36px_rgba(27,36,48,0.14)]"
      >
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-sm border border-[#8A5A22]/40 bg-[#E8D4B0] px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.14em] text-ink uppercase shadow">
          <Star className="size-3 fill-current" /> Featured
        </span>
        <EvidenceArt
          evidence={lastToastCase.evidence[1] ?? lastToastCase.evidence[0]}
          className="h-44 w-full"
        />
        <div className="p-5">
          <h1 className="font-serif text-[2.6rem] font-bold leading-[0.88] tracking-tight text-ink uppercase">
            {lastToastCase.title}
          </h1>
          <p className="mt-2 inline-flex items-center gap-1.5 font-display text-[11px] font-bold tracking-[0.14em] text-[#8A5A22] uppercase">
            <MapPin className="size-3.5" /> Charity gala
          </p>
          <p className="mt-3 text-[15px] leading-snug text-ink">
            {lastToastCase.subtitle}
          </p>
          <p className="mt-3 inline-flex items-start gap-2 text-sm text-ink">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />
            <span>
              <span className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                Stakes ·{" "}
              </span>
              Her reputation. Your case.
            </span>
          </p>
          <div className="mt-5 flex h-14 items-center justify-center rounded-xl bg-[#D4B483] font-display text-lg font-bold tracking-[0.12em] text-ink uppercase shadow-[0_4px_0_rgba(120,80,30,0.28)]">
            {resume ? "Resume this case" : "Start this case"}
          </div>
        </div>
      </Link>

      <p className="mt-4 text-center text-xs text-muted">
        Every case has clues. Every choice has stakes.
      </p>

      <section className="mt-6 rounded-2xl border border-hairline bg-card p-4 shadow-[0_2px_0_rgba(27,36,48,0.06)]">
        <span className="inline-flex rounded-sm border border-[#2F5BFF]/35 bg-[#DCE6FF] px-2 py-1 font-display text-[10px] font-bold tracking-[0.14em] text-[#2F5BFF] uppercase">
          Tutorial
        </span>
        <div className="mt-3 flex gap-3">
          <EvidenceArt
            evidence={pigeonCase.evidence[0]}
            className="size-20 shrink-0 rounded-md"
          />
          <div className="min-w-0">
            <h2 className="font-serif text-2xl font-bold leading-tight text-ink">
              {pigeonCase.title}
            </h2>
            <p className="mt-1 text-sm leading-snug text-ink">
              Learn the ropes with a feathered thief and zero pressure.
            </p>
            <p className="mt-2 text-xs font-medium text-muted">
              Perfect for first-timers. (And pigeon fans.)
            </p>
          </div>
        </div>
        <Button asChild variant="bronze" className="mt-4 w-full rounded-xl">
          <Link href={`/case/${pigeonCase.id}`}>View tutorial case →</Link>
        </Button>
      </section>

      <section className="mt-7">
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

      <p className="mt-8 rounded-md border border-dashed border-[#C4A574]/60 bg-[#FFF8EE] px-3 py-2 text-center font-serif text-xs text-ink italic">
        One wrong move. One clever twist. That&apos;s the fun. — E
      </p>

      {featuredProgress.startedAt || progressFor(pigeonCase.id).startedAt ? (
        <button
          type="button"
          onClick={() => resetCase(pigeonCase.id)}
          className="mt-6 text-xs text-muted underline underline-offset-2"
        >
          Reset tutorial case progress
        </button>
      ) : null}

      <div className="mt-8 flex justify-center">
        <VersionStamp />
      </div>
    </main>
  );
}
