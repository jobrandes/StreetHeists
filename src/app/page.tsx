"use client";

import { KeyholeLogo } from "@/components/keyhole-logo";
import { TextScaleToggle } from "@/components/text-scale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { VersionStamp } from "@/components/version-stamp";
import { playableCases } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import Image from "next/image";
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
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#1B2430] text-white">
      {/* Mock B — full-bleed street wash */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/splash/street-wash.jpg"
          alt=""
          fill
          priority
          sizes="430px"
          className="object-cover object-[center_35%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(27,36,48,0.55) 0%, rgba(27,36,48,0.28) 38%, rgba(27,36,48,0.72) 72%, rgba(27,36,48,0.92) 100%),
              radial-gradient(ellipse 80% 45% at 50% 20%, rgba(47,91,255,0.18), transparent 60%)
            `,
          }}
        />
      </div>
      <div aria-hidden className="grain pointer-events-none absolute inset-0 z-[1] opacity-40" />

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-10 pt-8">
        <header className="flex items-center justify-between gap-2">
          <p className="font-display text-xs font-bold tracking-[0.22em] text-[#9EB0FF] uppercase">
            Street Heists
          </p>
          <div className="flex items-center gap-2">
            <TextScaleToggle className="border-white/30 bg-white/10 text-white" />
            <span className="max-w-[7rem] truncate rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur-sm">
              {alias}
            </span>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <KeyholeLogo className="size-14 drop-shadow-[0_10px_24px_rgba(47,91,255,0.45)]" />
          <h1 className="mt-5 font-display text-[3.4rem] leading-[0.82] font-bold tracking-[0.08em] text-white uppercase sm:text-[3.8rem]">
            Street
            <br />
            Heists
          </h1>
          <p className="mt-5 font-serif text-2xl text-white/90 italic">Comedy crime division</p>
          <p className="mt-3 max-w-[20rem] text-base leading-snug text-white/80">
            Inspect the evidence we give you. One accusation. No walking required.
          </p>

          <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
            <Button
              asChild
              size="xl"
              className="h-16 w-full rounded-lg font-display text-lg font-bold tracking-[0.14em] uppercase shadow-[0_6px_0_#2549d6]"
            >
              <Link href="/cases">Open case board</Link>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="bronze"
                  size="lg"
                  className="w-full rounded-lg border-white/30 bg-white/10 font-display text-sm font-bold tracking-[0.1em] text-white uppercase backdrop-blur-sm hover:bg-white/18"
                >
                  How it works
                </Button>
              </DialogTrigger>
              <DialogContent title="How it works" className="play-day">
                <ol className="max-h-[min(58vh,28rem)] space-y-3 overflow-y-auto text-base leading-snug text-ink">
                  <li>
                    <span className="font-display text-xs font-bold tracking-[0.14em] text-gold uppercase">
                      1 · Case board
                    </span>
                    <p className="mt-1">Pick an unlocked file. Harder cases open only after a correct solve.</p>
                  </li>
                  <li>
                    <span className="font-display text-xs font-bold tracking-[0.14em] text-gold uppercase">
                      2 · Briefing
                    </span>
                    <p className="mt-1">Story beats — then enter the case rooms.</p>
                  </li>
                  <li>
                    <span className="font-display text-xs font-bold tracking-[0.14em] text-gold uppercase">
                      3 · Locker
                    </span>
                    <p className="mt-1">
                      Clues we give you (photos, docs, notes). Open each one in the Locker — takeaways auto-file.
                    </p>
                  </li>
                  <li>
                    <span className="font-display text-xs font-bold tracking-[0.14em] text-gold uppercase">
                      4 · Corkboard
                    </span>
                    <p className="mt-1">
                      Pin clues, string yarn, unlock stickies — then Accuse with Who / How / Where + proof.
                    </p>
                  </li>
                </ol>
                <p className="mt-3 text-base leading-snug text-muted">
                  Three rooms: Locker, Corkboard, Accuse. Tap{" "}
                  <strong className="font-semibold text-ink">Case file</strong> anytime — it
                  remembers so you don’t have to.
                </p>
                <Button asChild className="mt-4 w-full rounded-lg font-display tracking-[0.12em] uppercase">
                  <Link href="/cases">Open case board</Link>
                </Button>
              </DialogContent>
            </Dialog>

            {continueCase ? (
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="w-full rounded-lg font-display text-sm font-bold tracking-[0.1em] text-white/90 uppercase hover:bg-white/10"
              >
                <Link href={`/case/${continueCase.id}`}>Continue {continueCase.title}</Link>
              </Button>
            ) : null}
          </div>
        </section>

        <div className="flex flex-col items-center gap-1">
          <p className="text-center font-display text-[10px] tracking-[0.2em] text-white/55 uppercase">
            Phone mystery · 5–10 min cases
          </p>
          <VersionStamp tone="light" />
        </div>
      </div>
    </main>
  );
}
