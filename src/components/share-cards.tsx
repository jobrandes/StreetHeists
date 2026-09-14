"use client";

/**
 * Midnight share cards — public exports are spoiler-safe by design.
 * Never print Who / How / Where on Card A or Card C. The triad lives only
 * on the in-app verdict screen.
 */

import { toPng } from "html-to-image";
import { Download, Share2, Trophy } from "lucide-react";
import { useRef, useState } from "react";
import { EvidenceArt } from "@/components/evidence-art";
import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import type { CaseFile, Verdict } from "@/lib/types";
import { formatElapsed } from "@/lib/utils";

/** Decorative corkboard pins — mood only, never the solution triad. */
const YARN_PINS = [
  { x: 18, y: 22, rotate: -8, label: "Still" },
  { x: 58, y: 18, rotate: 6, label: "Note" },
  { x: 28, y: 58, rotate: 4, label: "Clip" },
  { x: 68, y: 62, rotate: -5, label: "Tag" },
] as const;

function CaseClosedSeal({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative grid place-items-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#E8C75A,#C9A227_42%,#8A6E2F_72%,#5E4A1E)] text-[#1A1408] shadow-[0_10px_28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.35)] ${className}`}
      aria-hidden
    >
      <div className="absolute inset-[6%] rounded-full border border-[#1A1408]/25" />
      <div className="absolute inset-[12%] rounded-full border border-[#F2E2A8]/35" />
      <KeyholeLogo className="size-8" gold />
      <p className="mt-1 font-display text-[11px] font-bold tracking-[0.18em] uppercase">
        Case closed
      </p>
      <div className="mt-1 flex gap-1">
        {[0, 1, 2].map((star) => (
          <span key={star} className="text-[10px] leading-none text-[#1A1408]">
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

function CorkYarnBoard({ caseFile }: { caseFile: CaseFile }) {
  const still =
    caseFile.evidence.find((item) => item.kind === "still") ?? caseFile.evidence[0];

  return (
    <div className="relative h-full min-h-[200px] overflow-hidden rounded-md border border-[#5F522C] bg-[#2A2118] shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(120,90,50,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(90,60,30,0.4), transparent 40%), repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px)",
        }}
      />
      {still ? (
        <div className="absolute top-[14%] left-[10%] w-[38%] rotate-[-6deg] border border-[#F2F0EA]/80 bg-[#F2F0EA] p-1 shadow-md">
          <EvidenceArt evidence={still} className="aspect-[4/3] w-full grayscale" />
          <p className="mt-1 truncate px-0.5 font-display text-[8px] font-bold tracking-[0.12em] text-[#1A1408] uppercase">
            Filed still
          </p>
        </div>
      ) : null}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line
          x1="22"
          y1="28"
          x2="50"
          y2="48"
          stroke="#7A1F1F"
          strokeWidth="1.1"
          strokeOpacity="0.9"
        />
        <line
          x1="62"
          y1="24"
          x2="50"
          y2="48"
          stroke="#7A1F1F"
          strokeWidth="1.1"
          strokeOpacity="0.85"
        />
        <line
          x1="32"
          y1="64"
          x2="50"
          y2="48"
          stroke="#7A1F1F"
          strokeWidth="0.9"
          strokeOpacity="0.75"
        />
        <line
          x1="72"
          y1="68"
          x2="50"
          y2="48"
          stroke="#7A1F1F"
          strokeWidth="0.9"
          strokeOpacity="0.75"
        />
      </svg>
      {YARN_PINS.map((pin) => (
        <div
          key={pin.label}
          className="absolute size-7 rounded-[2px] border border-[#F2F0EA]/70 bg-[#E8DFC8] shadow"
          style={{
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            transform: `translate(-50%, -50%) rotate(${pin.rotate}deg)`,
          }}
        >
          <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-[#C43C3C] shadow" />
        </div>
      ))}
      <CaseClosedSeal className="absolute top-[28%] right-[6%] size-[7.5rem]" />
    </div>
  );
}

/** Public poster — seal + time + clean-solve + case title. No Who/How/Where. */
export function ShareCardA({
  caseFile,
  verdict,
  alias,
}: {
  caseFile: CaseFile;
  verdict: Verdict;
  alias: string;
}) {
  const cleanSolve = verdict.wrongAttempts === 0;
  const epigraph = caseFile.subtitle.replace(/\.$/, "");

  return (
    <div className="midnight-share relative h-[360px] w-[540px] overflow-hidden border border-[#C9A227]/55 bg-[#0B0B0C] text-[#F2F0EA]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 78% 45%, rgba(201,162,39,0.18), transparent 60%), linear-gradient(135deg, #0B0B0C 0%, #141210 55%, #0B0B0C 100%)",
        }}
      />
      <div className="relative grid h-full grid-cols-[1.05fr_1fr] gap-4 p-5 pb-14">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <KeyholeLogo className="size-6" gold />
            <span className="font-display text-xs font-bold tracking-[0.22em] text-[#C9A227] uppercase">
              Street Heists
            </span>
          </div>
          <p className="mt-5 font-display text-[2.35rem] font-bold leading-none tracking-[0.06em] text-[#C9A227] uppercase">
            Case closed
          </p>
          <p className="mt-2 font-display text-[10px] font-bold tracking-[0.2em] text-[#B7B1A4] uppercase">
            {cleanSolve ? "Stronger payoff · Clean solve" : "Stronger payoff · Solved"}
          </p>
          <h2 className="mt-4 font-serif text-[1.85rem] leading-[0.95] font-bold text-[#F2F0EA] italic">
            {caseFile.title}
          </h2>
          <dl className="mt-5 space-y-1.5 border-l-2 border-[#C9A227]/80 pl-3 text-xs">
            <div>
              <dt className="inline text-[#C9A227]">Time · </dt>
              <dd className="inline">{formatElapsed(verdict.elapsedMs)}</dd>
            </div>
            <div>
              <dt className="inline text-[#C9A227]">Mark · </dt>
              <dd className="inline">{cleanSolve ? "Clean solve" : "Solved on retry"}</dd>
            </div>
            <div>
              <dt className="inline text-[#C9A227]">Case · </dt>
              <dd className="inline">{String(caseFile.number).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt className="inline text-[#C9A227]">Operative · </dt>
              <dd className="inline">{alias}</dd>
            </div>
          </dl>
          <p className="mt-auto pt-4 text-[10px] leading-snug text-[#B7B1A4]">
            Public print — seal, time, and mark only. Who / How / Where stay private.
          </p>
        </div>
        <div className="relative min-h-0">
          <CorkYarnBoard caseFile={caseFile} />
        </div>
      </div>
      <div className="absolute inset-x-5 bottom-3 flex items-end justify-between gap-3 border-t border-[#C9A227]/45 pt-2.5">
        <p className="max-w-[16rem] truncate font-serif text-sm text-[#F2F0EA]/90 italic">
          “{epigraph}”
        </p>
        <div className="flex shrink-0 items-center gap-2 text-[#C9A227]">
          <Trophy className="size-4" />
          <div className="text-right">
            <p className="font-display text-[10px] font-bold tracking-[0.16em] uppercase">
              Trophy moment
            </p>
            <p className="text-[9px] tracking-[0.12em] text-[#B7B1A4] uppercase">
              {cleanSolve ? "One hero badge only" : `${alias} · closed`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Evidence strip — stills/docs as atmosphere, never the solution triad. */
export function ShareCardC({
  caseFile,
  verdict,
  alias,
}: {
  caseFile: CaseFile;
  verdict: Verdict;
  alias: string;
}) {
  const cleanSolve = verdict.wrongAttempts === 0;
  const strip = caseFile.evidence.slice(0, 4);

  return (
    <div className="midnight-share relative h-[240px] w-[480px] overflow-hidden border border-[#C9A227]/55 bg-[#0B0B0C] p-4 text-[#F2F0EA]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyholeLogo className="size-6" gold />
          <span className="font-display text-xs tracking-[0.22em] uppercase">Street Heists</span>
        </div>
        <div className="flex items-center gap-2">
          <CaseClosedSeal className="size-12" />
          <p className="font-display text-sm tracking-[0.14em] text-[#C9A227] uppercase">
            {`Case closed · ${String(caseFile.number).padStart(2, "0")}`}
          </p>
        </div>
      </div>
      <div className="mt-3 flex h-[118px] gap-2">
        {strip.map((item) => (
          <EvidenceArt
            key={item.id}
            evidence={item}
            className="flex-1 border-2 border-[#C9A227]/80 bg-[#161618]"
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="truncate font-serif text-xl font-bold italic">{caseFile.title}</p>
        <p className="shrink-0 text-[11px] text-[#B7B1A4]">
          {`${alias} · ${formatElapsed(verdict.elapsedMs)} · ${cleanSolve ? "CLEAN SOLVE" : "SOLVED"}`}
        </p>
      </div>
    </div>
  );
}

export function ShareExports({
  caseFile,
  verdict,
  alias,
}: {
  caseFile: CaseFile;
  verdict: Verdict;
  alias: string;
}) {
  const cardA = useRef<HTMLDivElement>(null);
  const cardC = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"A" | "C" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function exportCard(which: "A" | "C") {
    const node = which === "A" ? cardA.current : cardC.current;
    if (!node) return;
    setBusy(which);
    setError(null);
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#0B0B0C",
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `street-heists-card-${which.toLowerCase()}.png`, {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${caseFile.title} · Case closed`,
          text: "Case closed on Street Heists — spoiler-safe share.",
        });
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = file.name;
        link.click();
      }
    } catch {
      setError("Couldn’t print that card. Try again, or use download.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
          Midnight share · spoiler-safe
        </p>
        <p className="mt-1 text-sm text-ink">
          Public cards carry the seal, time, and clean-solve mark — never Who / How / Where.
        </p>
      </div>

      <div className="pointer-events-none fixed -left-[1600px] top-0 space-y-8" aria-hidden>
        <div ref={cardA}>
          <ShareCardA caseFile={caseFile} verdict={verdict} alias={alias} />
        </div>
        <div ref={cardC}>
          <ShareCardC caseFile={caseFile} verdict={verdict} alias={alias} />
        </div>
      </div>

      <section>
        <p className="mb-2 font-display text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
          Card A · Case closed payoff
        </p>
        <div className="h-[245px] overflow-hidden rounded-lg border border-hairline bg-[#0B0B0C] sm:h-[266px]">
          <div className="origin-top-left scale-[0.68] sm:scale-[0.74]">
            <ShareCardA caseFile={caseFile} verdict={verdict} alias={alias} />
          </div>
        </div>
        <Button
          className="mt-3 w-full"
          variant="gold"
          onClick={() => exportCard("A")}
          disabled={busy !== null}
        >
          <Share2 className="size-4" />
          {busy === "A" ? "Printing…" : "Share card A"}
        </Button>
      </section>

      <section>
        <p className="mb-2 font-display text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
          Card C · Evidence strip
        </p>
        <div className="h-[173px] overflow-hidden rounded-lg border border-hairline bg-[#0B0B0C] sm:h-[187px]">
          <div className="origin-top-left scale-[0.72] sm:scale-[0.78]">
            <ShareCardC caseFile={caseFile} verdict={verdict} alias={alias} />
          </div>
        </div>
        <Button
          className="mt-3 w-full"
          variant="bronze"
          onClick={() => exportCard("C")}
          disabled={busy !== null}
        >
          <Download className="size-4" />
          {busy === "C" ? "Printing…" : "Export card C"}
        </Button>
      </section>

      {error ? <p className="text-sm font-semibold text-fail">{error}</p> : null}
    </div>
  );
}
