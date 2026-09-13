"use client";

import { CaseChrome } from "@/components/case-chrome";
import { FirstUseTip } from "@/components/first-use-tip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { accuseLooksThin } from "@/lib/case-journey";
import { getCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import type { Accusation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

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
  const progress = caseFile ? progressFor(caseFile.id) : progressFor("missing");
  const [local, setLocal] = useState<Accusation>(empty);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const desk = progress.reconstructionPicks;
  const accusation: Accusation = {
    who: local.who || desk.who || "",
    how: local.how || desk.how || "",
    where: local.where || desk.where || "",
    whoEvidenceId: local.whoEvidenceId,
    howEvidenceId: local.howEvidenceId,
    whereEvidenceId: local.whereEvidenceId,
  };

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
  const thin = caseFile ? accuseLooksThin(caseFile, progress) : true;

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

  function lockVerdict() {
    if (!caseFile || completed !== 6) return;
    submitAccusation(caseFile.id, accusation);
    router.push(`/case/${caseFile.id}/verdict`);
  }

  function requestSubmit() {
    if (completed !== 6) return;
    if (thin) {
      setConfirmOpen(true);
      return;
    }
    lockVerdict();
  }

  return (
    <CaseChrome
      caseFile={caseFile}
      progress={progress}
      step="accuse"
      backHref={`/case/${caseFile.id}/evidence`}
      backLabel="Locker"
    >
      <header className="border-b border-hairline pb-5 text-center">
        <p className="inline-flex items-center gap-2 rounded-md bg-[#2F5BFF] px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.16em] text-white uppercase">
          Final call · counts
        </p>
        <h1 className="mt-2 font-serif text-[4.2rem] font-bold leading-[0.88] text-ink">Accuse</h1>
        <FirstUseTip
          tipId="accuse-vs-scene"
          className="mt-3 text-left"
          text="Accuse is the real submission with proof. Scene desk is only a draft theory — it never locks the case."
        />
        <p className="mx-auto mt-3 max-w-xs text-sm leading-snug text-ink">
          Name who / how / where — then attach the exhibit that proves each part. Right suspect with
          the wrong proof still fails.
          {desk.who || desk.how || desk.where
            ? " Scene-desk picks are prefilled — change them if your theory shifted."
            : ""}
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

      {thin && bagged.length > 0 ? (
        <div className="mt-4 rounded-xl border border-[#C9A227]/50 bg-[#FFF6D9]/70 p-3 text-sm text-ink">
          Thin file warning — you have opened few clues or cracked no confrontations yet. You can still
          accuse, but we will ask you to confirm.
        </div>
      ) : null}

      <ChoiceSection number={1} title="Who">
        {caseFile.suspects.map((suspect) => (
          <Option
            key={suspect.id}
            selected={accusation.who === suspect.id}
            onClick={() => setLocal((value) => ({ ...value, who: suspect.id }))}
            label={suspect.name}
            detail={suspect.role}
          />
        ))}
      </ChoiceSection>
      <EvidencePick
        label="Proof of who"
        evidence={bagged}
        selectedId={accusation.whoEvidenceId}
        onSelect={(whoEvidenceId) => setLocal((value) => ({ ...value, whoEvidenceId }))}
      />

      <ChoiceSection number={2} title="How">
        {caseFile.howChoices.map((choice) => (
          <Option
            key={choice.id}
            selected={accusation.how === choice.id}
            onClick={() => setLocal((value) => ({ ...value, how: choice.id }))}
            label={choice.label}
          />
        ))}
      </ChoiceSection>
      <EvidencePick
        label="Proof of how"
        evidence={bagged}
        selectedId={accusation.howEvidenceId}
        onSelect={(howEvidenceId) => setLocal((value) => ({ ...value, howEvidenceId }))}
      />

      <ChoiceSection number={3} title="Where">
        {caseFile.whereChoices.map((choice) => (
          <Option
            key={choice.id}
            selected={accusation.where === choice.id}
            onClick={() => setLocal((value) => ({ ...value, where: choice.id }))}
            label={choice.label}
          />
        ))}
      </ChoiceSection>
      <EvidencePick
        label="Proof of where"
        evidence={bagged}
        selectedId={accusation.whereEvidenceId}
        onSelect={(whereEvidenceId) => setLocal((value) => ({ ...value, whereEvidenceId }))}
      />

      <Button
        size="xl"
        className="mt-8 w-full rounded-lg font-display text-lg font-bold uppercase"
        disabled={completed !== 6}
        onClick={requestSubmit}
      >
        <KeyRound className="size-5" /> Lock verdict
      </Button>
      <p className="mt-2 text-center text-xs text-muted">
        {completed === 6
          ? "Theory and proof are complete."
          : `Fill ${6 - completed} more field${6 - completed === 1 ? "" : "s"}.`}
      </p>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent title="Accuse with a thin file?" className="play-day">
          <p className="text-sm leading-snug text-ink">
            You have not opened much evidence and/or have not cracked a confrontation yet. Accuse
            anyway?
          </p>
          <div className="mt-4 grid gap-2">
            <Button
              className="w-full rounded-lg"
              onClick={() => {
                setConfirmOpen(false);
                lockVerdict();
              }}
            >
              Accuse anyway
            </Button>
            <Button
              asChild
              variant="bronze"
              className="w-full rounded-lg text-ink"
              onClick={() => setConfirmOpen(false)}
            >
              <Link href={`/case/${caseFile.id}/evidence`}>Back to locker</Link>
            </Button>
            <Button
              asChild
              variant="bronze"
              className="w-full rounded-lg text-ink"
              onClick={() => setConfirmOpen(false)}
            >
              <Link href={`/case/${caseFile.id}/confront`}>Try Confront first</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </CaseChrome>
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
  children: ReactNode;
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
