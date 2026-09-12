export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="desk-stage relative min-h-dvh w-full">
      {/* Intentional desktop treatment: noir plaza wash behind the phone frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,162,39,0.18), transparent 60%), linear-gradient(160deg, #1a1c22 0%, #0c0d10 45%, #16140f 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-40 mix-blend-overlay md:block"
        style={{
          backgroundImage:
            "radial-gradient(rgba(247,241,230,0.05) 0.7px, transparent 0.7px)",
          backgroundSize: "3px 3px",
        }}
      />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#F7F1E6] md:min-h-[min(100dvh,920px)] md:shadow-[0_25px_80px_rgba(0,0,0,0.55)] md:ring-1 md:ring-[#C9A227]/25">
        <div className="grain pointer-events-none fixed inset-0 z-40 mx-auto max-w-[430px] md:absolute" />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
      <p className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 font-display text-[10px] tracking-[0.22em] text-[#C9A227]/70 uppercase md:block">
        Street Heists · Phone stage
      </p>
    </div>
  );
}
