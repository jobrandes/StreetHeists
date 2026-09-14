"use client";

import { EvidenceArt } from "@/components/evidence-art";
import { FirstUseTip } from "@/components/first-use-tip";
import { PinClueSheet } from "@/components/pin-clue-sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { chainsRequiredToAccuse } from "@/lib/deduction";
import type { CaseFile, ClueLink, DeductionChain, Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Info, Link2, Pin } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/** Polaroid slots — center stays open for yellow sticky notes. */
const PIN_SLOTS: { left: string; top: string; rotate: string }[] = [
  { left: "3%", top: "5%", rotate: "-3deg" },
  { left: "62%", top: "6%", rotate: "2.5deg" },
  { left: "4%", top: "52%", rotate: "2deg" },
  { left: "61%", top: "53%", rotate: "-2deg" },
  { left: "33%", top: "3%", rotate: "1deg" },
  { left: "34%", top: "58%", rotate: "-1.5deg" },
];

const PIN_COLORS = ["#C62828", "#1B2430", "#C62828", "#1B2430", "#8A5A22", "#1B2430"];

function pinAnchor(index: number): { x: number; y: number } {
  const slot = PIN_SLOTS[index % PIN_SLOTS.length]!;
  return {
    x: Number.parseFloat(slot.left) + 18,
    y: Number.parseFloat(slot.top) + 4,
  };
}

