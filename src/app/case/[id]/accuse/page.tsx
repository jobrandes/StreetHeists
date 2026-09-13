"use client";

import { Button } from "@/components/ui/button";
import { getCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import type { Accusation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const empty: Accusation = {
  who: "",
  how: "",
  where: "",
  whoEvidenceId: "",
  howEvidenceId: "",
  whereEvidenceId: "",
};

export default function AccusePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const caseFile = getCase(id);
  const { submitAccusation, progressFor } = useHeists();
  const [accusation, setAccusation] = useState(empty);
  const progress = caseFile ? progressFor(caseFile.id) : progressFor("missing");

  const bagged = useMemo(() => {
    if (!caseFile) return [];
    return caseFile.evidence.filter((item) =>
      progress.inspectedEvidenceIds.includes(item.id),
    );
  }, [caseFile, progress.inspectedEvidenceIds]);

  const parts = [
    accusation.who,
    accusation.how,
    accusation.where,
    accusation.whoEvidenceId,
    accusation.howEvidenceId,
    accusation.whereEvidenceId,
  ];
  const completed = parts.filter(Boolean).length;

  if (!caseFile) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case not filed.</h1>
          <Button asChild className="mt-4">
            <Link href="/">Return to Case Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  function submit() {
    if (!caseFile || completed !== 6) return;
    submitAccusation(caseFile.id, accusation);
    router.push(`/case/${caseFile.id}/verdict`);
  }

  return (
    <main className="play-day min-h-dvh px-4 pb-8 pt-4">
      <header className="border-b border-hairline pb-5 pt-3 text-center">
        <p className="font-display text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
          Street Heists · {caseFile.title}
        </p>
        <h1 className="mt-1 font-serif text-[4.5rem] font-bold leading-[0.88] text-ink">Accuse</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-snug text-ink">
          Name who / how / where — then attach the exhibit that proves each part. Right suspect with
          the wrong proof still fails.
        </p>
      </header>

      {bagged.length === 0 ? (
        <div className="mt-6 rounded-xl border border-fail/30 bg-[#F8D7D7]/40 p-4 text-sm text-ink">
          No exhibits bagged yet.{" "}
          <Link href={`/case/${caseFile.id}/evidence`} className="font-semibold text-gold underline">
            Open the Evidence Locker
          </Link>{" "}
          before locking a verdict.
        </div>
      ) : null}

      <ChoiceSection number={1} title="Who">
        {caseFile.suspects.map((suspect) => (
          <Option
            key={suspect.id}
            selected={accusation.who === suspect.id}
            onClick={() => setAccusation((value) => ({ ...value, who: suspect.id }))}
            label={suspect.name}
            detail={suspect.role}
          />
        ))}
      </ChoiceSection>
      <EvidencePick
        label="Proof of who"
        evidence={bagged}
        selectedId={accusation.whoEvidenceId}
        onSelect={(whoEvidenceId) => setAccusation((value) => ({ ...value, whoEvidenceId }))}
      />

      <ChoiceSection number={2} title="How">
        {caseFile.howChoices.map((choice) => (
          <Option
            key={choice.id}
            selected={accusation.how === choice.id}
            onClick={() => setAccusation((value) => ({ ...value, how: choice.id }))}
            label={choice.label}
          />
        ))}
      </ChoiceSection>
      <EvidencePick
        label="Proof of how"
        evidence={bagged}
        selectedId={accusation.howEvidenceId}
        onSelect={(howEvidenceId) => setAccusation((value) => ({ ...value, howEvidenceId }))}
      />

      <ChoiceSection number={3} title="Where">
        {caseFile.whereChoices.map((choice) => (
          <Option
            key={choice.id}
            selected={accusation.where === choice.id}
            onClick={() => setAccusation((value) => ({ ...value, where: choice.id }))}
            label={choice.label}
          />
        ))}
      </ChoiceSection>
      <EvidencePick
        label="Proof of where"
        evidence={bagged}
        selectedId={accusation.whereEvidenceId}
        onSelect={(whereEvidenceId) => setAccusation((value) => ({ ...value, whereEvidenceId }))}
      />

      <Button
        size="xl"
        className="mt-8 w-full rounded-lg font-display text-lg font-bold uppercase"
        disabled={completed !== 6}
        onClick={submit}
      >
        <KeyRound className="size-5" /> Lock verdict
      </Button>
      <p className="mt-2 text-center text-xs text-muted">
        {completed === 6
          ? "Theory and proof are complete."
          : `Fill ${6 - completed} more field${6 - completed === 1 ? "" : "s"}.`}
      </p>
      <div className="mt-4 grid gap-2">
        <Button asChild variant="bronze" size="lg" className="w-full rounded-lg text-ink">
          <Link href={`/case/${caseFile.id}/confront`}>Confront with evidence first</Link>
        </Button>
        <Button asChild variant="bronze" size="lg" className="w-full rounded-lg text-ink">
          <Link href={`/case/${caseFile.id}/evidence`}>Back to case file</Link>
        </Button>
      </div>
    </main>
  );
}

function EvidencePick({
  label,
  evidence,
  selectedId,
  onSelect,
}: {
  label: string;
  evidence: { id: string; title: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-3 rounded-xl border border-hairline bg-card p-3">
      <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
        {label}
      </p>
      {evidence.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Bag exhibits before attaching proof.</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {evidence.map((item) => (
            <Option
              key={item.id}
              selected={selectedId === item.id}
              onClick={() => onSelect(item.id)}
              label={item.title}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChoiceSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-ink uppercase">
        <span className="grid size-7 place-items-center rounded-full bg-gold text-sm text-white">
          {number}
        </span>
        {title}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Option({
  selected,
  onClick,
  label,
  detail,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  detail?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2.5 text-left text-sm font-semibold leading-snug transition-colors",
        selected
          ? "border-gold bg-gold text-white ring-2 ring-gold/25"
          : "border-hairline bg-card text-ink",
      )}
    >
      <span className="block">{label}</span>
      {detail ? (
        <span className="mt-0.5 block text-[11px] font-medium opacity-80">{detail}</span>
      ) : null}
    </button>
  );
}
