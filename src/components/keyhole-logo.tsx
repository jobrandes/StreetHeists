import { cn } from "@/lib/utils";
export function KeyholeLogo({ className, gold = true }: { className?: string; gold?: boolean }) {
  return <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} aria-hidden="true"><circle cx="32" cy="24" r="12" fill="none" stroke={gold ? "#C9A227" : "currentColor"} strokeWidth="4"/><path d="M27 33.5 L27 50 L37 50 L37 33.5" fill="none" stroke={gold ? "#C9A227" : "currentColor"} strokeWidth="4" strokeLinejoin="round"/></svg>;
}
export function WaxSeal({ label, className }: { label: string; className?: string }) {
  return <div className={cn("relative grid size-20 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d4b03a,#8A6E2F_62%,#5e4a1e)] text-ink shadow-[0_8px_20px_rgba(0,0,0,0.45)]", className)}><div className="absolute inset-1 rounded-full border border-ink/20"/><KeyholeLogo className="size-7" gold={false}/><span className="absolute bottom-2 font-display text-[9px] tracking-[0.18em] uppercase">{label}</span></div>;
}
