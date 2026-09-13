"use client";

import { evidenceTitle } from "@/lib/investigation";
import type { CaseFile, CustodyEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Beaker,
  ClipboardList,
  Eye,
  FolderOpen,
  Pin,
  Scale,
} from "lucide-react";

const ACTION_META: Record<
  CustodyEntry["action"],
  { label: string; icon: typeof Eye }
> = {
  collected: { label: "Collected", icon: FolderOpen },
  examined: { label: "Examined", icon: Eye },
  pinned: { label: "Pinned", icon: Pin },
  "lab-sent": { label: "Sent to lab", icon: Beaker },
  "lab-returned": { label: "Lab returned", icon: Beaker },
  "confronted-with": { label: "Used in confront", icon: Scale },
};

function formatWhen(at: number) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(at);
  } catch {
    return new Date(at).toLocaleTimeString();
  }
}

export function CustodyLog({
  caseFile,
  entries,
  className,
}: {
  caseFile: CaseFile;
  entries: CustodyEntry[];
  className?: string;
}) {
  const chronological = [...entries].reverse();

  return (
    <section className={cn("space-y-3", className)}>
      <header className="rounded-xl border-2 border-gold bg-[#DCE6FF]/45 p-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-gold" />
          <p className="font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
            Chain of custody
          </p>
        </div>
        <h2 className="mt-1 font-serif text-2xl font-bold text-ink">Case binder</h2>
        <p className="mt-1 text-sm leading-snug text-ink">
          Every bag, re-open, lab send, and confront lands here — a running file, not stickers.
        </p>
      </header>

      {chronological.length === 0 ? (
        <p className="rounded-xl border border-hairline bg-card p-4 text-sm text-muted">
          Empty binder. Open a clue to start the chain of custody.
        </p>
      ) : (
        <ol className="space-y-2">
          {chronological.map((entry, index) => {
            const meta = ACTION_META[entry.action];
            const Icon = meta.icon;
            return (
              <li
                key={`${entry.at}-${entry.evidenceId}-${entry.action}-${index}`}
                className="rounded-xl border border-hairline bg-card p-3"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#E8EEF8] text-gold">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                        {meta.label}
                      </p>
                      <time className="text-[11px] text-muted" dateTime={new Date(entry.at).toISOString()}>
                        {formatWhen(entry.at)}
                      </time>
                    </div>
                    <p className="mt-0.5 font-serif text-lg font-bold leading-tight text-ink">
                      {evidenceTitle(caseFile, entry.evidenceId)}
                    </p>
                    {entry.detail ? (
                      <p className="mt-1 text-sm leading-snug text-ink">{entry.detail}</p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
