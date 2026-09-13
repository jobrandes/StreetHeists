"use client";

import { CaseChrome } from "@/components/case-chrome";
import { SceneDraftGate } from "@/components/scene-draft-gate";
import { SceneReconstruct } from "@/components/scene-reconstruct";
import { Button } from "@/components/ui/button";
import { isCaseUnlocked } from "@/lib/investigation";
import { getCase, playableCases } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function ReconstructPage() {
  const { id } = useParams<{ id: string }>();
  const { progressFor, setReconstructionPick, openCase } = useHeists();
  const caseFile = getCase(id);

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
          <p className="mt-2 text-sm text-muted">
            Solve the prior case correctly before this scene desk opens.
          </p>
          <Button asChild className="mt-4">
            <Link href="/cases">Return to Case Board</Link>
          </Button>
        </div>
      </main>
    );
  }

  const progress = progressFor(caseFile.id);
  const inspected = caseFile.evidence.filter((item) =>
    progress.inspectedEvidenceIds.includes(item.id),
  );

  return (
    <CaseChrome
      caseFile={caseFile}
      progress={progress}
      step="scene"
      backHref={`/case/${caseFile.id}/evidence`}
      backLabel="Locker"
    >
      <SceneDraftGate />
      <SceneReconstruct
        caseFile={caseFile}
        picks={progress.reconstructionPicks}
        inspectedEvidence={inspected}
        onPick={(slotId, optionId) => {
          openCase(caseFile.id);
          setReconstructionPick(caseFile.id, slotId, optionId);
        }}
        onClearSlot={(slotId) => setReconstructionPick(caseFile.id, slotId, null)}
      />
    </CaseChrome>
  );
}
