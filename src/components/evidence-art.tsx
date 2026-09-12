import type { Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

const VISUAL_SRC: Record<Evidence["visual"], string> = {
  window: "/evidence/ev-window.svg",
  crumbs: "/evidence/ev-crumbs.svg",
  feather: "/evidence/ev-feather.svg",
  fountain: "/evidence/ev-fountain.svg",
  receipt: "/evidence/ev-receipt.svg",
  witness: "/evidence/ev-witness.svg",
};

const VISUAL_LABEL: Record<Evidence["visual"], string> = {
  window: "12:06 · SERVICE WINDOW",
  crumbs: "12:08 · CRUMB TRAIL",
  feather: "TRACE · FEATHER + THREAD",
  fountain: "12:11 · FOUNTAIN LEDGE",
  receipt: "12:04–12:12 · RECEIPT",
  witness: "12:14 · WITNESS NOTES",
};

export function EvidenceArt({
  evidence,
  className,
}: {
  evidence: Evidence;
  className?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden bg-[#1B2430]", className)}
      role="img"
      aria-label={`Photo evidence: ${evidence.title}`}
    >
      <Image
        src={VISUAL_SRC[evidence.visual]}
        alt={evidence.caption}
        fill
        unoptimized
        className="object-cover"
        sizes="(max-width: 430px) 100vw, 430px"
        priority={evidence.visual === "window"}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-8">
        <span className="font-display text-[9px] tracking-[0.16em] text-white">
          {VISUAL_LABEL[evidence.visual]}
        </span>
      </div>
    </div>
  );
}
