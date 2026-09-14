"use client";

import { EvidenceArt } from "@/components/evidence-art";
import { FirstUseTip } from "@/components/first-use-tip";
import { PinClueSheet } from "@/components/pin-clue-sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { isCorrectPairForChain } from "@/lib/deduction";
import type { CaseFile, ClueLink, DeductionChain, Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pin, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

/** Deterministic polaroid slots — leaves center free for sticky deductions. */
const PIN_SLOTS: { left: string; top: string; rotate: string }[] = [
  { left: "4%", top: "6%", rotate: "-3deg" },
  { left: "58%", top: "8%", rotate: "2.5deg" },
  { left: "6%", top: "52%", rotate: "2deg" },
  { left: "56%", top: "54%", rotate: "-2deg" },
  { left: "30%", top: "4%", rotate: "1deg" },
  { left: "32%", top: "58%", rotate: "-1.5deg" },
];

const PIN_COLORS = ["#C62828", "#1B2430", "#C62828", "#1B2430", "#8A5A22", "#1B2430"];

function pinAnchor(index: number): { x: number; y: number } {
  const slot = PIN_SLOTS[index % PIN_SLOTS.length]!;
  const left = Number.parseFloat(slot.left);
  const top = Number.parseFloat(slot.top);
  return { x: left + 18, y: top + 4 };
}

export function MosaicCorkboard({
  caseFile,
  filedEvidence,
  pinnedIds,
  links,
  unlockedChains,
  playerNotes,
  onTogglePin,
  onLink,
  onClearChain,
  onSaveNote,
}: {
  caseFile: CaseFile;
  filedEvidence: Evidence[];
  pinnedIds: string[];
  links: ClueLink[];
  unlockedChains: DeductionChain[];
  playerNotes: Record<string, string>;
  onTogglePin: (evidenceId: string) => void;
  onLink: (
    a: string,
    b: string,
  ) => { sound: boolean; message: string; unlockedChainIds: string[] };
  onClearChain: () => void;
  onSaveNote: (evidenceId: string, note: string) => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<[string, string] | null>(null);
  const [linkPick, setLinkPick] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const pinned = useMemo(
    () =>
      pinnedIds
        .map(
          (id) =>
            filedEvidence.find((item) => item.id === id) ??
            caseFile.evidence.find((item) => item.id === id),
        )
        .filter((item): item is Evidence => Boolean(item)),
    [pinnedIds, filedEvidence, caseFile.evidence],
  );

  const unpinnedFiled = useMemo(
    () => filedEvidence.filter((item) => !pinnedIds.includes(item.id)),
    [filedEvidence, pinnedIds],
  );

  const selected = selectedId
    ? (pinned.find((item) => item.id === selectedId) ?? null)
    : null;

  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    pinned.forEach((item, index) => map.set(item.id, index));
    return map;
  }, [pinned]);

  function tryLink(a: string, b: string) {
    const result = onLink(a, b);
    setToast(result.message);
    setLinkPick([]);
    return result;
  }

  function onPinClick(id: string) {
    if (linkPick.length === 1 && linkPick[0] !== id) {
      tryLink(linkPick[0]!, id);
      return;
    }
    if (linkPick.length === 1 && linkPick[0] === id) {
      setLinkPick([]);
      return;
    }
    setSelectedId(id);
  }

  return (
    <section className="space-y-3">
      <header>
        <h1 className="font-serif text-4xl font-bold leading-none text-ink">Corkboard</h1>
        <p className="mt-2 text-base leading-snug text-ink">
          Pin stills, string red yarn, unlock sticky deductions. Accuse stays locked until the
          chains hold.
        </p>
        <FirstUseTip
          tipId="mosaic-corkboard-yarn"
          className="mt-2"
          text="ADD PIN from the Locker, open a pin, then Link to chain — or tap two pins on the board. CLEAR CHAIN pulls yarn only."
        />
      </header>

      <div className="cork-frame relative overflow-hidden rounded-md p-2 shadow-[0_8px_0_rgba(80,50,20,0.18)]">
        <div className="cork-surface relative min-h-[22rem] w-full overflow-hidden rounded-sm sm:min-h-[26rem]">
          <svg
            className="pointer-events-none absolute inset-0 z-10 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {links.map((link) => {
              const ia = indexById.get(link.a);
              const ib = indexById.get(link.b);
              if (ia === undefined || ib === undefined) return null;
              const a = pinAnchor(ia);
              const b = pinAnchor(ib);
              const sound = (caseFile.deductionChains ?? []).some((chain) =>
                isCorrectPairForChain(chain, link.a, link.b),
              );
              return (
                <line
                  key={link.id}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#C62828"
                  strokeWidth={sound ? 0.7 : 0.45}
                  strokeOpacity={sound ? 0.95 : 0.55}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
            {unlockedChains.map((chain) => {
              const centers = chain.requiredEvidenceIds
                .map((id) => indexById.get(id))
                .filter((i): i is number => i !== undefined)
                .map((i) => pinAnchor(i));
              return centers.map((pt, idx) => (
                <line
                  key={`${chain.id}-sticky-${idx}`}
                  x1={pt.x}
                  y1={pt.y}
                  x2={50}
                  y2={42}
                  stroke="#C62828"
                  strokeWidth={0.55}
                  strokeOpacity={0.85}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ));
            })}
          </svg>

          {unlockedChains.length > 0 ? (
            <div className="absolute left-1/2 top-[34%] z-20 w-[44%] -translate-x-1/2 space-y-2">
              {unlockedChains.map((chain) => (
                <div
                  key={chain.id}
                  className="cork-sticky relative bg-[#F7E27A] px-2.5 py-2 shadow-[2px_3px_0_rgba(80,50,20,0.2)]"
                >
                  <span
                    className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-[#C9A227] shadow"
                    aria-hidden
                  />
                  <p className="font-serif text-sm font-bold leading-tight text-ink">
                    {chain.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-ink/80">{chain.insight}</p>
                </div>
              ))}
            </div>
          ) : pinned.length >= 2 ? (
            <p className="absolute left-1/2 top-1/2 z-0 w-[70%] -translate-x-1/2 -translate-y-1/2 text-center font-display text-[10px] font-bold tracking-[0.14em] text-[#8A5A22]/70 uppercase">
              String two pins — sticky unlocks here
            </p>
          ) : null}

          {pinned.length === 0 ? (
            <div className="absolute inset-0 z-20 grid place-items-center p-6 text-center">
              <div>
                <p className="font-serif text-xl font-bold text-ink">Empty board</p>
                <p className="mt-1 text-sm text-ink/80">
                  File clues in the Locker, then ADD PIN to hang stills.
                </p>
              </div>
            </div>
          ) : (
            pinned.map((item, index) => {
              const slot = PIN_SLOTS[index % PIN_SLOTS.length]!;
              const pinColor = PIN_COLORS[index % PIN_COLORS.length]!;
              const active = linkPick.includes(item.id) || selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPinClick(item.id)}
                  className={cn(
                    "absolute z-20 w-[38%] text-left transition-transform",
                    active && "z-30 scale-[1.03]",
                  )}
                  style={{
                    left: slot.left,
                    top: slot.top,
                    transform: `rotate(${slot.rotate})`,
                  }}
                  aria-label={`Open pin ${item.title}`}
                >
                  <span
                    className="absolute -top-1 left-1/2 z-10 size-3.5 -translate-x-1/2 rounded-full shadow"
                    style={{ backgroundColor: pinColor }}
                    aria-hidden
                  />
                  <div
                    className={cn(
                      "rounded-sm border border-white bg-white p-1.5 shadow-[0_4px_10px_rgba(40,20,10,0.28)]",
                      active && "ring-2 ring-[#C62828]/70",
                    )}
                  >
                    <EvidenceArt evidence={item} className="aspect-[4/3] w-full" />
                    <p className="mt-1.5 line-clamp-2 px-0.5 pb-0.5 font-sans text-[10px] font-semibold leading-tight text-ink">
                      {item.caption || item.title}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          className="h-12 rounded-xl bg-[#D4B483] font-display text-sm font-bold tracking-[0.12em] text-ink uppercase hover:bg-[#C9A574]"
          onClick={() => setAddOpen(true)}
        >
          <Pin className="size-4" /> Add pin
        </Button>
        <Button
          type="button"
          variant="bronze"
          className="h-12 rounded-xl border border-[#C4A574]/50 bg-[#F7F1E6] font-display text-sm font-bold tracking-[0.12em] uppercase"
          disabled={links.length === 0}
          onClick={() => {
            onClearChain();
            setToast("Yarn cleared — pins stay.");
            setLinkPick([]);
          }}
        >
          <RefreshCw className="size-4" /> Clear chain
        </Button>
      </div>

      {linkPick.length === 1 ? (
        <p className="rounded-lg border border-[#C62828]/30 bg-[#F8D7D7]/35 px-3 py-2 text-sm font-semibold text-ink">
          Yarn mode · tap a second pin (or open a pin → Link to chain).
          <button type="button" className="ml-2 underline" onClick={() => setLinkPick([])}>
            Cancel
          </button>
        </p>
      ) : null}

      {toast ? (
        <p className="text-sm font-semibold text-ink" role="status">
          {toast}
        </p>
      ) : null}

      {links.length > 0 ? (
        <ul className="space-y-1.5 rounded-xl border border-[#C4A574]/40 bg-[#FFF8EE]/80 p-3">
          <li className="list-none font-display text-[10px] font-bold tracking-[0.14em] text-[#8A5A22] uppercase">
            Yarn on board
          </li>
          {links.map((link) => {
            const a =
              caseFile.evidence.find((item) => item.id === link.a)?.title ?? link.a;
            const b =
              caseFile.evidence.find((item) => item.id === link.b)?.title ?? link.b;
            const sound = (caseFile.deductionChains ?? []).some((chain) =>
              isCorrectPairForChain(chain, link.a, link.b),
            );
            return (
              <li key={link.id} className="text-sm text-ink">
                <span className="font-semibold">{a}</span>
                <span className="mx-1 text-[#C62828]">∿</span>
                <span className="font-semibold">{b}</span>
                <span className="ml-1 text-[11px] text-muted">
                  {sound ? "· sound" : "· frayed"}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent title="Add pin" className="border-[#C4A574]/50 bg-[#F7F1E6]">
          {unpinnedFiled.length === 0 ? (
            <p className="text-sm text-ink">
              {filedEvidence.length === 0
                ? "Open clues in the Locker first — then pin them here."
                : "Every filed clue is already on the board."}
            </p>
          ) : (
            <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
              {unpinnedFiled.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl border border-[#C4A574]/40 bg-white p-2 text-left hover:bg-[#E8D4B0]/35"
                    onClick={() => {
                      onTogglePin(item.id);
                      setAddOpen(false);
                      setToast(`Pinned · ${item.title}`);
                    }}
                  >
                    <EvidenceArt evidence={item} className="size-14 shrink-0 rounded-sm" />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">{item.title}</span>
                      <span className="block truncate text-xs text-muted">{item.caption}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      <PinClueSheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
        caseFile={caseFile}
        evidence={selected}
        pinned={pinned}
        links={links}
        playerNote={selected ? (playerNotes[selected.id] ?? "") : ""}
        onSaveNote={(note) => {
          if (selected) onSaveNote(selected.id, note);
        }}
        onLink={(a, b) => tryLink(a, b)}
        onCompare={(otherId) => {
          if (!selected) return;
          setCompareIds([selected.id, otherId]);
          setSelectedId(null);
        }}
        onUnpin={() => {
          if (!selected) return;
          onTogglePin(selected.id);
          setSelectedId(null);
          setToast("Pin pulled.");
        }}
      />

      <Dialog open={Boolean(compareIds)} onOpenChange={(open) => !open && setCompareIds(null)}>
        <DialogContent title="Compare" className="border-[#C4A574]/50 bg-[#F7F1E6]">
          {compareIds ? (
            <div className="grid grid-cols-2 gap-2">
              {compareIds.map((id) => {
                const item = caseFile.evidence.find((ev) => ev.id === id);
                if (!item) return null;
                return (
                  <div key={id} className="rounded-sm border border-white bg-white p-1.5 shadow">
                    <EvidenceArt evidence={item} className="aspect-square w-full" />
                    <p className="mt-1 text-xs font-semibold text-ink">{item.title}</p>
                    <p className="mt-0.5 line-clamp-3 text-[11px] text-muted">{item.description}</p>
                  </div>
                );
              })}
            </div>
          ) : null}
          {compareIds ? (
            <Button
              type="button"
              className="mt-3 h-11 w-full rounded-xl bg-[#D4B483] font-display text-xs font-bold tracking-[0.12em] text-ink uppercase hover:bg-[#C9A574]"
              onClick={() => {
                tryLink(compareIds[0], compareIds[1]);
                setCompareIds(null);
              }}
            >
              Link these two
            </Button>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
