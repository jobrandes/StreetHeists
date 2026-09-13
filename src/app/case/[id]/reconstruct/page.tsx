"use client";

import { SceneReconstruct } from "@/components/scene-reconstruct";
import { Button } from "@/components/ui/button";
import { isCaseUnlocked } from "@/lib/investigation";
import { getCase, playableCases } from "@/lib/seed";
import { useHeists } from "@/lib/store";
import { ChevronLeft } from "lucide-react";
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
            <Link href="/">Return to Case Board</Link>
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
            <Link href="/">Return to Case Board</Link>
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
    <main className="play-day min-h-dvh px-4 pb-28 pt-4">
      <Link
        href={`/case/${caseFile.id}/evidence`}
        className="inline-flex items-center gap-1 font-display text-xs font-bold tracking-[0.16em] text-muted uppercase"
        onClick={() => openCase(caseFile.id)}
      >
        <ChevronLeft className="size-4" /> Evidence Locker
      </Link>

      <div className="mt-4">
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
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[430px] border-t border-hairline bg-[#EEF2F6]/95 p-4 backdrop-blur">
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="bronze" size="lg" className="rounded-lg">
            <Link href={`/case/${caseFile.id}/evidence`}>Keep inspecting</Link>
          </Button>
          <Button asChild size="lg" className="rounded-lg">
            <Link href={`/case/${caseFile.id}/accuse`}>Accuse</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
