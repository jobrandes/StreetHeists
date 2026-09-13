"use client";

import { Button } from "@/components/ui/button";
import { corkLinkIsSound } from "@/lib/store";
import type { CaseFile, CorkLink, Evidence, Suspect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link2, Unlink } from "lucide-react";
import { useState } from "react";

export function CorkboardConnect({
  caseFile,
  evidence,
  suspects,
  links,
  onLink,
}: {
  caseFile: CaseFile;
  evidence: Evidence[];
  suspects: Suspect[];
  links: CorkLink[];
  onLink: (evidenceId: string, suspectId: string | null) => void;
}) {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function connect() {
    if (!selectedEvidenceId || !selectedSuspectId) return;
    const link = { evidenceId: selectedEvidenceId, suspectId: selectedSuspectId };
    onLink(selectedEvidenceId, selectedSuspectId);
    const sound = corkLinkIsSound(caseFile.id, link);
    setToast(
      sound
        ? "Thread holds — that exhibit actually names this person."
        : "Thread frays — the file does not support that link.",
    );
  }

  function clearSelected() {
    if (!selectedEvidenceId) return;
    onLink(selectedEvidenceId, null);
    setToast("String pulled. Link cleared.");
  }

  return (
    <section className="rounded-xl border-2 border-gold bg-card p-4">
      <div className="flex items-center gap-2">
        <Link2 className="size-4 text-gold" />
        <p className="font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
          Corkboard
        </p>
      </div>
      <h2 className="mt-1 font-serif text-2xl font-bold text-ink">String the board</h2>
      <p className="mt-1 text-sm leading-snug text-ink">
        Pick an exhibit, pick a suspect, then string them. The board tells you if the link is
        logically sound.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-2 font-display text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
            Evidence
          </p>
          <div className="flex flex-wrap gap-2">
            {evidence.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedEvidenceId(item.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-left text-xs font-semibold",
                  selectedEvidenceId === item.id
                    ? "border-gold bg-gold text-white"
                    : "border-hairline bg-[#E8EEF8] text-ink",
                )}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-display text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
            Suspect
          </p>
          <div className="flex flex-wrap gap-2">
            {suspects.map((suspect) => (
              <button
                key={suspect.id}
                type="button"
                onClick={() => setSelectedSuspectId(suspect.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-left text-xs font-semibold",
                  selectedSuspectId === suspect.id
                    ? "border-gold bg-gold text-white"
                    : "border-hairline bg-[#E8EEF8] text-ink",
                )}
              >
                {suspect.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          variant="gold"
          className="rounded-lg"
          disabled={!selectedEvidenceId || !selectedSuspectId}
          onClick={connect}
        >
          <Link2 className="size-4" /> String link
        </Button>
        <Button
          variant="bronze"
          className="rounded-lg"
          disabled={!selectedEvidenceId}
          onClick={clearSelected}
        >
          <Unlink className="size-4" /> Clear string
        </Button>
      </div>

      {toast ? <p className="mt-3 text-sm font-semibold text-ink">{toast}</p> : null}

      {links.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-hairline pt-3">
          {links.map((link) => {
            const ev = evidence.find((item) => item.id === link.evidenceId);
            const suspect = suspects.find((item) => item.id === link.suspectId);
            const sound = corkLinkIsSound(caseFile.id, link);
            return (
              <li
                key={`${link.evidenceId}-${link.suspectId}`}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  sound
                    ? "border-gold/40 bg-[#DCE6FF]/55 text-ink"
                    : "border-fail/30 bg-[#F8D7D7]/40 text-ink",
                )}
              >
                <span className="font-semibold">{ev?.title ?? link.evidenceId}</span>
                {" → "}
                <span className="font-semibold">{suspect?.name ?? link.suspectId}</span>
                <span className="mt-0.5 block text-[11px] text-muted">
                  {sound ? "Sound link" : "Weak / unsupported"}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
