import type { Evidence } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function EvidenceArt({
  evidence,
  className,
  priority = false,
}: {
  evidence: Evidence;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn("relative overflow-hidden bg-[#1B2430]", className)}
      role="img"
      aria-label={`Case-file image: ${evidence.title}. Look for: ${evidence.visualTell}`}
    >
      <Image
        src={evidence.imageSrc}
        alt={`${evidence.title}. ${evidence.visualTell}`}
        fill
        unoptimized
        className="object-cover"
        sizes="(max-width: 430px) 100vw, (max-width: 860px) 720px, 860px"
        priority={priority}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8">
        <span className="font-display text-[9px] tracking-[0.14em] text-white">
          {evidence.imageStamp}
        </span>
      </div>
    </div>
  );
}
