"use client";
import { FeaturedHeistCard, HeistRow } from "@/components/heist-card";
import { KeyholeLogo } from "@/components/keyhole-logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useHeists } from "@/lib/store";
import type { HomeFilter } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";

const filters: { id: HomeFilter; label: string }[] = [{ id: "near", label: "Near me" }, { id: "trending", label: "Trending" }, { id: "fails", label: "Comedy-fail awards" }];
export default function HomePage() {
  const { heists, alias, setAlias, activeRun, resetTable } = useHeists();
  const [filter, setFilter] = useState<HomeFilter>("near");
  const [nextAlias, setNextAlias] = useState(alias);
  const featured = heists.find((heist) => heist.featured) ?? heists[0];
  const list = useMemo(() => heists.filter((heist) => heist.id !== featured?.id && (filter === "near" ? heist.nearMe : filter === "trending" ? heist.trending : Boolean(heist.comedyFailAward))), [featured?.id, filter, heists]);
  return <main className="flex flex-1 flex-col px-4 pb-6 pt-6">
    <header className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2"><KeyholeLogo className="size-8"/><div><p className="font-display text-xl tracking-[0.22em] text-gold uppercase">Street Heists</p><p className="text-[11px] text-cream/45">Midnight Crew</p></div></div><Dialog><DialogTrigger asChild><button type="button" className="rounded-full border border-bronze/50 px-3 py-1.5 text-xs text-cream/80">{alias}</button></DialogTrigger><DialogContent title="Crew alias"><p className="mb-3 text-sm text-cream/65">The name on the poster. Keep it fictional.</p><Input value={nextAlias} onChange={(e) => setNextAlias(e.target.value)} maxLength={28}/><Button className="mt-4 w-full" onClick={() => setAlias(nextAlias)}>Save alias</Button></DialogContent></Dialog></header>
    <p className="mb-4 rounded-full border border-bronze/30 px-3 py-2 text-center text-[11px] tracking-wide text-cream/55">Pure make-believe. Zero real crime.</p>
    {activeRun ? <Link href={`/run/${activeRun.heistId}`} className="mb-4 flex items-center justify-between rounded-2xl border border-gold/50 bg-gold/10 px-4 py-3"><div><p className="font-display text-[11px] tracking-[0.18em] text-gold uppercase">Job in progress</p><p className="text-sm text-cream">Resume before the pigeons notice.</p></div><span className="font-display text-sm tracking-widest text-gold uppercase">Run</span></Link> : null}
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">{filters.map((item) => <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={cn("shrink-0 rounded-full border px-3 py-1.5 font-display text-[11px] tracking-[0.14em] uppercase", filter === item.id ? "border-gold bg-gold text-ink" : "border-bronze/50 text-cream/70")}>{item.label}</button>)}</div>
    {featured ? <FeaturedHeistCard heist={featured}/> : null}
    <section className="mt-6"><div className="mb-3 flex items-end justify-between"><h2 className="font-display tracking-[0.2em] text-gold uppercase">Most Wanted</h2><span className="text-[11px] text-cream/40">{list.length} jobs</span></div>{list.length ? <div className="space-y-3">{list.map((heist) => <HeistRow key={heist.id} heist={heist}/>)}</div> : <div className="rounded-2xl border border-bronze/30 bg-card px-4 py-8 text-center text-sm text-cream/55">No jobs on this board yet. Plan one, or flip the filter.</div>}</section>
    <button type="button" onClick={resetTable} className="mt-8 text-center text-[11px] text-cream/30">Reset the table</button>
  </main>;
}
