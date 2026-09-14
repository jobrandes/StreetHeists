import { TextScaleProvider } from "@/components/text-scale";

/**
 * Phone: 430px column.
 * Tablet+: full-bleed from 600px — iPad Mini portrait (~744) sits under Tailwind `md` (768),
 * so the old md: widen never fired and iPad still looked like a phone.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TextScaleProvider>
      <div className="desk-stage relative min-h-dvh w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden min-[600px]:block"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(47,91,255,0.12), transparent 60%), linear-gradient(165deg, #D8DEE8 0%, #EEF2F6 45%, #C9D2E0 100%)",
          }}
        />
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#EEF2F6] min-[600px]:max-w-none min-[600px]:bg-[#EEF2F6]/95">
          <div className="grain pointer-events-none fixed inset-0 z-40 mx-auto max-w-[430px] min-[600px]:absolute min-[600px]:max-w-none" />
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
        <p className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 font-display text-[10px] tracking-[0.22em] text-[#2F5BFF]/70 uppercase min-[900px]:block">
          Street Heists · Case file
        </p>
      </div>
    </TextScaleProvider>
  );
}
