"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { VERSION_UPDATES, versionStampLabel } from "@/lib/version";
import { cn } from "@/lib/utils";

/** Small, tappable version + date. Opens a tiny dated update list. */
export function VersionStamp({
  className,
  tone = "ink",
}: {
  className?: string;
  /** Splash is dark; case board is light. */
  tone?: "ink" | "light";
}) {
  const tip = VERSION_UPDATES[0];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "rounded-md px-2 py-1 font-display text-[10px] font-bold tracking-[0.16em] uppercase transition-colors",
            tone === "light"
              ? "text-white/55 hover:bg-white/10 hover:text-white/80"
              : "text-muted hover:bg-card hover:text-ink",
            className,
          )}
          aria-label={`App version ${versionStampLabel()}. Open update notes.`}
        >
          {versionStampLabel()}
        </button>
      </DialogTrigger>
      <DialogContent title="Updates" className="play-day">
        <p className="text-sm text-muted">
          Version {tip?.version} · shipped {tip?.date}
        </p>
        <ul className="mt-3 max-h-[min(50vh,20rem)] space-y-3 overflow-y-auto">
          {VERSION_UPDATES.map((item) => (
            <li
              key={`${item.version}-${item.date}`}
              className="rounded-lg border border-hairline bg-card px-3 py-2"
            >
              <p className="font-display text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
                v{item.version} · {item.date}
              </p>
              <p className="mt-1 text-sm leading-snug text-ink">{item.note}</p>
            </li>
          ))}
        </ul>
        <DialogClose asChild>
          <Button variant="gold" className="mt-4 w-full">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
