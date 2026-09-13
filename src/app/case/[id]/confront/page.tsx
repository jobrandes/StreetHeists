"use client";

import { CaseChrome } from "@/components/case-chrome";
import { FirstUseTip } from "@/components/first-use-tip";
import { Button } from "@/components/ui/button";
import { getCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import { cn } from "@/lib/utils";
import { MessageSquareWarning, Scale } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ConfrontPage() {
  const { id } = useParams<{ id: string }>();
  const caseFile = getCase(id);
  const { progressFor, confrontSuspect } = useHeists();
  const progress = caseFile ? progressFor(caseFile.id) : progressFor("missing");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    cracked: boolean;
    text: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const confrontations = caseFile?.confrontations ?? [];
  const bagged = caseFile
    ? caseFile.evidence.filter((item) =>
        progress.inspectedEvidenceIds.includes(item.id),
      )
    : [];

  if (!caseFile) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case not filed.</h1>
          <Button asChild className="mt-4">
            <Link href="/cases">Return to Case Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  const active = confrontations.find((item) => item.id === activeId) ?? null;
  const activeSuspect = active
    ? caseFile.suspects.find((item) => item.id === active.suspectId)
    : null;

  function runConfront() {
    if (!active || !selectedEvidenceId) return;
    setError(null);
    const result = confrontSuspect(caseFile!.id, active.id, selectedEvidenceId);
    if (!result.ok) {
      setError(result.reason);
      setFeedback(null);
      return;
    }
    setFeedback({ cracked: result.cracked, text: result.feedback });
  }

  return (
    <CaseChrome
      caseFile={caseFile}
      progress={progress}
      step="confront"
      backHref={`/case/${caseFile.id}/evidence`}
      backLabel="Locker"
    >
      <header className="border-b border-hairline pb-4">
        <div className="flex items-center gap-2">
          <MessageSquareWarning className="size-5 text-gold" />
          <p className="font-display text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
            Interrogation · Case {String(caseFile.number).padStart(2, "0")}
          </p>
        </div>
        <h1 className="mt-1 font-serif text-4xl font-bold text-ink">Confront</h1>
        <FirstUseTip
          tipId="confront"
          className="mt-2"
          text="Confront = press a suspect with one exhibit that breaks their claim. Not the same as Accuse."
        />
        <p className="mt-2 max-w-md text-sm leading-snug text-ink">
          A suspect makes a claim. Pick the specific exhibit that contradicts it. Wrong proof —
          they wriggle free. Right proof — they crack.
        </p>
      </header>

      {confrontations.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No confrontations queued for this case.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {confrontations.map((item) => {
            const suspect = caseFile.suspects.find((s) => s.id === item.suspectId);
            const cracked = progress.crackedConfrontationIds.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(item.id);
                    setSelectedEvidenceId(null);
                    setFeedback(null);
                    setError(null);
                  }}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left transition-colors",
                    activeId === item.id
                      ? "border-gold bg-[#DCE6FF]/55 ring-1 ring-gold"
                      : "border-hairline bg-card",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                        {suspect?.name ?? "Suspect"}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-snug text-ink">
                        “{item.claim}”
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-1 font-display text-[9px] font-bold tracking-[0.12em] uppercase",
                        cracked ? "bg-gold text-white" : "bg-[#E8EEF8] text-muted",
                      )}
                    >
                      {cracked ? "Cracked" : "Open"}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {active && activeSuspect ? (
        <section className="mt-6 rounded-xl border-2 border-gold bg-card p-4">
          <p className="font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
            Live claim · {activeSuspect.name}
          </p>
          <p className="mt-2 font-serif text-xl font-bold leading-snug text-ink">
            “{active.claim}”
          </p>
          <p className="mt-3 text-sm text-ink">Which exhibit contradicts that claim?</p>

          {bagged.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              Bag evidence in the locker before you confront.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {bagged.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedEvidenceId(item.id);
                    setFeedback(null);
                    setError(null);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-2 text-left text-xs font-semibold",
                    selectedEvidenceId === item.id
                      ? "border-gold bg-gold text-white"
                      : "border-hairline bg-[#E8EEF8] text-ink",
                  )}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}

          <Button
            className="mt-4 w-full rounded-lg"
            disabled={!selectedEvidenceId}
            onClick={runConfront}
          >
            <Scale className="size-4" /> Present exhibit
          </Button>

          {error ? <p className="mt-3 text-sm font-semibold text-fail">{error}</p> : null}
          {feedback ? (
            <div
              className={cn(
                "mt-3 rounded-lg border p-3 text-sm font-semibold leading-snug",
                feedback.cracked
                  ? "border-gold/40 bg-[#DCE6FF]/70 text-ink"
                  : "border-fail/30 bg-[#F8D7D7]/50 text-ink",
              )}
            >
              <p className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-gold">
                {feedback.cracked ? "They crack" : "They wriggle free"}
              </p>
              <p className="mt-1">{feedback.text}</p>
            </div>
          ) : null}
        </section>
      ) : null}

      <Button asChild variant="bronze" className="mt-6 w-full rounded-lg">
        <Link href={`/case/${caseFile.id}/accuse`}>Ready to accuse</Link>
      </Button>
    </CaseChrome>
  );
}
