"use client";

import { placesFromCase, suspectDossiers } from "@/lib/case-file";
import type { CaseFile } from "@/lib/types";
import { FolderOpen, MapPinned, Users } from "lucide-react";

export function PeopleRoster({ caseFile }: { caseFile: CaseFile }) {
  const dossiers = suspectDossiers(caseFile);
  return (
    <section className="mt-4 space-y-3" aria-label="Suspect dossiers">
      <p className="text-sm leading-snug text-ink">
        Four people of interest. Bios live here; Accuse only asks you to pick a name.
      </p>
      {dossiers.map((suspect) => (
        <article key={suspect.id} className="rounded-xl border border-hairline bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
              <Users className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-2xl font-bold leading-none text-ink">{suspect.name}</h2>
              <p className="mt-1 font-display text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
                {suspect.role}
              </p>
              <p className="mt-2 text-sm leading-snug text-ink">{suspect.personality}</p>
              {suspect.linkedClues.length ? (
                <p className="mt-3 text-xs text-muted">
                  Named in:{" "}
                  {suspect.linkedClues.map((clue) => clue.title).join(" · ")}
                </p>
              ) : (
                <p className="mt-3 text-xs text-muted">No clue names them yet — keep inspecting.</p>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export function PlacesRoster({ caseFile }: { caseFile: CaseFile }) {
  const places = placesFromCase(caseFile);
  return (
    <section className="mt-4 space-y-3" aria-label="Location dossiers">
      <p className="text-sm leading-snug text-ink">
        Places named on the evidence. Open a clue to see its pin on the map of the plaza.
      </p>
      {places.map((place) => (
        <article key={place.name} className="rounded-xl border border-hairline bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
              <MapPinned className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-xl font-bold leading-tight text-ink">{place.name}</h2>
              <p className="mt-2 text-xs text-muted">
                {place.clues.length} clue{place.clues.length === 1 ? "" : "s"} filed here
              </p>
              <ul className="mt-2 space-y-1">
                {place.clues.map((clue) => (
                  <li key={clue.id} className="flex items-center gap-2 text-sm text-ink">
                    <FolderOpen className="size-3.5 shrink-0 text-gold" />
                    <span>
                      {clue.title}
                      <span className="text-muted"> · {clue.timestamp}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