type BoardStep = "locker" | "pin" | "connect" | "done";

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
  const [linkPick, setLinkPick] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const stickiesNeeded = chainsRequiredToAccuse(caseFile);
  const stickiesHave = unlockedChains.length;
  const ready = stickiesNeeded === 0 || stickiesHave >= stickiesNeeded;

  /** Tutorial only — show the exact pair so first-timers are not guessing. */
  const isTutorial = caseFile.difficulty === "tutorial";
  const examplePair = useMemo(() => {
    if (!isTutorial) return null;
    const chain = (caseFile.deductionChains ?? [])[0];
    const pair = chain?.correctPairs?.[0];
    if (!chain || !pair) return null;
    const [idA, idB] = pair;
    const a = caseFile.evidence.find((item) => item.id === idA) ?? null;
    const b = caseFile.evidence.find((item) => item.id === idB) ?? null;
    if (!a || !b) return null;
    return { chain, a, b };
  }, [isTutorial, caseFile]);

  const exampleFiled =
    Boolean(examplePair) &&
    filedEvidence.some((item) => item.id === examplePair!.a.id) &&
    filedEvidence.some((item) => item.id === examplePair!.b.id);
  const examplePinned =
    Boolean(examplePair) &&
    pinnedIds.includes(examplePair!.a.id) &&
    pinnedIds.includes(examplePair!.b.id);
  const exampleLinked =
    Boolean(examplePair) &&
    links.some(
      (link) =>
        (link.a === examplePair!.a.id && link.b === examplePair!.b.id) ||
        (link.a === examplePair!.b.id && link.b === examplePair!.a.id),
    );

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

  const step: BoardStep = ready
    ? "done"
    : filedEvidence.length === 0
      ? "locker"
      : pinned.length < 2
        ? "pin"
        : "connect";

  /** In connect step, every pin tap is for pairing — no mode button. */
  const connectMode = step === "connect";

  useEffect(() => {
    if (step === "pin" && unpinnedFiled.length > 0 && pinned.length === 0) {
      setAddOpen(true);
    }
  }, [step, unpinnedFiled.length, pinned.length]);

  useEffect(() => {
    if (step !== "connect") setLinkPick([]);
  }, [step]);

  function tryLink(a: string, b: string) {
    const result = onLink(a, b);
    setToast(result.message);
    setLinkPick([]);
    return result;
  }

  function hangExampleClues() {
    if (!examplePair) return;
    if (!pinnedIds.includes(examplePair.a.id)) onTogglePin(examplePair.a.id);
    if (!pinnedIds.includes(examplePair.b.id)) onTogglePin(examplePair.b.id);
    setAddOpen(false);
    setToast(
      `Example hung · ${examplePair.a.title} + ${examplePair.b.title}. Tap Connect, or tap both photos.`,
    );
  }

  /** One-tap tutorial: hang the named pair (if needed) and string them. */
  function connectExampleClues() {
    if (!examplePair) return;
    if (!exampleFiled) {
      setToast("Open the Locker and inspect both example clues first.");
      return;
    }
    if (!pinnedIds.includes(examplePair.a.id)) onTogglePin(examplePair.a.id);
    if (!pinnedIds.includes(examplePair.b.id)) onTogglePin(examplePair.b.id);
    setAddOpen(false);
    const result = tryLink(examplePair.a.id, examplePair.b.id);
    if (result.sound) {
      setToast(
        result.message ||
          `Connected · ${examplePair.chain.title} unlocked. Open Accuse.`,
      );
    } else {
      setToast(result.message);
    }
  }

  function onPinClick(id: string) {
    if (connectMode) {
      if (linkPick.length === 0) {
        setLinkPick([id]);
        setToast("Now tap a second clue that goes with this one.");
        return;
      }
      if (linkPick[0] === id) {
        setLinkPick([]);
        setToast("Cleared — tap a clue to start again.");
        return;
      }
      tryLink(linkPick[0]!, id);
      return;
    }
    setSelectedId(id);
  }

  return (
    <section className="space-y-3 min-[900px]:grid min-[900px]:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] min-[900px]:items-start min-[900px]:gap-6 min-[900px]:space-y-0">
      <div className="space-y-3 min-[900px]:sticky min-[900px]:top-28">
      <header>
        <h1 className="font-serif text-4xl font-bold leading-none text-ink">Corkboard</h1>
        <p className="mt-2 text-base leading-snug text-ink">
          Your wall of clues. Hang photos, connect related ones, unlock a yellow note — then Accuse.
        </p>
      </header>

      <nav
        aria-label="Corkboard steps"
        className="grid grid-cols-3 gap-1 rounded-xl border border-[#C4A574]/45 bg-[#FFF8EE] p-1.5"
      >
        {(
          [
            { id: "pin", label: "1 · Hang clues" },
            { id: "connect", label: "2 · Connect two" },
            { id: "done", label: "3 · Accuse" },
          ] as const
        ).map((item) => {
          const active =
            (item.id === "pin" && (step === "locker" || step === "pin")) ||
            (item.id === "connect" && step === "connect") ||
            (item.id === "done" && step === "done");
          const complete =
            (item.id === "pin" && (step === "connect" || step === "done")) ||
            (item.id === "connect" && step === "done");
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-lg px-2 py-2 text-center font-display text-[10px] font-bold tracking-[0.08em] uppercase",
                active && "bg-[#1B2430] text-[#F2F0EA]",
                complete && !active && "bg-[#E8D4B0] text-ink",
                !active && !complete && "text-muted",
              )}
            >
              {item.label}
            </div>
          );
        })}
      </nav>

      <div className="rounded-xl border-2 border-[#1B2430]/15 bg-white px-4 py-3 shadow-[0_2px_0_rgba(27,36,48,0.06)]">
        {step === "locker" ? (
          <>
            <p className="font-display text-[11px] font-bold tracking-[0.14em] text-[#8A5A22] uppercase">
              Do this now
            </p>
            <p className="mt-1 text-base font-semibold leading-snug text-ink">
              Open clues in the Locker first. Come back when you have photos to hang.
            </p>
          </>
        ) : null}
        {step === "pin" ? (
          <>
            <p className="font-display text-[11px] font-bold tracking-[0.14em] text-[#8A5A22] uppercase">
              Do this now
            </p>
            {examplePair ? (
              <p className="mt-1 text-base font-semibold leading-snug text-ink">
                Hang the tutorial pair:{" "}
                <span className="underline">{examplePair.a.title}</span> and{" "}
                <span className="underline">{examplePair.b.title}</span>.
              </p>
            ) : (
              <p className="mt-1 text-base font-semibold leading-snug text-ink">
                Hang at least two clues. Use the big{" "}
                <span className="underline">Add clue to board</span> button.
              </p>
            )}
          </>
        ) : null}
        {step === "connect" ? (
          <>
            <p className="font-display text-[11px] font-bold tracking-[0.14em] text-[#C62828] uppercase">
              Do this now
            </p>
            {examplePair && !exampleLinked ? (
              <>
                <p className="mt-1 text-base font-semibold leading-snug text-ink">
                  Tutorial example — connect these two clues:
                </p>
                <div className="mt-3 rounded-lg border-2 border-dashed border-[#C62828]/45 bg-[#FFF5F5] px-3 py-3">
                  <p className="font-serif text-lg font-bold leading-snug text-ink">
                    {examplePair.a.title}
                  </p>
                  <p className="my-1 font-display text-xs font-bold tracking-[0.14em] text-[#C62828] uppercase">
                    connects to
                  </p>
                  <p className="font-serif text-lg font-bold leading-snug text-ink">
                    {examplePair.b.title}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Tap those two photos on the board — or use the button below.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="mt-1 text-base font-semibold leading-snug text-ink">
                  {linkPick.length === 0
                    ? "Tap one clue photo, then tap another that belongs with it."
                    : "Good — now tap the second clue."}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Right pair → yellow sticky appears. Wrong pair → nothing sticks.
                </p>
              </>
            )}
          </>
        ) : null}
        {step === "done" ? (
          <>
            <p className="font-display text-[11px] font-bold tracking-[0.14em] text-[#2F5BFF] uppercase">
              Ready
            </p>
            <p className="mt-1 text-base font-semibold leading-snug text-ink">
              Yellow sticky unlocked. Open Accuse when you&apos;re ready.
            </p>
          </>
        ) : null}
        <p className="mt-3 text-sm font-semibold text-ink">
          Yellow notes {stickiesHave}/{stickiesNeeded || Math.max(stickiesHave, 1)}
          {ready ? " · Accuse is open" : " · keep connecting"}
        </p>
      </div>

      {examplePair ? (
        <FirstUseTip
          tipId="corkboard-example-v5"
          text={`Tutorial tip: hang ${examplePair.a.title} + ${examplePair.b.title}, then tap “Connect the example for me.” A yellow note unlocks Accuse.`}
        />
      ) : null}

      {step === "locker" ? (
        <Button
          asChild
          size="xl"
          className="h-14 w-full rounded-xl bg-[#1B2430] font-display text-lg font-bold tracking-[0.12em] text-[#F2F0EA] uppercase"
        >
          <Link href={`/case/${caseFile.id}/evidence`}>
            Open Locker <ArrowRight className="size-5" />
          </Link>
        </Button>
      ) : null}

      {step === "pin" ? (
        <div className="space-y-2">
          {examplePair && exampleFiled && !examplePinned ? (
            <Button
              type="button"
              size="xl"
              className="h-14 w-full rounded-xl bg-[#C62828] font-display text-lg font-bold tracking-[0.1em] text-white uppercase hover:bg-[#B71C1C]"
              onClick={hangExampleClues}
            >
              <Pin className="size-5" /> Hang the example clues
            </Button>
          ) : examplePair && !exampleFiled ? (
            <Button
              asChild
              size="xl"
              className="h-14 w-full rounded-xl bg-[#1B2430] font-display text-lg font-bold tracking-[0.1em] text-[#F2F0EA] uppercase"
            >
              <Link href={`/case/${caseFile.id}/evidence`}>
                Open Locker · find the example clues
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              size="xl"
              className="h-14 w-full rounded-xl bg-[#D4B483] font-display text-lg font-bold tracking-[0.12em] text-ink uppercase hover:bg-[#C9A574]"
              onClick={() => setAddOpen(true)}
            >
              <Pin className="size-5" /> Add clue to board
            </Button>
          )}
        </div>
      ) : null}

      {step === "connect" ? (
        <div className="space-y-2">
          {examplePair && !exampleLinked && exampleFiled ? (
            <Button
              type="button"
              size="xl"
              className="h-14 w-full rounded-xl bg-[#C62828] font-display text-base font-bold tracking-[0.08em] text-white uppercase hover:bg-[#B71C1C]"
              onClick={connectExampleClues}
            >
              <Link2 className="size-5" />{" "}
              {examplePinned
                ? "Connect the example for me"
                : "Hang & connect the example"}
            </Button>
          ) : null}
          {examplePair && !exampleLinked && !exampleFiled ? (
            <Button
              asChild
              size="xl"
              className="h-14 w-full rounded-xl bg-[#1B2430] font-display text-base font-bold tracking-[0.08em] text-[#F2F0EA] uppercase"
            >
              <Link href={`/case/${caseFile.id}/evidence`}>
                Open Locker · inspect the example clues
              </Link>
            </Button>
          ) : null}
          <div className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#C62828]/50 bg-[#F8D7D7]/45 font-display text-sm font-bold tracking-[0.1em] text-ink uppercase">
            <Link2 className="size-5 text-[#C62828]" />
            {linkPick.length === 0
              ? examplePair
                ? "Or tap the two Example-tagged photos"
                : "Tap two clues that belong together"
              : "Tap the second clue"}
          </div>
          {linkPick.length > 0 ? (
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-center text-center text-sm font-semibold text-muted underline"
              onClick={() => {
                setLinkPick([]);
                setToast(null);
              }}
            >
              Cancel selection
            </button>
          ) : null}
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-1.5 text-xs text-muted"
            onClick={() => {
              if (pinned[0]) setSelectedId(pinned[0].id);
            }}
          >
            <Info className="size-3.5" /> Need a closer look? Open clue details
          </button>
        </div>
      ) : null}

      {step === "done" ? (
        <Button
          asChild
          size="xl"
          className="h-14 w-full rounded-xl font-display text-lg font-bold tracking-[0.12em] uppercase"
        >
          <Link href={`/case/${caseFile.id}/accuse`}>
            Open Accuse <ArrowRight className="size-5" />
          </Link>
        </Button>
      ) : null}

      {toast ? (
        <p
          className="rounded-lg border border-[#C4A574]/40 bg-[#FFF8EE] px-3 py-2 text-sm font-semibold text-ink"
          role="status"
        >
          {toast}
        </p>
      ) : null}

      {step !== "locker" && pinned.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          {step !== "pin" ? (
            <button
              type="button"
              className="inline-flex min-h-11 items-center font-semibold underline underline-offset-2"
              onClick={() => setAddOpen(true)}
            >
              Add another clue
            </button>
          ) : (
            <span />
          )}
          {links.length > 0 ? (
            <button
              type="button"
              className="inline-flex min-h-11 items-center font-semibold underline underline-offset-2"
              onClick={() => {
                onClearChain();
                setToast("Connections cleared — pins stay.");
                setLinkPick([]);
              }}
            >
              Clear connections
            </button>
          ) : null}
        </div>
      ) : null}

      </div>

      <div className="space-y-3 min-[900px]:min-h-0">
      <div className="cork-frame relative overflow-hidden rounded-md p-2 shadow-[0_8px_0_rgba(80,50,20,0.18)]">
        <div className="cork-surface relative min-h-[22rem] w-full overflow-hidden rounded-sm min-[600px]:min-h-[min(62dvh,36rem)] min-[900px]:min-h-[min(72dvh,44rem)]">
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
              return (
                <line
                  key={link.id}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#C62828"
                  strokeWidth={0.7}
                  strokeOpacity={0.95}
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
                  key={`${chain.id}-hub-${idx}`}
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
            {linkPick.length === 1 && indexById.has(linkPick[0]!) ? (
              <circle
                cx={pinAnchor(indexById.get(linkPick[0]!)!).x}
                cy={pinAnchor(indexById.get(linkPick[0]!)!).y}
                r={1.8}
                fill="#C62828"
                opacity={0.9}
              />
            ) : null}
          </svg>

          {unlockedChains.length > 0 ? (
            <div className="absolute left-1/2 top-[34%] z-20 w-[48%] -translate-x-1/2 space-y-2 min-[600px]:w-[34%] min-[900px]:w-[28%]">
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
          ) : connectMode ? (
            <p className="absolute left-1/2 top-1/2 z-0 w-[72%] -translate-x-1/2 -translate-y-1/2 text-center font-display text-[10px] font-bold tracking-[0.12em] text-[#8A5A22]/75 uppercase">
              Yellow note appears here when two clues match
            </p>
          ) : null}

          {pinned.length === 0 ? (
            <div className="absolute inset-0 z-20 grid place-items-center p-6 text-center">
              <div>
                <p className="font-serif text-xl font-bold text-ink">Nothing pinned yet</p>
                <p className="mt-1 text-sm text-ink/80">
                  {filedEvidence.length === 0
                    ? "Open clues in the Locker, then hang them here."
                    : "Add at least two clues to start connecting."}
                </p>
              </div>
            </div>
          ) : (
            pinned.map((item, index) => {
              const slot = PIN_SLOTS[index % PIN_SLOTS.length]!;
              const pinColor = PIN_COLORS[index % PIN_COLORS.length]!;
              const active = linkPick.includes(item.id);
              const isExample =
                Boolean(examplePair) &&
                (item.id === examplePair!.a.id || item.id === examplePair!.b.id) &&
                !exampleLinked;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPinClick(item.id)}
                  className={cn(
                    "absolute z-20 w-[38%] text-left transition-transform min-[600px]:w-[26%] min-[900px]:w-[22%]",
                    active && "z-30 scale-[1.04]",
                    isExample && "z-30",
                  )}
                  style={{
                    left: slot.left,
                    top: slot.top,
                    transform: `rotate(${slot.rotate})`,
                  }}
                  aria-label={
                    connectMode
                      ? linkPick.length === 0
                        ? `Select ${item.title} as first clue`
                        : `Connect to ${item.title}`
                      : `Details for ${item.title}`
                  }
                >
                  <span
                    className="absolute -top-1 left-1/2 z-10 size-3.5 -translate-x-1/2 rounded-full shadow"
                    style={{ backgroundColor: pinColor }}
                    aria-hidden
                  />
                  {isExample ? (
                    <span className="absolute -top-3 left-1 z-20 rounded-sm bg-[#C62828] px-1.5 py-0.5 font-display text-[9px] font-bold tracking-[0.12em] text-white uppercase shadow">
                      Example
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "rounded-sm border border-white bg-white p-1.5 shadow-[0_4px_10px_rgba(40,20,10,0.28)]",
                      active && "ring-2 ring-[#C62828]",
                      isExample && !active && "ring-2 ring-[#C62828]/70 ring-offset-1",
                      connectMode && !active && !isExample && "ring-1 ring-[#C62828]/30",
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

      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent title="Add clue" className="border-[#C4A574]/50 bg-[#F7F1E6]">
          {unpinnedFiled.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-ink">
                {filedEvidence.length === 0
                  ? "No clues filed yet. Open the Locker and inspect photos first."
                  : "Every filed clue is already on the board."}
              </p>
              {filedEvidence.length === 0 ? (
                <Button asChild className="w-full">
                  <Link href={`/case/${caseFile.id}/evidence`}>Open Locker</Link>
                </Button>
              ) : null}
            </div>
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
                      setToast(`On the board · ${item.title}`);
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
        onCompare={() => undefined}
        onUnpin={() => {
          if (!selected) return;
          onTogglePin(selected.id);
          setSelectedId(null);
          setToast("Clue removed from board.");
        }}
      />
    </section>
  );
}
