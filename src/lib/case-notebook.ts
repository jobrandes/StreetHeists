import { hotspotKey } from "@/lib/investigation";
import type { CaseFile, CaseProgress } from "@/lib/types";

export type NotebookLine = {
  label: string;
  body: string;
};

export type NotebookSection = {
  id: string;
  title: string;
  empty: string;
  lines: NotebookLine[];
};

/** Auto-builds the running case sheet from progress — nothing to memorize. */
export function buildCaseNotebook(
  caseFile: CaseFile,
  progress: CaseProgress,
): NotebookSection[] {
  const opened = caseFile.evidence.filter((item) =>
    progress.inspectedEvidenceIds.includes(item.id),
  );

  const clueLines = opened.map((item) => ({
    label: item.title,
    body: item.deduction,
  }));

  const hotspotLines = caseFile.evidence.flatMap((item) =>
    (item.hotspots ?? [])
      .filter((spot) =>
        progress.discoveredHotspotIds.includes(hotspotKey(item.id, spot.id)),
      )
      .map((spot) => ({
        label: `${item.title} · ${spot.label}`,
        body: spot.reveal,
      })),
  );

  const corkLines = progress.corkLinks.map((link) => {
    const clue = caseFile.evidence.find((item) => item.id === link.evidenceId);
    const suspect = caseFile.suspects.find((item) => item.id === link.suspectId);
    return {
      label: clue?.title ?? "Clue",
      body: `Stringed to ${suspect?.name ?? "a suspect"}`,
    };
  });

  const confrontLines = (caseFile.confrontations ?? [])
    .filter((item) => progress.crackedConfrontationIds.includes(item.id))
    .map((item) => {
      const suspect = caseFile.suspects.find((s) => s.id === item.suspectId);
      return {
        label: suspect?.name ?? "Suspect",
        body: `Claim cracked: “${item.claim}” — ${item.successResponse}`,
      };
    });

  const sceneLines = caseFile.reconstruction.slots
    .map((slot) => {
      const pickId = progress.reconstructionPicks[slot.id];
      if (!pickId) return null;
      const option = slot.options.find((item) => item.id === pickId);
      return {
        label: slot.label,
        body: option
          ? `${option.label}${option.detail ? ` — ${option.detail}` : ""}`
          : pickId,
      };
    })
    .filter((line): line is NotebookLine => Boolean(line));

  const contradictionLines = (caseFile.contradictions ?? [])
    .filter((item) => progress.foundContradictionIds.includes(item.id))
    .map((item) => ({
      label: "Contradiction",
      body: item.insight,
    }));

  return [
    {
      id: "clues",
      title: "Clues you’ve opened",
      empty: "Open clues in the Locker — each takeaway files here automatically.",
      lines: clueLines,
    },
    {
      id: "hotspots",
      title: "Hotspots you found",
      empty: "Tap bright spots on stills — reveals collect here.",
      lines: hotspotLines,
    },
    {
      id: "cork",
      title: "Corkboard strings",
      empty: "In Binder, string a clue to a suspect — it shows up here.",
      lines: corkLines,
    },
    {
      id: "confront",
      title: "Confrontations cracked",
      empty: "Break a claim with the right exhibit — it files here.",
      lines: confrontLines,
    },
    {
      id: "scene",
      title: "Scene desk draft",
      empty: "Key Who / How / Where on Scene — draft only, saved here.",
      lines: sceneLines,
    },
    {
      id: "contradictions",
      title: "Contradictions spotted",
      empty: "Catch a mismatch between exhibits — insight files here.",
      lines: contradictionLines,
    },
  ];
}

export function notebookFilledCount(sections: NotebookSection[]): number {
  return sections.reduce((sum, section) => sum + section.lines.length, 0);
}

export const THEORY_NOTE_KEY = (caseId: string) =>
  `street-heists.theory.${caseId}`;
