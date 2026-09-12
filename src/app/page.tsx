"use client";

import { EvidenceArt } from "@/components/evidence-art";
import { FirstRunCoach } from "@/components/first-run-coach";
import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { moreCases, playableCases, pigeonCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import Link from "next/link";
import { useState } from "react";

export default function CaseBoardPage() {
  const { alias, setAlias, progressFor, resetCase } = useHeists();
  const [nextAlias, setNextAlias] = useState(alias);
  const featuredProgress = progressFor(pigeonCase.id);
  const resume = Boolean(featuredProgress.startedAt);

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

      <div className="relative z-10 mx-2 mb-[-0.65rem] mt-5 w-fit -rotate-1 border border-[#2F5BFF] bg-[#DCE6FF] px-5 py-3 shadow-[4px_5px_0_rgba(27,36,48,0.14)]">
        <p className="font-display text-lg font-bold tracking-[0.14em] text-ink uppercase">
          Start here
        </p>
        <p className="text-xs font-medium text-ink">
          Case {String(pigeonCase.number).padStart(2, "0")} · tutorial · 5–10 min
        </p>
      </div>

      <Link
        href={`/case/${pigeonCase.id}`}
        className="block overflow-hidden rounded-2xl border border-hairline bg-card shadow-[0_18px_45px_rgba(27,36,48,0.14)]"
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
          <div className="mt-5 flex h-16 items-center justify-center rounded-lg bg-gold text-white shadow-[0_5px_0_#2549d6]">
            <span className="font-display text-xl font-bold tracking-[0.13em] uppercase">
              {resume ? "Resume this case" : "Start this case"}
            </span>
          </div>
        </div>
      </Link>

      <section className="mt-7">
        <h2 className="border-b border-hairline pb-2 font-display text-lg font-bold tracking-[0.18em] text-ink uppercase">
          Open cases
        </h2>
        <div className="divide-y divide-hairline rounded-b-xl border-x border-b border-hairline bg-card">
          {playableCases.map((item) => {
            const progress = progressFor(item.id);
            const solved = Boolean(progress.lastVerdict?.correct);
            return (
              <Link
                key={item.id}
                href={`/case/${item.id}`}
                className="block px-4 py-3 transition-colors hover:bg-[#E8EEF8]"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-serif text-lg font-semibold text-ink">{item.title}</p>
                  <p className="shrink-0 font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                    Case {String(item.number).padStart(2, "0")}
                  </p>
                </div>
                <p className="text-xs text-muted">{item.subtitle}</p>
                <p className="mt-1 text-[11px] font-medium text-ink">
                  {solved
                    ? "Solved"
                    : progress.startedAt
                      ? "In progress"
                      : item.id === pigeonCase.id
                        ? "Tutorial · physical evidence"
                        : "Witness clocks · false lead"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-7">
        <h2 className="border-b border-hairline pb-2 font-display text-lg font-bold tracking-[0.18em] text-ink uppercase">
          Coming soon
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

      {featuredProgress.startedAt ? (
        <button
          type="button"
          onClick={() => resetCase(pigeonCase.id)}
          className="mt-7 text-xs text-muted underline underline-offset-2"
        >
          Reset tutorial case progress
        </button>
      ) : null}
    </main>
  );
}
