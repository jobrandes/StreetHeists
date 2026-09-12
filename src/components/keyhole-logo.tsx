import { cn } from "@/lib/utils";

export function KeyholeLogo({
  className,
  gold = true,
}: {
  className?: string;
  gold?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M32 4a22 22 0 0 0-7.4 42.7L26 60h12l1.4-13.3A22 22 0 0 0 32 4Zm0 13a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z"
        fill={gold ? "#C9A227" : "currentColor"}
        fillRule="evenodd"
      />
    </svg>
  );
}

export function WaxSeal({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid size-20 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d4b03a,#8A6E2F_62%,#5e4a1e)] text-ink shadow-[0_8px_20px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <div className="absolute inset-1 rounded-full border border-ink/20" />
      <KeyholeLogo className="size-7" gold={false} />
      <span className="absolute bottom-2 font-display text-[9px] tracking-[0.18em] uppercase">
        {label}
      </span>
    </div>
  );
}
