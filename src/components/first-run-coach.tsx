"use client";

import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import {
  Clapperboard,
  ClipboardList,
  FolderOpen,
  Gavel,
  MessageSquareWarning,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "street-heists.onboarding-seen";

const STOPS = [
  {
    icon: FolderOpen,
    title: "Briefing → Locker",
    copy: "Read the beats, then open Clues. People, Places, and Binder live as tabs inside the locker.",
  },
  {
    icon: ClipboardList,
    title: "Case file remembers for you",
    copy: "Tap Case file anytime. Every clue takeaway, cork string, and cracked claim auto-files there — you don’t have to hold the case in your head.",
  },
  {
    icon: ClipboardList,
    title: "Quick matches vs Corkboard",
    copy: "Opened clues auto-fill Quick matches. Corkboard (Binder) is where you deliberately string a clue to a suspect.",
  },
  {
    icon: MessageSquareWarning,
    title: "Confront",
    copy: "Press a suspect with one exhibit that breaks their claim. Optional, but it strengthens your file.",
  },
  {
    icon: Clapperboard,
    title: "Scene desk",
    copy: "Scratchpad theory — Who / How / Where draft. It does not lock the case.",
  },
  {
    icon: Gavel,
    title: "Accuse",
    copy: "The real call. Same questions as Scene, but you attach proof. Wrong proof fails.",
  },
] as const;

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
          <h2 className="font-serif text-2xl font-semibold text-ink">The whole case journey</h2>
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
      <p className="mt-3 text-sm leading-snug text-muted">
        Bottom tabs stay visible on every case screen: Locker · Confront · Scene · Accuse.
        Case file keeps the facts for you.
      </p>
      <Button className="mt-3 w-full" onClick={dismiss}>
        I understand
      </Button>
    </section>
  );
}
