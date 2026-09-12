"use client";

import { FileSearch, Sofa, X } from "lucide-react";
import { useEffect, useState } from "react";
import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "street-heists.onboarding-seen";

export function FirstRunCoach() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Restore this small UI preference only after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(window.localStorage.getItem(STORAGE_KEY) !== "true");
  }, []);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section className="mt-4 rounded-2xl border border-hairline bg-elevated p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-ink">
          <KeyholeLogo className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">
            First-run coach
          </p>
          <h2 className="font-serif text-xl font-semibold text-ink">Your first couch case</h2>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full p-1 text-muted hover:bg-ink/5 hover:text-ink"
          aria-label="Dismiss how to play"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="mt-3 space-y-2 text-sm leading-snug text-ink">
        <p className="flex gap-2">
          <Sofa className="mt-0.5 size-4 shrink-0 text-gold" />
          <strong>Stay on the couch — the game gives you all the evidence.</strong>
        </p>
        <p className="flex gap-2">
          <FileSearch className="mt-0.5 size-4 shrink-0 text-gold" />
          Flip through clues (swipe or Next), compare shared people/places, then accuse Who / How / Where.
        </p>
      </div>
      <Button className="mt-3 w-full" onClick={dismiss}>
        I understand
      </Button>
    </section>
  );
}
