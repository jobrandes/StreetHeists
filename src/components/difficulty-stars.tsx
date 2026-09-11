import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
export function DifficultyStars({ value, className, size = "sm" }: { value: number; className?: string; size?: "sm" | "md" | "lg" }) {
  const px = size === "lg" ? "size-5" : size === "md" ? "size-4" : "size-3.5";
  return <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={cn(px, index < value ? "fill-gold text-gold" : "fill-transparent text-bronze/50")} />)}</div>;
}
export function StyleStars({ value, onChange, size = "lg" }: { value: number; onChange?: (value: number) => void; size?: "md" | "lg" }) {
  const px = size === "lg" ? "size-9" : "size-6";
  return <div className="flex items-center gap-1">{Array.from({ length: 5 }, (_, index) => { const star = index + 1; return <button key={star} type="button" onClick={() => onChange?.(star)} className="rounded-full p-0.5" aria-label={`${star} style`}><Star className={cn(px, star <= value ? "fill-gold text-gold" : "text-bronze/60")} /></button>; })}</div>;
}
