"use client";

import { EvidenceArt } from "@/components/evidence-art";
import { FirstRunCoach } from "@/components/first-run-coach";
import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { moreCases, pigeonCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import Link from "next/link";
import { useState } from "react";

export default function CaseBoardPage() {
  const { alias, setAlias, progress, resetCase } = useHeists();
  const [nextAlias, setNextAlias] = useState(alias);
  const resume = Boolean(progress.startedAt);

  return (
    <main className="play-day flex min-h-dvh flex-col px-4 pb-8 pt-5">
      <header className="relative flex min-h-20 items-center justify-center text-center">
        <div>
          <KeyholeLogo className="mx-auto size-9" />
          <p className="font-display text-xl font-bold tracking-[0.24em] text-ink uppercase">
            Street Heists
          </p>
          <p className="font-serif text-sm italic text-muted">Comedy crime division</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="absolute right-0 top-3 max-w-20 truncate rounded-full border border-hairline bg-card px-3 py-1.5 text-xs text-ink">
              {alias}
            </button>
          </DialogTrigger>
          <DialogContent title="Investigator alias" className="play-day">
            <p className="mb-3 text-sm text-muted">Printed on your solved-case poster.</p>
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
      </header>

      <FirstRunCoach />

      <div className="relative z-10 mx-2 mb-[-0.65rem] mt-5 w-fit -rotate-1 border border-[#B9961F] bg-[#E2CA68] px-5 py-3 shadow-[4px_5px_0_rgba(28,31,38,0.18)]">
        <p className="font-display text-lg font-bold tracking-[0.14em] text-ink uppercase">
          Start here
        </p>
        <p className="text-xs font-medium text-ink">
          Case {String(pigeonCase.number).padStart(2, "0")} · 5–10 minute couch mystery
        </p>
      </div>

      <Link
        href={`/case/${pigeonCase.id}`}
        className="block overflow-hidden rounded-2xl border border-hairline bg-card shadow-[0_18px_45px_rgba(28,31,38,0.14)]"
      >
        <EvidenceArt evidence={pigeonCase.evidence[3]} className="h-40" />
        <div className="p-5">
          <p className="font-display text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
            Featured investigation
          </p>
          <h1 className="mt-1 font-serif text-[2.9rem] font-bold leading-[0.86] text-ink">
            {pigeonCase.title}
          </h1>
          <p className="mt-3 text-[15px] leading-snug text-ink">{pigeonCase.subtitle}</p>
          <div className="mt-5 flex h-16 items-center justify-center rounded-lg bg-gold text-ink shadow-[0_5px_0_#90751c]">
            <span className="font-display text-xl font-bold tracking-[0.13em] uppercase">
              Start this case
            </span>
          </div>
          {resume ? (
            <p className="mt-3 text-center text-xs font-medium text-muted">
              Your opened evidence and pinned deductions are waiting.
            </p>
          ) : null}
        </div>
      </Link>

      <section className="mt-7">
        <h2 className="border-b border-hairline pb-2 font-display text-lg font-bold tracking-[0.18em] text-ink uppercase">
          More Cases
        </h2>
        <div className="divide-y divide-hairline rounded-b-xl border-x border-b border-hairline bg-card">
          {moreCases.map((item) => (
            <div key={item.title} className="px-4 py-3">
              <p className="font-serif text-lg font-semibold text-ink">{item.title}</p>
              <p className="text-xs text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {progress.startedAt ? (
        <button
          type="button"
          onClick={resetCase}
          className="mt-7 text-xs text-muted underline underline-offset-2"
        >
          Reset case progress
        </button>
      ) : null}
    </main>
  );
}
