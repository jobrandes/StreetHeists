"use client";

import { Button } from "@/components/ui/button";
import { pigeonCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import type { Accusation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const empty: Accusation = { who: "", how: "", where: "" };

export default function AccusePage() {
  const router = useRouter();
  const { submitAccusation } = useHeists();
  const [accusation, setAccusation] = useState(empty);
  const completed = [accusation.who, accusation.how, accusation.where].filter(Boolean).length;

  function submit() {
    if (completed !== 3) return;
    submitAccusation(accusation);
    router.push(`/case/${pigeonCase.id}/verdict`);
  }

  return (
    <main className="play-day min-h-dvh px-4 pb-8 pt-4">
      <header className="border-b border-hairline pb-5 pt-3 text-center">
        <p className="font-display text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
          Street Heists · {pigeonCase.title}
        </p>
        <h1 className="mt-1 font-serif text-[4.5rem] font-bold leading-[0.88] text-ink">Accuse</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-snug text-ink">
          Choose one answer in each group. Your verdict stays unlocked until the theory is complete.
        </p>
      </header>

      <ChoiceSection number={1} title="Who">
        {pigeonCase.suspects.map((suspect) => (
          <Option
            key={suspect.id}
            selected={accusation.who === suspect.id}
            onClick={() => setAccusation((value) => ({ ...value, who: suspect.id }))}
            label={suspect.name}
            detail={suspect.role}
          />
        ))}
      </ChoiceSection>
      <ChoiceSection number={2} title="How">
        {pigeonCase.howChoices.map((choice) => (
          <Option key={choice.id} selected={accusation.how === choice.id} onClick={() => setAccusation((value) => ({ ...value, how: choice.id }))} label={choice.label} />
        ))}
      </ChoiceSection>
      <ChoiceSection number={3} title="Where">
        {pigeonCase.whereChoices.map((choice) => (
          <Option key={choice.id} selected={accusation.where === choice.id} onClick={() => setAccusation((value) => ({ ...value, where: choice.id }))} label={choice.label} />
        ))}
      </ChoiceSection>

      <Button size="xl" className="mt-8 w-full rounded-lg font-display text-lg font-bold uppercase" disabled={completed !== 3} onClick={submit}>
        <KeyRound className="size-5" /> Lock verdict
      </Button>
      <p className="mt-2 text-center text-xs text-muted">{completed === 3 ? "Your theory is complete." : `Select ${3 - completed} more part${3 - completed === 1 ? "" : "s"}.`}</p>
      <Button asChild variant="bronze" size="lg" className="mt-4 w-full rounded-lg text-ink">
        <Link href={`/case/${pigeonCase.id}/evidence`}>Back to case file</Link>
      </Button>
    </main>
  );
}

function ChoiceSection({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-ink uppercase">
        <span className="grid size-7 place-items-center rounded-full bg-gold text-sm text-white">{number}</span>{title}
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
        selected ? "border-gold bg-gold text-white ring-2 ring-gold/25" : "border-hairline bg-card text-ink",
      )}
    >
      <span className="block">{label}</span>
      {detail ? <span className="mt-0.5 block text-[11px] font-medium opacity-80">{detail}</span> : null}
    </button>
  );
}
