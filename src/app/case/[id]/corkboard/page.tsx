"use client";

import { CaseChrome } from "@/components/case-chrome";
import { MosaicCorkboard } from "@/components/corkboard";
import { DeductionChainsPanel } from "@/components/deduction-chains";
import { Button } from "@/components/ui/button";
import {
  canAccuse,
  chainsRequiredToAccuse,
  unlockedDeductionChains,
} from "@/lib/deduction";
import { isCaseUnlocked } from "@/lib/investigation";
import { getCase, playableCases } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function CorkboardPage() {
  const { id } = useParams<{ id: string }>();
  const caseFile = getCase(id);
  const {
    progressFor,
    togglePin,
    addClueLink,
    clearClueChain,
    setPlayerNote,
  } = useHeists();
  const progress = caseFile ? progressFor(caseFile.id) : progressFor("missing");
  const progressMap = useMemo(
    () =>
      Object.fromEntries(playableCases.map((item) => [item.id, progressFor(item.id)])),
    [progressFor],
  );

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

  if (!isCaseUnlocked(caseFile, progressMap)) {
    return (
      <main className="play-day grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Case still locked.</h1>
          <Button asChild className="mt-4">
            <Link href="/cases">Return to Case Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  const filed = caseFile.evidence.filter((item) =>
    progress.inspectedEvidenceIds.includes(item.id),
  );
  const unlocked = unlockedDeductionChains(caseFile, progress);
  const ready = canAccuse(caseFile, progress);
  const need = chainsRequiredToAccuse(caseFile);

  return (
    <CaseChrome
      caseFile={caseFile}
      progress={progress}
      step="corkboard"
      backHref={`/case/${caseFile.id}/evidence`}
      backLabel="Locker"
    >
      <MosaicCorkboard
        caseFile={caseFile}
        filedEvidence={filed}
        pinnedIds={progress.pinnedEvidenceIds}
        links={progress.clueLinks ?? []}
        unlockedChains={unlocked}
        playerNotes={progress.playerNotes ?? {}}
        onTogglePin={(evidenceId) => togglePin(caseFile.id, evidenceId)}
        onLink={(a, b) => {
          const result = addClueLink(caseFile.id, a, b);
          return {
            sound: result.sound,
            message: result.message,
            unlockedChainIds: result.unlockedChainIds,
          };
        }}
        onClearChain={() => clearClueChain(caseFile.id)}
        onSaveNote={(evidenceId, note) => setPlayerNote(caseFile.id, evidenceId, note)}
      />

      <div className="mt-6">
        <DeductionChainsPanel caseFile={caseFile} progress={progress} />
      </div>

      {!ready && need > 0 ? (
        <div className="mt-6 rounded-xl border border-[#C4A574]/40 bg-[#FFF8EE] p-4">
          <p className="inline-flex items-center gap-2 font-display text-xs font-bold tracking-[0.14em] text-muted uppercase">
            <Lock className="size-3.5" /> Accuse locked
          </p>
          <p className="mt-2 text-sm leading-snug text-ink">
            Connect matching clues on the board until a yellow note unlocks (
            {unlocked.length}/{need}). Then Accuse opens.
          </p>
          <Button
            size="xl"
            disabled
            className="mt-4 h-14 w-full rounded-xl font-display text-lg font-bold tracking-[0.12em] uppercase opacity-60"
          >
            Accuse locked
          </Button>
        </div>
      ) : (
        <Button
          asChild
          size="xl"
          className="mt-6 h-14 w-full rounded-xl font-display text-lg font-bold tracking-[0.12em] uppercase"
        >
          <Link href={`/case/${caseFile.id}/accuse`}>Open Accuse</Link>
        </Button>
      )}
    </CaseChrome>
  );
}
