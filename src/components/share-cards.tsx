"use client";

import { toPng } from "html-to-image";
import { Download, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { EvidenceArt } from "@/components/evidence-art";
import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import { pigeonCase } from "@/lib/seed";
import type { Verdict } from "@/lib/types";
import { formatElapsed } from "@/lib/utils";

export function ShareCardA({ verdict, alias }: { verdict: Verdict; alias: string }) {
  const solution = {
    who: pigeonCase.suspects.find((item) => item.id === pigeonCase.solution.who)?.name,
    how: pigeonCase.howChoices.find((item) => item.id === pigeonCase.solution.how)?.label,
    where: pigeonCase.whereChoices.find((item) => item.id === pigeonCase.solution.where)?.label,
  };

  return (
    <div className="relative h-[540px] w-[360px] overflow-hidden border border-[#C9A227]/60 bg-[#0B0B0C] text-[#F2F0EA]">
      <EvidenceArt evidence={pigeonCase.evidence[3]} className="absolute inset-0 h-full w-full opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/65 to-[#161618]/30" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-center justify-between border-b border-[#C9A227]/45 pb-3">
          <div className="flex items-center gap-2">
            <KeyholeLogo className="size-7" gold />
            <span className="font-display text-sm tracking-[0.2em] uppercase">Street Heists</span>
          </div>
          <span className="font-display text-[10px] tracking-[0.16em] text-[#C9A227] uppercase">Midnight Crew</span>
        </div>
        <div>
          <p className="font-display text-lg font-bold tracking-[0.2em] text-[#C9A227] uppercase">Case closed</p>
          <h2 className="mt-2 font-serif text-6xl font-bold leading-[0.8]">{pigeonCase.title}</h2>
          <dl className="mt-5 space-y-1.5 border-l-2 border-[#C9A227] pl-3 text-xs">
            <div><dt className="inline text-[#C9A227]">Who: </dt><dd className="inline">{solution.who}</dd></div>
            <div><dt className="inline text-[#C9A227]">How: </dt><dd className="inline">{solution.how}</dd></div>
            <div><dt className="inline text-[#C9A227]">Where: </dt><dd className="inline">{solution.where}</dd></div>
          </dl>
        </div>
        <div className="flex items-end justify-between border-t border-[#C9A227]/45 pt-3 text-xs">
          <p>Investigator {alias}</p>
          <p className="text-[#C9A227]">{formatElapsed(verdict.elapsedMs)} · Case 07</p>
        </div>
      </div>
    </div>
  );
}

export function ShareCardC({ verdict, alias }: { verdict: Verdict; alias: string }) {
  const strip = pigeonCase.evidence.slice(0, 4);
  return (
    <div className="h-[240px] w-[480px] overflow-hidden border border-[#C9A227]/60 bg-[#0B0B0C] p-4 text-[#F2F0EA]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><KeyholeLogo className="size-6" gold /><span className="font-display text-xs tracking-[0.22em] uppercase">Street Heists</span></div>
        <p className="font-display text-lg tracking-[0.14em] text-[#C9A227] uppercase">Case closed · 07</p>
      </div>
      <div className="mt-3 flex h-[132px] gap-2">
        {strip.map((item) => <EvidenceArt key={item.id} evidence={item} className="flex-1 border-2 border-[#C9A227] bg-[#161618]" />)}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-serif text-xl font-bold">{pigeonCase.title}</p>
        <p className="text-xs text-[#F2F0EA]">{alias} · {formatElapsed(verdict.elapsedMs)} · SOLVED</p>
      </div>
    </div>
  );
}

export function ShareExports({ verdict, alias }: { verdict: Verdict; alias: string }) {
  const cardA = useRef<HTMLDivElement>(null);
  const cardC = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"A" | "C" | null>(null);

  async function exportCard(which: "A" | "C") {
    const node = which === "A" ? cardA.current : cardC.current;
    if (!node) return;
    setBusy(which);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: "#0B0B0C" });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `street-heists-pigeon-job-card-${which.toLowerCase()}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${pigeonCase.title} · Card ${which}` });
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = file.name;
        link.click();
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-7">
      <div className="pointer-events-none fixed -left-[1400px] top-0 space-y-8">
        <div ref={cardA}><ShareCardA verdict={verdict} alias={alias} /></div>
        <div ref={cardC}><ShareCardC verdict={verdict} alias={alias} /></div>
      </div>
      <section>
        <p className="mb-2 font-display text-[11px] font-bold tracking-[0.2em] text-gold uppercase">Card A · Case poster</p>
        <div className="h-[464px] overflow-hidden rounded-lg bg-[#0B0B0C]"><div className="origin-top-left scale-[0.86]"><ShareCardA verdict={verdict} alias={alias} /></div></div>
        <Button className="mt-3 w-full" onClick={() => exportCard("A")} disabled={busy !== null}><Share2 className="size-4" />{busy === "A" ? "Printing…" : "Export card A"}</Button>
      </section>
      <section>
        <p className="mb-2 font-display text-[11px] font-bold tracking-[0.2em] text-gold uppercase">Card C · Provided-evidence strip</p>
        <div className="h-[175px] overflow-hidden rounded-lg bg-[#0B0B0C]"><div className="origin-top-left scale-[0.72]"><ShareCardC verdict={verdict} alias={alias} /></div></div>
        <Button variant="bronze" className="mt-3 w-full" onClick={() => exportCard("C")} disabled={busy !== null}><Download className="size-4" />{busy === "C" ? "Printing…" : "Export card C"}</Button>
      </section>
    </div>
  );
}
