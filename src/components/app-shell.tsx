import { TextScaleProvider } from "@/components/text-scale";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TextScaleProvider>
      <div className="desk-stage relative min-h-dvh w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(47,91,255,0.16), transparent 60%), linear-gradient(165deg, #D8DEE8 0%, #EEF2F6 45%, #C9D2E0 100%)",
          }}
        />
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#EEF2F6] md:max-w-[720px] md:min-h-[min(100dvh,960px)] md:shadow-[0_24px_70px_rgba(27,36,48,0.22)] md:ring-1 md:ring-[#2F5BFF]/20 lg:max-w-[860px]">
          <div className="grain pointer-events-none fixed inset-0 z-40 mx-auto max-w-[430px] md:absolute md:max-w-none" />
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
        <p className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 font-display text-[10px] tracking-[0.22em] text-[#2F5BFF]/70 uppercase md:block">
          Street Heists · Case file
        </p>
      </div>
    </TextScaleProvider>
  );
}
