"use client";

import { ShareExports } from "@/components/share-cards";
import { Button } from "@/components/ui/button";
import { getCase } from "@/lib/seed";
import { useParams } from "next/navigation";
import { useHeists } from "@/lib/store";
import { formatElapsed } from "@/lib/utils";
import { Check, Trophy, X, XCircle } from "lucide-react";
import Link from "next/link";

function accusationLabels(
  caseFile: NonNullable<ReturnType<typeof getCase>>,
  accusation: { who: string; how: string; where: string },
) {
  return {
    who: caseFile.suspects.find((item) => item.id === accusation.who)?.name ?? "Unknown",
    how: caseFile.howChoices.find((item) => item.id === accusation.how)?.label ?? "Unknown",
    where: caseFile.whereChoices.find((item) => item.id === accusation.where)?.label ?? "Unknown",
  };
}

export default function VerdictPage() {
  const { id } = useParams<{ id: string }>();
  const caseFile = getCase(id);
  const { progressFor, alias } = useHeists();
  const progress = caseFile ? progressFor(caseFile.id) : progressFor("missing");
  const verdict = progress.lastVerdict;

  if (!caseFile) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case not filed.</h1>
          <Button asChild className="mt-4"><Link href="/cases">Return to Case Board</Link></Button>
        </div>
      </main>
    );
  }

  if (!verdict) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">No accusation on file.</h1>
          <Button asChild className="mt-4">
            <Link href={`/case/${caseFile.id}/evidence`}>Review evidence</Link>
          </Button>
        </div>
      </main>
    );
  }

  const chosen = accusationLabels(caseFile, verdict.accusation);
  const revealed = accusationLabels(caseFile, caseFile.solution);
  const axis = verdict.axis ?? {
    who: verdict.accusation.who === caseFile.solution.who,
    how: verdict.accusation.how === caseFile.solution.how,
    where: verdict.accusation.where === caseFile.solution.where,
    whoEvidence: false,
    howEvidence: false,
    whereEvidence: false,
  };

  function evidenceLabel(evidenceId: string) {
    return (
      caseFile!.evidence.find((item) => item.id === evidenceId)?.title ?? "No exhibit"
    );
  }

  return (
    <main className="play-day min-h-dvh px-4 pb-10 pt-7">
      <header
        className={
          verdict.correct
            ? "border-t-8 border-gold pt-5"
            : "border-t-8 border-fail pt-5"
        }
      >
        <div className="flex items-center gap-2">
          {verdict.correct ? (
            <Trophy className="size-7 text-gold" />
          ) : (
            <XCircle className="size-7 text-fail" />
          )}
          <p
            className={`font-display text-sm font-bold tracking-[0.2em] uppercase ${
              verdict.correct ? "text-gold" : "text-fail"
            }`}
          >
            Verdict
          </p>
        </div>
        <h1
          className={`mt-2 font-display text-[2.75rem] font-bold leading-[0.92] tracking-[0.04em] uppercase ${
            verdict.correct ? "text-gold" : "text-fail"
          }`}
        >
          {verdict.correct ? "Case closed" : "Incorrect"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          {verdict.correct
            ? "Marcel offers no comment, then eats part of Exhibit A."
            : axis.who && (!axis.whoEvidence || !axis.howEvidence || !axis.whereEvidence)
              ? "Names can be right and the case still fails — attach the exhibits that prove each part."
              : axis.who
                ? "Right suspect, shaky paperwork. Method or hiding place contradicts the file."
                : `${chosen.who} is cleared. Re-check who the sill, crumbs, and nest actually name.`}
        </p>
      </header>

      <section className="mt-5 rounded-xl border border-hairline bg-card p-4">
        <p className="font-display text-[10px] font-bold tracking-[0.18em] text-gold uppercase">
          {verdict.correct
            ? "Who / How / Where — confirmed with proof"
            : "Your accusation — scored with exhibits"}
        </p>
        <ul className="mt-3 space-y-2.5">
          <AxisRow
            label="Who"
            value={verdict.correct ? revealed.who : chosen.who}
            proof={evidenceLabel(verdict.accusation.whoEvidenceId)}
            ok={verdict.correct || (axis.who && axis.whoEvidence)}
            showMark={!verdict.correct}
          />
          <AxisRow
            label="How"
            value={verdict.correct ? revealed.how : chosen.how}
            proof={evidenceLabel(verdict.accusation.howEvidenceId)}
            ok={verdict.correct || (axis.how && axis.howEvidence)}
            showMark={!verdict.correct}
          />
          <AxisRow
            label="Where"
            value={verdict.correct ? revealed.where : chosen.where}
            proof={evidenceLabel(verdict.accusation.whereEvidenceId)}
            ok={verdict.correct || (axis.where && axis.whereEvidence)}
            showMark={!verdict.correct}
          />
        </ul>
      </section>

      {verdict.correct ? (
        <>
          <section className="mt-4 grid grid-cols-2 gap-3">
            <Stat label="Solved in" value={formatElapsed(verdict.elapsedMs)} />
            <Stat
              label="Ruling"
              value={verdict.wrongAttempts === 0 ? "Clean solve" : `${verdict.wrongAttempts} retry`}
            />
          </section>
          <div className="mt-4 rounded-xl border-2 border-gold bg-[#DCE6FF] p-4">
            <p className="font-display text-sm font-bold tracking-[0.14em] text-gold uppercase">
              {verdict.wrongAttempts === 0 ? "Clean-solve bonus · +500" : "Persistence bonus · +200"}
            </p>
            <p className="mt-1 text-sm text-ink">
              {verdict.wrongAttempts === 0
                ? "One accusation. Surgical crumb work."
                : "The first theory wobbled. The final one held."}
            </p>
          </div>
          <section className="mt-6">
            <h2 className="font-display text-lg font-bold tracking-[0.14em] text-ink uppercase">
              Why it fits
            </h2>
            <ol className="mt-2 space-y-2">
              {caseFile.explanation.map((item, index) => (
                <li key={item} className="flex gap-2 text-sm text-ink">
                  <span className="font-bold text-gold">{index + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </section>
          <div className="mt-8">
            <ShareExports caseFile={caseFile} verdict={verdict} alias={alias} />
          </div>
          <Button asChild variant="bronze" className="mt-7 w-full">
            <Link href="/cases">Back to Case Board</Link>
          </Button>
        </>
      ) : (
        <>
          <div className="mt-5 rounded-xl border border-fail/40 bg-[#F8D7D7]/50 p-4">
            <p className="font-display text-sm font-bold tracking-[0.12em] text-fail uppercase">
              Evidence check
            </p>
            <p className="mt-1 text-sm text-ink">
              Back to Gather — reopen the clues that still itch. Then Decide again: Who / How /
              Where, each with proof from Case file. A funny theory without exhibits still fails.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="mt-5 w-full rounded-lg font-display font-bold tracking-[0.12em] uppercase"
          >
            <Link href={`/case/${caseFile.id}/evidence`}>Back to Gather</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="bronze"
            className="mt-3 w-full rounded-lg font-display font-bold tracking-[0.12em] uppercase"
          >
            <Link href={`/case/${caseFile.id}/accuse`}>Retry Decide</Link>
          </Button>
          <Button asChild variant="bronze" className="mt-3 w-full">
            <Link href={`/case/${caseFile.id}/evidence`}>Review clues</Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted">
            All opened and pinned evidence is preserved.
          </p>
        </>
      )}
    </main>
  );
}

function AxisRow({
  label,
  value,
  proof,
  ok,
  showMark,
}: {
  label: string;
  value: string;
  proof?: string;
  ok: boolean;
  showMark: boolean;
}) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-hairline bg-[#E8EEF8]/60 px-3 py-2.5">
      <div className="min-w-0">
        <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
        {proof ? (
          <p className="mt-0.5 text-[11px] text-muted">Exhibit · {proof}</p>
        ) : null}
      </div>
      {showMark ? (
        <span
          className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full ${
            ok ? "bg-[#DCE6FF] text-gold" : "bg-[#F8D7D7] text-fail"
          }`}
          aria-label={ok ? "Correct" : "Incorrect"}
        >
          {ok ? <Check className="size-4 stroke-[3]" /> : <X className="size-4 stroke-[3]" />}
        </span>
      ) : (
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#DCE6FF] text-gold">
          <Check className="size-4 stroke-[3]" />
        </span>
      )}
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-3">
      <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
        {label}
      </p>
      <p className="mt-1 font-serif text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
