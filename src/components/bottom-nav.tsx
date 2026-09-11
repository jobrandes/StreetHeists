"use client";
import { KeyRound, Plus, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [{ href: "/", label: "Wanted", icon: Trophy }, { href: "/plan", label: "Plan", icon: Plus }];
export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/run")) return null;
  return (
    <nav className="sticky bottom-0 z-30 border-t border-bronze/30 bg-ink/95 px-6 py-3 backdrop-blur">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 font-display text-[11px] tracking-[0.18em] uppercase", pathname === item.href ? "text-gold" : "text-cream/45")}><Icon className="size-5" />{item.label}</Link>;
        })}
        <div className="flex flex-col items-center gap-1 text-cream/25"><KeyRound className="size-5" /><span className="font-display text-[11px] tracking-[0.18em] uppercase">Crew</span></div>
      </div>
    </nav>
  );
}
