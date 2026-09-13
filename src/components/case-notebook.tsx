"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  THEORY_NOTE_KEY,
  buildCaseNotebook,
  notebookFilledCount,
} from "@/lib/case-notebook";
import type { CaseFile, CaseProgress } from "@/lib/types";
import { BookOpen, NotebookPen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/** Always-on running sheet — auto-fills as you work so you don't memorize the case. */
export function CaseNotebookButton({
  caseFile,
  progress,
}: {
  caseFile: CaseFile;
  progress: CaseProgress;
}) {
  const [open, setOpen] = useState(false);
  const [theory, setTheory] = useState("");
  const sections = useMemo(
    () => buildCaseNotebook(caseFile, progress),
    [caseFile, progress],
  );
  const filled = notebookFilledCount(sections);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate freeform theory note
    setTheory(window.localStorage.getItem(THEORY_NOTE_KEY(caseFile.id)) ?? "");
  }, [caseFile.id]);

  function saveTheory(next: string) {
    setTheory(next);
    window.localStorage.setItem(THEORY_NOTE_KEY(caseFile.id), next);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[#2F5BFF]/35 bg-[#DCE6FF] px-3 py-2 font-display text-xs font-bold tracking-[0.1em] text-[#2F5BFF] uppercase"
        aria-label="Open case file notebook"
      >
        <BookOpen className="size-4 shrink-0" aria-hidden />
        Case file
        <span className="rounded-md bg-[#2F5BFF] px-1.5 py-0.5 text-[10px] text-white">
          {filled}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          title="Case file"
          className="play-day flex max-h-[min(92dvh,720px)] w-[min(96vw,440px)] flex-col overflow-hidden p-0"
        >
          <div className="border-b border-hairline px-5 pb-3 pt-1">
            <p className="font-serif text-xl font-bold leading-tight text-ink">
              {caseFile.title}
            </p>
            <p className="mt-1 text-base leading-snug text-ink">
              Your running sheet — everything you’ve opened, linked, or cracked
              lands here so you don’t have to hold it in your head.
            </p>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <section className="rounded-xl border border-[#2F5BFF]/25 bg-[#DCE6FF]/50 p-3">
              <div className="flex items-center gap-2">
                <NotebookPen className="size-4 text-[#2F5BFF]" aria-hidden />
                <h3 className="font-display text-xs font-bold tracking-[0.14em] text-[#2F5BFF] uppercase">
                  Working theory
                </h3>
              </div>
              <textarea
                value={theory}
                onChange={(event) => saveTheory(event.target.value)}
                rows={3}
                placeholder="Who / how / where — jot it in plain words. This stays on this phone."
                className="mt-2 w-full resize-y rounded-lg border border-hairline bg-white px-3 py-2.5 text-base leading-snug text-ink placeholder:text-muted"
              />
            </section>

            {sections.map((section) => (
              <section key={section.id}>
                <h3 className="font-display text-xs font-bold tracking-[0.14em] text-gold uppercase">
                  {section.title}
                  {section.lines.length > 0 ? (
                    <span className="ml-2 text-muted">· {section.lines.length}</span>
                  ) : null}
                </h3>
                {section.lines.length === 0 ? (
                  <p className="mt-1.5 text-base leading-snug text-muted">
                    {section.empty}
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {section.lines.map((line) => (
                      <li
                        key={`${section.id}-${line.label}-${line.body.slice(0, 24)}`}
                        className="rounded-lg border border-hairline bg-card px-3 py-2.5"
                      >
                        <p className="font-serif text-lg font-semibold leading-tight text-ink">
                          {line.label}
                        </p>
                        <p className="mt-1 text-base leading-snug text-ink">
                          {line.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="border-t border-hairline px-5 py-3">
            <Button
              className="h-12 w-full rounded-lg text-base font-display font-bold tracking-[0.1em] uppercase"
              onClick={() => setOpen(false)}
            >
              Back to case
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
