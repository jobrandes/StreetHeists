import type { HeistArt } from "@/lib/types";
import { cn } from "@/lib/utils";
export function NoirArt({ art, className }: { art: HeistArt; className?: string }) {
  const marks: Record<HeistArt, React.ReactNode> = {
    pigeon: <><path d="M40 168 H280"/><path d="M70 168 V90 H250 V168"/><circle cx="160" cy="78" r="22"/><path d="M148 70 C160 58 178 66 176 80"/><path d="M176 78 L196 72"/><path d="M128 168 C128 130 192 130 192 168"/><circle cx="154" cy="74" r="1.6" fill="#C9A227"/></>,
    gelato: <><path d="M160 40 C120 40 108 88 128 112 H192 C212 88 200 40 160 40Z"/><path d="M128 112 L160 180 L192 112"/></>,
    library: <><path d="M48 168 V56 L160 32 L272 56 V168"/><path d="M80 168 V80 H120 V168"/><path d="M200 168 V80 H240 V168"/><path d="M132 168 V96 H188 V168"/></>,
    fountain: <><path d="M80 168 H240"/><ellipse cx="160" cy="132" rx="70" ry="16"/><path d="M160 132 V78"/><circle cx="160" cy="74" r="8"/></>,
    laundry: <><path d="M40 64 H280"/><path d="M70 64 L90 150 H150 L130 64"/><path d="M170 64 L190 160 H250 L230 64"/></>,
    opera: <><path d="M40 168 H280"/><path d="M60 168 V100 Q160 40 260 100 V168"/><path d="M96 168 V120 Q160 88 224 120 V168"/></>,
    custom: <><circle cx="160" cy="92" r="28"/><path d="M148 116 V150 H172 V116"/><path d="M70 168 H250"/></>,
  };
  return <div className={cn("relative overflow-hidden bg-[#0E0E10]", className)}><svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true"><defs><linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1a1c"/><stop offset="100%" stopColor="#0B0B0C"/></linearGradient></defs><rect width="320" height="200" fill="url(#fog)"/><g stroke="#C9A227" strokeWidth="1.4" fill="none" opacity="0.9">{marks[art]}</g></svg><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent"/></div>;
}
