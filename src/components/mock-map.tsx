"use client";
import type { Beat } from "@/lib/types";
import { cn } from "@/lib/utils";

type MapProps = { beats: Beat[]; currentId?: string; completedIds?: string[]; onMapClick?: (x: number, y: number) => void; onPinClick?: (beatId: string) => void; expanded?: boolean; className?: string };
export function MockMap({ beats, currentId, completedIds = [], onMapClick, onPinClick, expanded, className }: MapProps) {
  return <div data-testid="plaza-map" className={cn("relative overflow-hidden rounded-xl border border-bronze/40 bg-[#101214]", expanded ? "h-64" : "h-20", className)}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" onClick={(event) => { if (!onMapClick) return; const rect = event.currentTarget.getBoundingClientRect(); onMapClick(((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100); }}>
      <rect width="100" height="100" fill="#121416"/><path d="M0 28 H100" stroke="#2a2c2e" strokeWidth="6"/><path d="M0 62 H100" stroke="#2a2c2e" strokeWidth="5"/><path d="M22 0 V100" stroke="#26282a" strokeWidth="7"/><path d="M68 0 V100" stroke="#26282a" strokeWidth="6"/><circle cx="50" cy="36" r="10" fill="#1a1c1e" stroke="#8A6E2F" strokeWidth="0.6"/><rect x="24" y="52" width="14" height="7" rx="1" fill="#1b1d1f" stroke="#8A6E2F" strokeWidth="0.4"/>
      {beats.length > 1 && <polyline fill="none" stroke="#C9A227" strokeWidth="0.8" strokeDasharray="1.6 1.4" points={beats.map((beat) => `${beat.x},${beat.y}`).join(" ")} />}
      {beats.map((beat, index) => { const done = completedIds.includes(beat.id); const current = beat.id === currentId; return <g key={beat.id} onClick={(event) => { event.stopPropagation(); onPinClick?.(beat.id); }}><circle cx={beat.x} cy={beat.y} r={current ? 3.4 : 2.6} fill={done ? "#C9A227" : current ? "#F2F0EA" : "#0B0B0C"} stroke={current ? "#C9A227" : "#8A6E2F"} strokeWidth="0.7"/><text x={beat.x} y={beat.y + 0.8} textAnchor="middle" fontSize="3.2" fill={done || current ? "#0B0B0C" : "#F2F0EA"}>{index + 1}</text></g>; })}
    </svg>
    {!expanded && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-card via-card/40 to-transparent px-3"><span className="font-display text-[11px] tracking-[0.18em] text-gold uppercase">Map</span></div>}
  </div>;
}
