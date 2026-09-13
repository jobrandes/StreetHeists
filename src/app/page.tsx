"use client";

import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import { playableCases } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import Link from "next/link";
import { useMemo } from "react";

export default function HomeSplashPage() {
  const { alias, progressFor } = useHeists();

  const continueCase = useMemo(() => {
    for (const item of playableCases) {
      const progress = progressFor(item.id);
      if (progress.startedAt && !progress.lastVerdict?.correct) {
        return item;
      }
    }
    return null;
  }, [progressFor]);

  return (
    <main className="play-day relative flex min-h-dvh flex-col overflow-hidden">
      {/* Full-bleed atmosphere — cool street wash under paper light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% 18%, rgba(47,91,255,0.22), transparent 58%),
            linear-gradient(180deg, rgba(27,36,48,0.08) 0%, transparent 42%),
            linear-gradient(165deg, #D5DCE8 0%, #EEF2F6 38%, #C8D2E2 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] opacity-[0.14]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent 0,
            transparent 18px,
            rgba(27,36,48,0.35) 18px,
            rgba(27,36,48,0.35) 19px
          ), linear-gradient(180deg, transparent, rgba(27,36,48,0.25))`,
        }}
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 z-[1]" />

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-10 pt-8">
        <header className="flex items-center justify-between">
          <p className="font-display text-[10px] font-bold tracking-[0.22em] text-[#2F5BFF] uppercase">
            Comedy crime division
          </p>
          <span className="max-w-[7rem] truncate rounded-full border border-hairline bg-card/80 px-3 py-1 text-[11px] text-ink backdrop-blur-sm">
            {alias}
          </span>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <KeyholeLogo className="size-14 drop-shadow-[0_8px_18px_rgba(47,91,255,0.35)]" />
          <h1 className="mt-5 font-display text-[3.35rem] leading-[0.82] font-bold tracking-[0.08em] text-ink uppercase sm:text-[3.75rem]">
            Street
            <br />
            Heists
          </h1>
          <p className="mt-5 max-w-[16rem] font-serif text-xl leading-snug text-ink italic">
            Crack the case from your couch.
          </p>
          <p className="mt-3 max-w-[18rem] text-sm leading-snug text-muted">
            Inspect the evidence we give you. One accusation. No walking required.
          </p>

          <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
            <Button
              asChild
              size="xl"
              className="h-16 w-full rounded-lg font-display text-lg font-bold tracking-[0.14em] uppercase shadow-[0_6px_0_#2549d6]"
            >
              <Link href="/cases">Enter the division</Link>
            </Button>
            {continueCase ? (
              <Button
                asChild
                variant="bronze"
                size="lg"
                className="w-full rounded-lg font-display text-sm font-bold tracking-[0.1em] uppercase"
              >
                <Link href={`/case/${continueCase.id}`}>Continue {continueCase.title}</Link>
              </Button>
            ) : (
              <p className="text-[11px] text-muted">
                Case board unlocks harder files after a correct solve.
              </p>
            )}
          </div>
        </section>

        <p className="text-center font-display text-[10px] tracking-[0.2em] text-muted uppercase">
          Phone mystery · 5–10 min cases
        </p>
      </div>
    </main>
  );
}
