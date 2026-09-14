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
import { Archive, Pin, Scale } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const NAV_ICONS = {
  locker: Archive,
  corkboard: Pin,
  accuse: Scale,
} as const;

/** Shared content width: phone column; tablet uses the screen. */
const SHELL =
  "mx-auto w-full max-w-[430px] min-[600px]:max-w-5xl min-[900px]:max-w-6xl xl:max-w-7xl";

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
  const room: Exclude<CaseStep, "briefing"> =
    step === "briefing" ? "locker" : step;
  /** Corkboard/accuse already coach in-page — skip the tall status card on tablet. */
  const showStatusCard = step === "briefing" || step === "locker" || true;
  const compactStatus = step === "corkboard" || step === "accuse";

  return (
    <div className="play-day flex min-h-dvh flex-col">
      <div className="sticky top-0 z-30 border-b border-hairline bg-[#F3EEE4]/95 px-4 pb-2.5 pt-3 backdrop-blur min-[600px]:px-8 min-[900px]:pb-2">
        <div className={cn(SHELL, "flex items-center justify-between gap-2")}>
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
          <div className="min-w-0 text-center">
            <p className="truncate font-serif text-lg font-semibold text-ink min-[900px]:text-xl">
              Street Heists
            </p>
            <p className="truncate font-display text-[10px] font-bold tracking-[0.16em] text-muted uppercase">
              ● {strip.stepLabel} ● {caseFile.title}
            </p>
          </div>
          <CaseNotebookButton caseFile={caseFile} progress={progress} />
        </div>

        {/* Mosaic v0.2 — Locker | Corkboard | Accuse (no Map) */}
        <div
          className={cn(
            SHELL,
            "mt-2.5 grid grid-cols-3 gap-1.5 rounded-2xl border border-[#C4A574]/50 bg-[#F7F1E6] p-1.5 shadow-[0_2px_0_rgba(27,36,48,0.08)] min-[900px]:mt-3 min-[900px]:max-w-xl min-[900px]:gap-1",
          )}
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
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl font-display text-[11px] font-bold tracking-[0.12em] uppercase transition-colors min-[600px]:min-h-12 min-[900px]:min-h-11 min-[900px]:flex-row min-[900px]:gap-1.5 min-[900px]:text-xs",
                  active
                    ? "border border-[#B8893D] bg-[#E8D4B0] text-ink shadow-[0_3px_0_rgba(120,80,30,0.25)]"
                    : "text-ink/70 hover:bg-[#EFE6D6]",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {showStatusCard ? (
          <div
            className={cn(
              SHELL,
              "mt-2.5 rounded-lg border border-[#C4A574]/40 bg-[#FFF8EE]/90 px-3 py-2 min-[900px]:mt-2",
              compactStatus && "min-[900px]:hidden",
            )}
          >
            <p className="font-display text-xs font-bold tracking-[0.14em] text-[#8A5A22] uppercase">
              {strip.stepLabel}
            </p>
            <p className="mt-1 text-base font-medium leading-snug text-ink">
              {strip.detail}
            </p>
          </div>
        ) : null}

        {step === "briefing" || step === "locker" ? (
          <FirstUseTip
            tipId="mosaic-three-rooms"
            className={cn(SHELL, "mt-2")}
            text="Three rooms: Locker (clues), Corkboard (string yarn → deductions), Accuse (Who / How / Where). No map in v0.2."
          />
        ) : null}
      </div>

      <div
        className={cn(
          SHELL,
          "flex-1 px-4 pb-10 pt-4 text-base leading-snug min-[600px]:px-8 min-[600px]:pb-12 min-[900px]:pt-5",
        )}
      >
        {children}
      </div>
    </div>
  );
}
