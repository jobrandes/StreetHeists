"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const KEY = "street-heists.text-scale";

export type TextScale = "comfortable" | "large";

/** Bumps whole UI type for phone readability (default: large for easier eyes). */
export function TextScaleProvider({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState<TextScale>("large");

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY) as TextScale | null;
    const next = saved === "comfortable" || saved === "large" ? saved : "large";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate preference
    setScale(next);
    document.documentElement.dataset.textScale = next;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.textScale = scale;
    window.localStorage.setItem(KEY, scale);
  }, [scale]);

  return (
    <TextScaleContext.Provider value={{ scale, setScale }}>
      {children}
    </TextScaleContext.Provider>
  );
}

import { createContext, useContext } from "react";

const TextScaleContext = createContext<{
  scale: TextScale;
  setScale: (scale: TextScale) => void;
} | null>(null);

export function useTextScale() {
  const ctx = useContext(TextScaleContext);
  if (!ctx) {
    return {
      scale: "large" as TextScale,
      setScale: (_scale: TextScale) => undefined,
    };
  }
  return ctx;
}

export function TextScaleToggle({ className }: { className?: string }) {
  const { scale, setScale } = useTextScale();
  const next = scale === "large" ? "comfortable" : "large";
  return (
    <button
      type="button"
      className={cn(
        "min-h-11 rounded-lg border border-hairline bg-white px-3 py-2 font-display text-xs font-bold tracking-[0.12em] text-ink uppercase",
        className,
      )}
      onClick={() => setScale(next)}
      aria-label={
        scale === "large" ? "Switch to comfortable text size" : "Switch to large text size"
      }
    >
      Text · {scale === "large" ? "Large" : "Comfortable"}
    </button>
  );
}
