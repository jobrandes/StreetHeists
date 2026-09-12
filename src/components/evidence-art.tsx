import type { Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EvidenceArt({
  evidence,
  className,
}: {
  evidence: Evidence;
  className?: string;
}) {
  const labels: Record<Evidence["visual"], string> = {
    window: "12:06 · OPEN WINDOW",
    crumbs: "12:08 · CRUMB TRAIL",
    feather: "TRACE 03 · FEATHER + THREAD",
    fountain: "12:11 · NORTH STATUE",
    receipt: "12:04–12:12 · VERIFIED",
    witness: "FLAP → BREAD → FOUNTAIN",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#24282d] text-[#F2F0EA]",
        className,
      )}
      role="img"
      aria-label={`Illustration for ${evidence.title}`}
    >
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(120deg,transparent_48%,#C9A227_49%,transparent_50%),repeating-linear-gradient(0deg,transparent,transparent_10px,#fff_11px)]" />
      {evidence.visual === "window" ? (
        <div className="absolute left-[18%] top-[20%] h-[45%] w-[64%] border-4 border-[#C9A227] bg-[#0B0B0C]">
          <div className="absolute bottom-[18%] left-[15%] h-3 w-[70%] -rotate-6 rounded-full bg-[#d8b56e]" />
        </div>
      ) : null}
      {evidence.visual === "crumbs" ? (
        <div className="absolute inset-0 [background-image:radial-gradient(circle,#d8b56e_0_3px,transparent_4px)] [background-position:20px_70px] [background-size:38px_24px] rotate-[-12deg]" />
      ) : null}
      {evidence.visual === "feather" ? (
        <div className="absolute left-1/2 top-1/2 h-20 w-8 -translate-x-1/2 -translate-y-1/2 rotate-[28deg] rounded-[100%_0] bg-[#aeb8c4] after:absolute after:left-1/2 after:top-0 after:h-24 after:w-px after:bg-[#C9A227]" />
      ) : null}
      {evidence.visual === "fountain" ? (
        <>
          <div className="absolute bottom-7 left-1/2 h-24 w-12 -translate-x-1/2 bg-[#77746b] [clip-path:polygon(30%_0,70%_0,85%_75%,100%_100%,0_100%,15%_75%)]" />
          <div className="absolute left-[53%] top-[23%] h-5 w-16 rotate-12 rounded-full bg-[#d8b56e]" />
        </>
      ) : null}
      {evidence.visual === "receipt" ? (
        <div className="absolute left-1/2 top-1/2 h-[75%] w-[55%] -translate-x-1/2 -translate-y-1/2 rotate-2 bg-[#F2F0EA] p-3 text-[8px] leading-3 text-[#161618] shadow-xl">
          PHARMACIE DU PLAZA<br />12:04:18<br />THERMOMETER × 3<br />PAID 12:12:02
        </div>
      ) : null}
      {evidence.visual === "witness" ? (
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-y border-[#C9A227] py-5 text-center font-serif text-lg italic">
          “small bow, hard flap”
        </div>
      ) : null}
      <span className="absolute bottom-2 left-2 bg-[#0B0B0C]/85 px-2 py-1 font-display text-[9px] tracking-[0.16em] text-[#C9A227]">
        {labels[evidence.visual]}
      </span>
    </div>
  );
}
