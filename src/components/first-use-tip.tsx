"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const PREFIX = "street-heists.tip.";

/** One-line first-use explainer; dismisses permanently per tipId. */
export function FirstUseTip({
  tipId,
  text,
  className,
}: {
  tipId: string;
  text: string;
  className?: string;
}) {
  const key = `${PREFIX}${tipId}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore tip preference after hydration
    setVisible(window.localStorage.getItem(key) !== "1");
  }, [key]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-[#2F5BFF]/30 bg-[#DCE6FF]/80 px-3 py-2 text-sm leading-snug text-ink",
        className,
      )}
    >
      <p className="min-w-0 flex-1">{text}</p>
      <button
        type="button"
        className="min-h-10 shrink-0 px-1 font-display text-xs font-bold tracking-[0.12em] text-[#2F5BFF] uppercase"
        onClick={() => {
          window.localStorage.setItem(key, "1");
          setVisible(false);
        }}
      >
        Got it
      </button>
    </div>
  );
}
