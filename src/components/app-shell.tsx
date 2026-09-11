"use client";
import { BottomNav } from "@/components/bottom-nav";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const outdoor = pathname.startsWith("/run");
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-ink shadow-[0_0_80px_rgba(0,0,0,0.65)]">
      <div className="grain pointer-events-none fixed inset-0 z-40 max-w-[430px] mx-auto" />
      <div className={outdoor ? "flex flex-1 flex-col" : "flex flex-1 flex-col pb-2"}>{children}</div>
      <BottomNav />
    </div>
  );
}
