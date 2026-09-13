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
import {
  Clapperboard,
  FolderOpen,
  Gavel,
  MessageSquareWarning,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const NAV_ICONS = {
  locker: FolderOpen,
  confront: MessageSquareWarning,
  scene: Clapperboard,
  accuse: Gavel,
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

  return (
    <div className="play-day flex min-h-dvh flex-col">
      <div className="sticky top-0 z-30 border-b border-hairline bg-[#EEF2F6]/95 px-4 pb-2 pt-3 backdrop-blur">
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
          <p className="truncate font-serif text-base font-semibold text-ink">
            {caseFile.title}
          </p>
          <CaseNotebookButton caseFile={caseFile} progress={progress} />
        </div>
        <div className="mx-auto mt-2 max-w-[430px] rounded-lg border border-[#2F5BFF]/25 bg-[#DCE6FF]/70 px-3 py-2.5">
          <p className="font-display text-xs font-bold tracking-[0.14em] text-[#2F5BFF] uppercase">
            {strip.stepLabel}
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-ink">
            {strip.detail}
          </p>
          <div className="mt-2 flex gap-1" aria-hidden>
            {CASE_NAV.map((item) => {
              const active =
                item.id === step || (step === "briefing" && item.id === "locker");
              const reached = stepIndexReached(step, item.id);
              return (
                <span
                  key={item.id}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    active
                      ? "bg-[#2F5BFF]"
                      : reached
                        ? "bg-[#2F5BFF]/45"
                        : "bg-hairline",
                  )}
                />
              );
            })}
          </div>
        </div>
        <FirstUseTip
          tipId="case-file"
          className="mx-auto mt-2 max-w-[430px]"
          text="Stuck remembering? Tap Case file anytime — it keeps every clue, link, and crack for you."
        />
      </div>

      <div className="mx-auto w-full max-w-[430px] flex-1 px-4 pb-32 pt-4 text-base leading-snug">
        {children}
      </div>

      <nav
        aria-label="Case destinations"
        className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] border-t border-hairline bg-[#EEF2F6]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
      >
        <FirstUseTip
          tipId="case-nav"
          className="mb-1.5 px-2"
          text="Locker · Confront · Scene · Accuse — always one tap away. Scene is a draft; Accuse is the real call."
        />
        <div className="grid grid-cols-4 gap-1">
          {CASE_NAV.map((item) => {
            const Icon = NAV_ICONS[item.id];
            const active = item.id === step;
            return (
              <Link
                key={item.id}
                href={item.href(caseFile.id)}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 font-display text-xs font-bold tracking-[0.08em] uppercase transition-colors",
                  active
                    ? "bg-[#2F5BFF] text-white"
                    : "text-ink hover:bg-[#E8EEF8]",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function stepIndexReached(
  current: CaseStep,
  target: (typeof CASE_NAV)[number]["id"],
): boolean {
  const order: CaseStep[] = ["briefing", "locker", "confront", "scene", "accuse"];
  return order.indexOf(current) >= order.indexOf(target);
}
