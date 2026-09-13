"use client";

import { FirstUseTip } from "@/components/first-use-tip";
import { placesFromCase, suspectDossiers } from "@/lib/case-file";
import type { CaseFile } from "@/lib/types";
import { FolderOpen, MapPinned, Users } from "lucide-react";

export function PeopleRoster({ caseFile }: { caseFile: CaseFile }) {
  const dossiers = suspectDossiers(caseFile);
  return (
    <section className="mt-4 space-y-3" aria-label="Suspect dossiers">
      <FirstUseTip
        tipId="people-tab"
        text="People = dossiers only. Confront is where you press them with an exhibit; Accuse is where you name the culprit."
      />
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

/** Deterministic pin positions so the plaza map stays stable across renders. */
function pinPosition(name: string, index: number, total: number): { left: number; top: number } {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const ring = 18 + (hash % 22);
  const angle = ((index + 0.35) / Math.max(total, 1)) * Math.PI * 2 + (hash % 17) * 0.05;
  const left = 50 + Math.cos(angle) * ring;
  const top = 48 + Math.sin(angle) * (ring * 0.72);
  return {
    left: Math.min(88, Math.max(12, left)),
    top: Math.min(82, Math.max(16, top)),
  };
}

export function PlacesRoster({ caseFile }: { caseFile: CaseFile }) {
  const places = placesFromCase(caseFile);
  return (
    <section className="mt-4 space-y-3" aria-label="Location dossiers">
      <FirstUseTip
        tipId="places-map"
        text="Places lists every location named on evidence. Pins on the plaza map match those spots — tap a pin or read the list below."
      />
      <p className="text-sm leading-snug text-ink">
        Places named on the evidence. Pins below mark them on the plaza map.
      </p>

      <div
        className="relative overflow-hidden rounded-xl border border-hairline bg-[linear-gradient(165deg,#DCE6FF_0%,#EEF2F6_45%,#C8D4E8_100%)] p-3"
        aria-label="Plaza map"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 48%, rgba(47,91,255,0.12), transparent 42%), repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(27,36,48,0.06) 18px, rgba(27,36,48,0.06) 19px), repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(27,36,48,0.06) 18px, rgba(27,36,48,0.06) 19px)",
          }}
        />
        <p className="relative font-display text-[10px] font-bold tracking-[0.18em] text-[#2F5BFF] uppercase">
          Plaza map
        </p>
        <div className="relative mt-2 h-44 w-full">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#2F5BFF]/35 bg-white/50"
          />
          <p
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[9px] font-bold tracking-[0.12em] text-[#2F5BFF]/70 uppercase"
          >
            Fountain
          </p>
          {places.map((place, index) => {
            const pos = pinPosition(place.name, index, places.length);
            const short = place.name.split("·")[0]?.trim() ?? place.name;
            return (
              <div
                key={place.name}
                className="absolute z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center"
                style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                title={place.name}
              >
                <span className="max-w-[5.5rem] truncate rounded-md bg-ink px-1.5 py-0.5 text-center text-[9px] font-semibold leading-tight text-white shadow-sm">
                  {short}
                </span>
                <MapPinned className="size-5 text-[#C62828] drop-shadow" aria-hidden />
                <span className="sr-only">
                  {place.name}: {place.clues.length} clue
                  {place.clues.length === 1 ? "" : "s"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

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
