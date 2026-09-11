import type { FailAward } from "@/lib/types";
import { cn } from "@/lib/utils";
export function FailAwardPill({ award, className }: { award: FailAward; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 font-display text-[11px] tracking-[0.16em] uppercase", award === "Legendary Fail" ? "border-fail text-fail" : "border-fail/70 text-fail", className)}>{award}</span>;
}
