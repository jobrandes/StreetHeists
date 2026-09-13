"use client";

import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import { FolderSearch, Scale, X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "street-heists.onboarding-seen";

const STOPS = [
  {
    icon: FolderSearch,
    title: "Gather",
    copy: "We give you every photo, doc, and note. Open each clue — takeaways auto-file into Case file.",
  },
  {
    icon: Scale,
    title: "Decide",
    copy: "Fill Who / How / Where, attach proof from filed clues, then Accuse. That’s the only call that locks the case.",
  },
] as const;

export function FirstRunCoach() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate preference
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
          <p className="font-display text-xs font-semibold tracking-[0.18em] text-gold uppercase">
            First-run coach
          </p>
          <h2 className="font-serif text-2xl font-semibold text-ink">Two rooms only</h2>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="min-h-11 min-w-11 rounded-full p-1 text-muted hover:bg-ink/5 hover:text-ink"
          aria-label="Dismiss how to play"
        >
          <X className="size-5" />
        </button>
      </div>
      <ol className="mt-3 space-y-3">
        {STOPS.map((stop, index) => {
          const Icon = stop.icon;
          return (
            <li key={stop.title} className="flex gap-2.5 text-base leading-snug text-ink">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-[#DCE6FF] text-[#2F5BFF]">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="font-display text-xs font-bold tracking-[0.12em] text-gold uppercase">
                  {index + 1} · {stop.title}
                </p>
                <p className="mt-0.5">{stop.copy}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-base leading-snug text-muted">
        Tap Case file anytime — it remembers so you don’t have to.
      </p>
      <Button className="mt-3 h-12 w-full" onClick={dismiss}>
        I understand
      </Button>
    </section>
  );
}
