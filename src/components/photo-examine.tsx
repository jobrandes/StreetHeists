"use client";

import { EvidenceArt } from "@/components/evidence-art";
import { hotspotKey } from "@/lib/investigation";
import type { Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState, type PointerEvent } from "react";

export function PhotoExamine({
  evidence,
  discoveredHotspotIds,
  onDiscoverHotspot,
  zoom,
  className,
}: {
  evidence: Evidence;
  discoveredHotspotIds: string[];
  onDiscoverHotspot: (hotspotId: string) => void;
  zoom: number;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const hotspots = evidence.hotspots ?? [];
  const canPan = zoom > 1;

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!canPan) return;
      drag.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: pan.x,
        originY: pan.y,
        moved: false,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [canPan, pan.x, pan.y],
  );

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const dx = event.clientX - active.startX;
    const dy = event.clientY - active.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) active.moved = true;
    setPan({ x: active.originX + dx, y: active.originY + dy });
  }, []);

  const onPointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const active = drag.current;
    if (active && active.pointerId === event.pointerId) {
      drag.current = null;
    }
  }, []);

  // Reset pan when zoom returns to 1
  const effectivePan = zoom === 1 ? { x: 0, y: 0 } : pan;

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative h-[min(42dvh,20rem)] touch-none overflow-hidden rounded-lg bg-[#1B2430]",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="h-full w-full origin-center transition-transform duration-150"
        style={{
          transform: `translate(${effectivePan.x}px, ${effectivePan.y}px) scale(${zoom})`,
        }}
      >
        <EvidenceArt evidence={evidence} className="h-full w-full" />
      </div>

      {hotspots.map((hotspot) => {
        const key = hotspotKey(evidence.id, hotspot.id);
        const found = discoveredHotspotIds.includes(key);
        return (
          <button
            key={hotspot.id}
            type="button"
            aria-label={found ? `Found: ${hotspot.label}` : `Examine area: ${hotspot.label}`}
            onClick={(event) => {
              event.stopPropagation();
              if (drag.current?.moved) return;
              onDiscoverHotspot(hotspot.id);
            }}
            className={cn(
              "absolute z-10 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors",
              found
                ? "border-gold bg-gold/90 shadow-[0_0_0_3px_rgba(47,91,255,0.25)]"
                : "border-white/90 bg-white/25 hover:bg-gold/70",
            )}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          />
        );
      })}

      {zoom > 1 ? (
        <p className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-[#1B2430]/80 px-2 py-1 text-[10px] font-semibold text-white">
          Drag to pan · tap markers to examine
        </p>
      ) : hotspots.length > 0 ? (
        <p className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-[#1B2430]/80 px-2 py-1 text-[10px] font-semibold text-white">
          Zoom in, then tap the bright spots
        </p>
      ) : null}
    </div>
  );
}
