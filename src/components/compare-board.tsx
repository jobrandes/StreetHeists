"use client";

import {
  compareLinks,
  personChipClass,
  type EvidenceLinks,
} from "@/lib/case-file";
import type { CaseFile, Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GitCompareArrows, MapPin, Users } from "lucide-react";

export function LinkChips({
  caseFile,
  links,
  className,
}: {
  caseFile: CaseFile;
  links: EvidenceLinks;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {links.people.map((person) => (
        <span
          key={person.id}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
            personChipClass(person.id, caseFile.suspects),
          )}
        >
          <Users className="size-3 shrink-0 opacity-80" />
          {person.name}
        </span>
      ))}
      <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-hairline bg-[#E8EEF8] px-2 py-0.5 text-[11px] font-semibold text-ink">
        <MapPin className="size-3 shrink-0 text-gold" />
        <span className="truncate">{links.place}</span>
      </span>
    </div>
  );
}

export function CompareBoard({
  caseFile,
  items,
}: {
  caseFile: CaseFile;
  items: Evidence[];
}) {
  const { perClue, board } = compareLinks(caseFile, items);
  const shared = board.filter((link) => link.shared);
  const onlyOnce = board.filter((link) => !link.shared);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border-2 border-gold bg-[#DCE6FF]/45 p-3">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="size-4 text-gold" />
          <p className="font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
            Shared links
          </p>
        </div>
        {shared.length ? (
          <ul className="mt-3 space-y-2">
            {shared.map((link) => (
              <li
                key={`${link.kind}-${link.id}`}
                className="rounded-lg border border-hairline bg-card p-2.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {link.kind === "person" ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                        personChipClass(link.id, caseFile.suspects),
                      )}
                    >
                      <Users className="size-3" />
                      {link.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-[#E8EEF8] px-2 py-0.5 text-[11px] font-semibold text-ink">
                      <MapPin className="size-3 text-gold" />
                      {link.label}
                    </span>
                  )}
                  <span className="font-display text-[10px] font-bold tracking-[0.12em] text-muted uppercase">
                    on {link.evidenceIds.length} clues
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-snug text-ink">
                  {link.evidenceTitles.join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm leading-snug text-ink">
            No shared person or place yet. Open more clues — overlap lights up
            when the same name or location appears on more than one.
          </p>
        )}
        {onlyOnce.length > 0 && items.length > 1 ? (
          <p className="mt-3 text-[11px] leading-snug text-muted">
            Only on one clue here:{" "}
            {onlyOnce.map((link) => link.label).join(" · ")}
          </p>
        ) : null}
      </section>

      <div className="space-y-3">
        {items.map((item) => {
          const links = perClue[item.id] ?? {
            people: [],
            place: item.location,
          };
          return (
            <article
              key={item.id}
              className="rounded-xl border border-hairline bg-card p-3"
            >
              <p className="font-serif text-lg font-bold text-ink">{item.title}</p>
              <p className="mt-1 text-xs text-muted">
                {item.location} · {item.timestamp}
              </p>
              <LinkChips caseFile={caseFile} links={links} className="mt-2" />
              {(item.howHint || item.whereHint) ? (
                <dl className="mt-2 grid gap-1.5 rounded-lg border border-hairline bg-[#E8EEF8] p-2 text-xs">
                  {item.howHint ? (
                    <div>
                      <dt className="font-display text-[9px] font-bold tracking-[0.12em] text-muted uppercase">How</dt>
                      <dd className="font-semibold text-ink">{item.howHint}</dd>
                    </div>
                  ) : null}
                  {item.whereHint ? (
                    <div>
                      <dt className="font-display text-[9px] font-bold tracking-[0.12em] text-muted uppercase">Where</dt>
                      <dd className="font-semibold text-ink">{item.whereHint}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
              <p className="mt-2 text-sm text-ink">{item.deduction}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
