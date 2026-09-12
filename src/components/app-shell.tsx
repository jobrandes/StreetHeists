export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#F7F1E6] shadow-[0_0_80px_rgba(0,0,0,0.35)]">
      <div className="grain pointer-events-none fixed inset-0 z-40 max-w-[430px] mx-auto" />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
