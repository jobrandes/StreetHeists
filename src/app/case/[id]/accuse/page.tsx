"use client";

import { CaseChrome } from "@/components/case-chrome";
import { FirstUseTip } from "@/components/first-use-tip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { accuseLooksThin } from "@/lib/case-journey";
import { canAccuse, chainsRequiredToAccuse, unlockedDeductionChains } from "@/lib/deduction";
import { getCase } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import type { Accusation, Choice, Suspect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Panel = "home" | "who" | "how" | "where" | "proof";

const empty: Accusation = {
  who: "",
  how: "",
  where: "",
  whoEvidenceId: "",
  howEvidenceId: "",
  whereEvidenceId: "",
};

export default function DecidePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const caseFile = getCase(id);
  const { submitAccusation, progressFor, setReconstructionPick, setAccusationDraft } = useHeists();
  const progress = caseFile ? progressFor(caseFile.id) : progressFor("missing");
  const desk = progress.reconstructionPicks;
  const draft = progress.accusationDraft;
  const [local, setLocal] = useState<Accusation>({
    ...empty,
    who: desk.who ?? "",
    how: desk.how ?? "",
    where: desk.where ?? "",
    whoEvidenceId: draft.whoEvidenceId ?? "",
    howEvidenceId: draft.howEvidenceId ?? "",
    whereEvidenceId: draft.whereEvidenceId ?? "",
  });
  const [panel, setPanel] = useState<Panel>("home");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const accusation: Accusation = {
    who: local.who,
    how: local.how,
    where: local.where,
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

  const completed = [
    accusation.who,
    accusation.how,
    accusation.where,
    accusation.whoEvidenceId,
    accusation.howEvidenceId,
    accusation.whereEvidenceId,
  ].filter(Boolean).length;

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

  const whoLabel =
    caseFile.suspects.find((item) => item.id === accusation.who)?.name ?? null;
  const howLabel =
    caseFile.howChoices.find((item) => item.id === accusation.how)?.label ?? null;
  const whereLabel =
    caseFile.whereChoices.find((item) => item.id === accusation.where)?.label ?? null;

  function pickWho(suspect: Suspect) {
    setLocal((value) => ({ ...value, who: suspect.id }));
    setReconstructionPick(caseFile!.id, "who", suspect.id);
  }

  function pickHow(choice: Choice) {
    setLocal((value) => ({ ...value, how: choice.id }));
    setReconstructionPick(caseFile!.id, "how", choice.id);
  }

  function pickWhere(choice: Choice) {
    setLocal((value) => ({ ...value, where: choice.id }));
    setReconstructionPick(caseFile!.id, "where", choice.id);
  }

  function lockVerdict() {
    if (completed !== 6) return;
    submitAccusation(caseFile!.id, accusation);
    router.push(`/case/${caseFile!.id}/verdict`);
  }

  function requestSubmit() {
    if (completed !== 6) return;
    if (thin) {
      setConfirmOpen(true);
      return;
    }
    lockVerdict();
  }

  if (!canAccuse(caseFile, progress)) {
    const need = chainsRequiredToAccuse(caseFile);
    const have = unlockedDeductionChains(caseFile, progress).length;
    return (
      <CaseChrome
        caseFile={caseFile}
        progress={progress}
        step="accuse"
        backHref={`/case/${caseFile.id}/corkboard`}
        backLabel="Locker"
      >
        <header className="border-b border-hairline pb-4">
          <p className="inline-flex rounded-md bg-[#2F5BFF] px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.16em] text-white uppercase">
            Accuse locked
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold leading-none text-ink">Accuse</h1>
          <p className="mt-3 text-base leading-snug text-ink">
            String sound clue pairs on the corkboard until{" "}
            {need === 1 ? "your deduction card" : `${need} deduction cards`} unlock ({have}/{need}).
            Who / How / Where opens after the chains hold.
          </p>
        </header>
        <Button asChild className="mt-6 h-12 w-full rounded-xl">
          <Link href={`/case/${caseFile.id}/corkboard`}>Back to Corkboard</Link>
        </Button>
      </CaseChrome>
    );
  }

  return (
    <CaseChrome
      caseFile={caseFile}
      progress={progress}
      step="accuse"
      backHref={`/case/${caseFile.id}/corkboard`}
      backLabel="Locker"
    >
      {panel === "home" ? (
        <>
          <header className="border-b border-hairline pb-4">
            <p className="inline-flex rounded-md bg-[#2F5BFF] px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.16em] text-white uppercase">
              Final call · counts
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold leading-none text-ink">
              Accuse
            </h1>
            <FirstUseTip
              tipId="accuse-room"
              className="mt-3"
              text="Fill Who / How / Where, then attach a filed clue as proof for each. This is the real call — The Locker never locks the case — Accuse does."
            />
          </header>

          {bagged.length === 0 ? (
            <div className="mt-4 rounded-xl border border-fail/30 bg-[#F8D7D7]/40 p-4 text-base text-ink">
              No clues filed yet.{" "}
              <Link
                href={`/case/${caseFile.id}/evidence`}
                className="font-semibold text-[#2F5BFF] underline"
              >
                File clues in the Locker first
              </Link>
              — or fill a draft theory anyway.
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            <FillCard
              title="Who took it?"
              value={whoLabel}
              onFill={() => setPanel("who")}
            />
            <FillCard
              title="How did they do it?"
              value={howLabel}
              onFill={() => setPanel("how")}
            />
            <FillCard
              title="Where is it now?"
              value={whereLabel}
              onFill={() => setPanel("where")}
            />
          </div>

          <section className="mt-6 rounded-2xl border border-hairline bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-serif text-2xl font-bold text-ink">Attach proof</h2>
              <Button
                type="button"
                variant="bronze"
                className="rounded-lg"
                onClick={() => setPanel("proof")}
              >
                {accusation.whoEvidenceId &&
                accusation.howEvidenceId &&
                accusation.whereEvidenceId
                  ? "Edit proof"
                  : "Choose clues"}
              </Button>
            </div>
            <ProofRow
              label="Proof of who"
              value={
                bagged.find((item) => item.id === accusation.whoEvidenceId)?.title ?? null
              }
            />
            <ProofRow
              label="Proof of how"
              value={
                bagged.find((item) => item.id === accusation.howEvidenceId)?.title ?? null
              }
            />
            <ProofRow
              label="Proof of where"
              value={
                bagged.find((item) => item.id === accusation.whereEvidenceId)?.title ??
                null
              }
            />
          </section>

          <Button
            size="xl"
            className="mt-6 h-14 w-full rounded-xl font-display text-lg font-bold tracking-[0.12em] uppercase"
            disabled={completed !== 6}
            onClick={requestSubmit}
          >
            <KeyRound className="size-5" /> Accuse — lock the case
          </Button>
          <p className="mt-2 text-center text-base text-muted">
            {completed === 6
              ? "Theory and proof are complete."
              : `Fill ${6 - completed} more field${6 - completed === 1 ? "" : "s"}.`}
          </p>
        </>
      ) : null}

      {panel === "who" ? (
        <PickPanel title="Who took it?" onBack={() => setPanel("home")}>
          <div className="space-y-3">
            {caseFile.suspects.map((suspect) => (
              <ChoiceButton
                key={suspect.id}
                selected={accusation.who === suspect.id}
                label={suspect.name}
                detail={suspect.role}
                onClick={() => pickWho(suspect)}
              />
            ))}
          </div>
          <Button
            className="mt-6 h-12 w-full rounded-xl"
            disabled={!accusation.who}
            onClick={() => setPanel("home")}
          >
            Confirm who
          </Button>
        </PickPanel>
      ) : null}

      {panel === "how" ? (
        <PickPanel title="How did they do it?" onBack={() => setPanel("home")}>
          <div className="space-y-3">
            {caseFile.howChoices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                selected={accusation.how === choice.id}
                label={choice.label}
                detail={choice.detail}
                onClick={() => pickHow(choice)}
              />
            ))}
          </div>
          <Button
            className="mt-6 h-12 w-full rounded-xl"
            disabled={!accusation.how}
            onClick={() => setPanel("home")}
          >
            Confirm how
          </Button>
        </PickPanel>
      ) : null}

      {panel === "where" ? (
        <PickPanel title="Where is it now?" onBack={() => setPanel("home")}>
          <div className="space-y-3">
            {caseFile.whereChoices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                selected={accusation.where === choice.id}
                label={choice.label}
                detail={choice.detail}
                onClick={() => pickWhere(choice)}
              />
            ))}
          </div>
          <Button
            className="mt-6 h-12 w-full rounded-xl"
            disabled={!accusation.where}
            onClick={() => setPanel("home")}
          >
            Confirm where
          </Button>
        </PickPanel>
      ) : null}

      {panel === "proof" ? (
        <PickPanel title="Attach proof" onBack={() => setPanel("home")}>
          {bagged.length === 0 ? (
            <p className="text-lg text-ink">
              File clues in the Locker before attaching proof.{" "}
              <Link
                href={`/case/${caseFile.id}/evidence`}
                className="font-semibold text-[#2F5BFF] underline"
              >
                Open Locker
              </Link>
            </p>
          ) : (
            <div className="space-y-5">
              <ProofPicker
                label="Proof of who"
                evidence={bagged}
                selectedId={accusation.whoEvidenceId}
                onSelect={(whoEvidenceId) => {
                  setLocal((value) => ({ ...value, whoEvidenceId }));
                  setAccusationDraft(caseFile!.id, { whoEvidenceId });
                }}
              />
              <ProofPicker
                label="Proof of how"
                evidence={bagged}
                selectedId={accusation.howEvidenceId}
                onSelect={(howEvidenceId) => {
                  setLocal((value) => ({ ...value, howEvidenceId }));
                  setAccusationDraft(caseFile!.id, { howEvidenceId });
                }}
              />
              <ProofPicker
                label="Proof of where"
                evidence={bagged}
                selectedId={accusation.whereEvidenceId}
                onSelect={(whereEvidenceId) => {
                  setLocal((value) => ({ ...value, whereEvidenceId }));
                  setAccusationDraft(caseFile!.id, { whereEvidenceId });
                }}
              />
            </div>
          )}
          <Button className="mt-6 h-12 w-full rounded-xl" onClick={() => setPanel("home")}>
            Save proof
          </Button>
        </PickPanel>
      ) : null}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent title="Accuse with a thin file?" className="play-day">
          <p className="text-base leading-snug text-ink">
            You haven’t opened much evidence yet. Accuse anyway?
          </p>
          <div className="mt-4 grid gap-2">
            <Button
              className="h-12 w-full rounded-xl"
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
              className="h-12 w-full rounded-xl"
              onClick={() => setConfirmOpen(false)}
            >
              <Link href={`/case/${caseFile.id}/corkboard`}>Back to Corkboard</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </CaseChrome>
  );
}

