"use client";

import { ShareExports } from "@/components/share-cards";
import { WaxSeal } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import { pigeonCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import { formatElapsed } from "@/lib/utils";
import { Trophy, XCircle } from "lucide-react";
import Link from "next/link";

function accusationLabels(accusation: { who: string; how: string; where: string }) {
  return {
    who: pigeonCase.suspects.find((item) => item.id === accusation.who)?.name ?? "Unknown",
    how: pigeonCase.howChoices.find((item) => item.id === accusation.how)?.label ?? "Unknown",
    where: pigeonCase.whereChoices.find((item) => item.id === accusation.where)?.label ?? "Unknown",
  };
}

export default function VerdictPage() {
  const { progress, alias } = useHeists();
  const verdict = progress.lastVerdict;

  if (!verdict) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">No accusation on file.</h1>
          <Button asChild className="mt-4"><Link href={`/case/${pigeonCase.id}/evidence`}>Review evidence</Link></Button>
        </div>
      </main>
    );
  }

  const chosen = accusationLabels(verdict.accusation);
  const revealed = accusationLabels(pigeonCase.solution);

  return (
    <main
      className={
        verdict.correct
          ? "min-h-dvh bg-[#0B0B0C] px-4 pb-10 pt-7 text-[#F2F0EA] [--color-card:#161618] [--color-hairline:#5f522c] [--color-ink:#F2F0EA] [--color-muted:#B7B1A4]"
          : "play-day min-h-dvh px-4 pb-10 pt-7"
      }
    >
      <header className={verdict.correct ? "relative overflow-hidden border border-gold/60 bg-[radial-gradient(circle_at_top,#292313,#0B0B0C_65%)] px-5 pb-6 pt-5" : "border-t-8 border-fail pt-5"}>
        <div className="flex items-center gap-2">
          {verdict.correct ? <Trophy className="size-7 text-gold" /> : <XCircle className="size-7 text-fail" />}
          <p className={`font-display text-sm font-bold tracking-[0.2em] uppercase ${verdict.correct ? "text-gold" : "text-fail"}`}>
            {verdict.correct ? "Midnight Crew trophy" : "Theory rejected"}
          </p>
        </div>
        <h1 className="mt-2 font-serif text-[3rem] font-bold leading-[0.9] text-ink">
          {verdict.correct ? "Case closed." : "The baguette remains at large."}
        </h1>
        <p className={`mt-3 text-sm leading-relaxed text-ink ${verdict.correct ? "max-w-[14rem]" : ""}`}>
          {verdict.correct
            ? "Marcel offers no comment, then eats part of Exhibit A."
            : chosen.who === "Marcel"
              ? "Right bird, shaky paperwork. Your method or hiding place contradicts the evidence."
              : `${chosen.who} has been dramatically cleared. Marcel watches from above with the composure of a tiny landlord.`}
        </p>
        {verdict.correct ? <WaxSeal label="Case closed" className="absolute bottom-5 right-4 size-24" /> : null}
      </header>

      <section className="mt-5 rounded-xl border border-hairline bg-card p-4">
        <p className="font-display text-[10px] font-bold tracking-[0.18em] text-gold uppercase">
          {verdict.correct ? "Who / How / Where revealed" : "Your accusation"}
        </p>
        <dl className="mt-3 space-y-2 text-sm">
          <div><dt className="inline font-bold text-gold">Who: </dt><dd className="inline text-ink">{verdict.correct ? revealed.who : chosen.who}</dd></div>
          <div><dt className="inline font-bold text-gold">How: </dt><dd className="inline text-ink">{verdict.correct ? revealed.how : chosen.how}</dd></div>
          <div><dt className="inline font-bold text-gold">Where: </dt><dd className="inline text-ink">{verdict.correct ? revealed.where : chosen.where}</dd></div>
        </dl>
      </section>

      {verdict.correct ? (
        <>
          <section className="mt-4 grid grid-cols-2 gap-3">
            <Stat label="Solved in" value={formatElapsed(verdict.elapsedMs)} />
            <Stat label="Ruling" value={verdict.wrongAttempts === 0 ? "Clean solve" : `${verdict.wrongAttempts} retry`} />
          </section>
          <div className="mt-4 rounded-xl border-2 border-gold bg-gold/10 p-4">
            <p className="font-display text-sm font-bold tracking-[0.14em] text-gold uppercase">
              {verdict.wrongAttempts === 0 ? "Clean-solve bonus · +500" : "Persistence bonus · +200"}
            </p>
            <p className="mt-1 text-sm text-ink">{verdict.wrongAttempts === 0 ? "One accusation. Surgical crumb work." : "The first theory wobbled. The final one held."}</p>
          </div>
          <section className="mt-6">
            <h2 className="font-display text-lg font-bold tracking-[0.14em] text-ink uppercase">Why it fits</h2>
            <ol className="mt-2 space-y-2">
              {pigeonCase.explanation.map((item, index) => <li key={item} className="flex gap-2 text-sm text-ink"><span className="font-bold text-gold">{index + 1}.</span>{item}</li>)}
            </ol>
          </section>
          <div className="mt-8"><ShareExports verdict={verdict} alias={alias} /></div>
          <Button asChild variant="bronze" className="mt-7 w-full"><Link href="/">Back to Case Board</Link></Button>
        </>
      ) : (
        <>
          <div className="mt-5 rounded-xl border border-fail/40 bg-fail/5 p-4">
            <p className="font-display text-sm font-bold tracking-[0.12em] text-fail uppercase">Evidence check</p>
            <p className="mt-1 text-sm text-ink">Re-open the feather, crumb trail, and fountain still. Ask what links the sill to the statue.</p>
          </div>
          <Button asChild size="lg" className="mt-5 w-full rounded-lg font-display font-bold tracking-[0.12em] uppercase"><Link href={`/case/${pigeonCase.id}/accuse`}>Retry accusation</Link></Button>
          <Button asChild variant="bronze" className="mt-3 w-full"><Link href={`/case/${pigeonCase.id}/evidence`}>Review evidence</Link></Button>
          <p className="mt-3 text-center text-xs text-muted">All opened and pinned evidence is preserved.</p>
        </>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-hairline bg-card p-3"><p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">{label}</p><p className="mt-1 font-serif text-xl font-bold text-ink">{value}</p></div>;
}
