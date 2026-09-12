"use client";

import { Button } from "@/components/ui/button";
import { pigeonCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function BriefingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { openCase } = useHeists();

  if (id !== pigeonCase.id) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case not filed.</h1>
          <Button asChild className="mt-4"><Link href="/">Return to Case Board</Link></Button>
        </div>
      </main>
    );
  }

  function begin() {
    openCase();
    router.push(`/case/${pigeonCase.id}/evidence`);
  }

  const rows = [
    {
      title: "WHAT HAPPENED",
      copy: "the marked baguette vanished from the café.",
    },
    {
      title: "WHAT YOU MUST NAME",
      copy: "Who / How / Where — People & Places dossiers live in the Evidence Locker tabs.",
    },
    {
      title: "DONE = VERDICT + glossy share cards.",
      copy: null,
    },
  ];

  return (
    <main className="play-day min-h-dvh px-4 pb-8 pt-4">
      <Link href="/" className="inline-flex items-center gap-1 font-display text-xs font-bold tracking-[0.16em] text-muted uppercase">
        <ChevronLeft className="size-4" /> Case Board
      </Link>

      <header className="mt-5 border-b border-hairline pb-4">
        <p className="font-display text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
          Briefing · Case {String(pigeonCase.number).padStart(2, "0")}
        </p>
        <h1 className="mt-1 font-serif text-[3.4rem] font-bold leading-[0.83] text-ink">
          {pigeonCase.title}
        </h1>
        <p className="mt-3 text-base leading-snug text-ink">{pigeonCase.premise}</p>
        <p className="mt-4 inline-block border-l-4 border-gold bg-card px-3 py-2 text-sm font-semibold text-ink">
          Evidence is in the locker. You inspect; you don’t shoot.
        </p>
      </header>

      <ol className="divide-y divide-hairline border-b border-hairline">
        {rows.map((row, index) => (
          <li key={row.title} className="grid grid-cols-[2.25rem_1fr] gap-3 py-4">
            <span className="font-display text-3xl font-bold leading-none text-gold">{index + 1}</span>
            <div>
              <h2 className="font-display text-sm font-bold tracking-[0.06em] text-ink uppercase">{row.title}</h2>
              {row.copy ? <p className="mt-1 text-sm leading-snug text-ink">{row.copy}</p> : null}
            </div>
          </li>
        ))}
      </ol>

      <Button size="xl" className="mt-4 w-full rounded-lg font-display text-lg font-bold tracking-[0.12em] uppercase" onClick={begin}>
        OPEN EVIDENCE LOCKER
      </Button>
    </main>
  );
}