function FillCard({
  title,
  value,
  onFill,
}: {
  title: string;
  value: string | null;
  onFill: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onFill}
      className="flex min-h-[5.5rem] w-full flex-col justify-center rounded-2xl border border-hairline bg-card px-4 py-3 text-left hover:bg-[#E8EEF8]"
    >
      <p className="font-display text-xs font-bold tracking-[0.14em] text-[#2F5BFF] uppercase">
        {title}
      </p>
      <p className="mt-1 font-serif text-2xl font-bold leading-tight text-ink">
        {value ?? "Fill this in"}
      </p>
    </button>
  );
}

function ProofRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="mt-3 border-t border-hairline pt-3">
      <p className="font-display text-xs font-bold tracking-[0.12em] text-muted uppercase">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-ink">
        {value ?? "— choose a filed clue —"}
      </p>
    </div>
  );
}

function PickPanel({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-11 items-center gap-1 font-display text-xs font-bold tracking-[0.14em] text-muted uppercase"
      >
        <ChevronLeft className="size-4" /> Back
      </button>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink">{title}</h1>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ChoiceButton({
  selected,
  label,
  detail,
  onClick,
}: {
  selected: boolean;
  label: string;
  detail?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-2xl border px-4 py-4 text-left transition-colors",
        selected
          ? "border-[#2F5BFF] bg-[#DCE6FF] shadow-[3px_3px_0_rgba(47,91,255,0.25)]"
          : "border-hairline bg-card hover:bg-[#E8EEF8]",
      )}
    >
      <p className="font-serif text-2xl font-bold leading-tight text-ink">{label}</p>
      {detail ? <p className="mt-1 text-base text-muted">{detail}</p> : null}
    </button>
  );
}

function ProofPicker({
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
    <div>
      <p className="font-display text-xs font-bold tracking-[0.14em] text-[#2F5BFF] uppercase">
        {label}
      </p>
      <div className="mt-2 space-y-2">
        {evidence.map((item) => (
          <ChoiceButton
            key={item.id}
            selected={selectedId === item.id}
            label={item.title}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
