"use client";

import { CaseNotebookButton } from "@/components/case-notebook";
import { FirstUseTip } from "@/components/first-use-tip";
import {
  CASE_NAV,
  progressStripCopy,
  type CaseStep,
} from "@/lib/case-journey";
import type { CaseFile, CaseProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FolderSearch, Scale } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const NAV_ICONS = {
  gather: FolderSearch,
  decide: Scale,
} as const;

export function CaseChrome({
  caseFile,
  progress,
  step,
  children,
  backHref,
  backLabel = "Back",
}: {
  caseFile: CaseFile;
  progress: CaseProgress;
  step: CaseStep;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  const strip = progressStripCopy(step, caseFile, progress);
  const room = step === "briefing" ? "gather" : step;

  return (
    <div className="play-day flex min-h-dvh flex-col">
      <div className="sticky top-0 z-30 border-b border-hairline bg-[#EEF2F6]/95 px-4 pb-3 pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-[430px] items-center justify-between gap-2">
          {backHref ? (
            <Link
              href={backHref}
              className="min-h-11 min-w-11 content-center font-display text-xs font-bold tracking-[0.14em] text-muted uppercase"
            >
              ← {backLabel}
            </Link>
          ) : (
            <span className="font-display text-xs font-bold tracking-[0.14em] text-muted uppercase">
              Case {String(caseFile.number).padStart(2, "0")}
            </span>
          )}
          <p className="truncate font-serif text-lg font-semibold text-ink">
            {caseFile.title}
          </p>
          <CaseNotebookButton caseFile={caseFile} progress={progress} />
        </div>

        {/* Direction C — two huge room pills */}
        <div
          className="mx-auto mt-3 grid max-w-[430px] grid-cols-2 gap-2 rounded-2xl border border-hairline bg-card p-1.5"
          role="tablist"
          aria-label="Case rooms"
        >
          {CASE_NAV.map((item) => {
            const Icon = NAV_ICONS[item.id];
            const active = item.id === room;
            return (
              <Link
                key={item.id}
                href={item.href(caseFile.id)}
                role="tab"
                aria-selected={active}
                className={cn(
                  "flex min-h-14 items-center justify-center gap-2 rounded-xl font-display text-base font-bold tracking-[0.1em] uppercase transition-colors",
                  active
                    ? "bg-[#2F5BFF] text-white shadow-[0_4px_0_#2549d6]"
                    : "text-ink hover:bg-[#E8EEF8]",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mx-auto mt-3 max-w-[430px] rounded-lg border border-[#2F5BFF]/25 bg-[#DCE6FF]/70 px-3 py-2.5">
          <p className="font-display text-xs font-bold tracking-[0.14em] text-[#2F5BFF] uppercase">
            {strip.stepLabel}
          </p>
          <p className="mt-1 text-base font-medium leading-snug text-ink">
            {strip.detail}
          </p>
        </div>

        <FirstUseTip
          tipId="two-rooms"
          className="mx-auto mt-2 max-w-[430px]"
          text="Only two rooms: Gather (clues we give you) and Decide (Who / How / Where + proof). Case file remembers the rest."
        />
      </div>

      <div className="mx-auto w-full max-w-[430px] flex-1 px-4 pb-10 pt-4 text-base leading-snug">
        {children}
      </div>
    </div>
  );
}
