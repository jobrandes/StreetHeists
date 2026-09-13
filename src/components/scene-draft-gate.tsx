"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

const KEY = "street-heists.scene-draft-gate";

/** One-time interstitial: Scene is a scratchpad; Accuse is where it counts. */
export function SceneDraftGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate tip preference
    setOpen(window.localStorage.getItem(KEY) !== "1");
  }, []);

  function dismiss() {
    window.localStorage.setItem(KEY, "1");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && dismiss()}>
      <DialogContent title="Scratchpad only" className="play-day">
        <p className="rounded-md border border-dashed border-[#C9A227] bg-[#FFF6D9] px-3 py-2 font-display text-[10px] font-bold tracking-[0.14em] text-[#7A5B00] uppercase">
          Draft · does not count
        </p>
        <p className="mt-3 text-sm leading-snug text-ink">
          Scene desk is where you sketch Who / How / Where. Accuse is the real submission —
          same questions, but with proof attached and a locked verdict.
        </p>
        <Button className="mt-5 w-full rounded-lg font-display tracking-[0.12em] uppercase" onClick={dismiss}>
          Got it — draft away
        </Button>
      </DialogContent>
    </Dialog>
  );
}
