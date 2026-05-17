import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { DealCard } from "@/components/site/deal-card";
import { listDeals } from "@/lib/deals.functions";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Flame, Clock, TrendingUp, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/deals")({
  component: DealsPage,
  head: () => ({
    meta: [
      { title: "Tous les deals mode — DRIP" },
      { name: "description", content: "Explorez les meilleurs bons plans mode triés par chaleur, fraîcheur ou tendance." },
    ],
  }),
});

const SORTS = [
  { id: "hot", label: "Hot", icon: Flame },
  { id: "fresh", label: "Frais", icon: Clock },
  { id: "trending", label: "Tendance", icon: TrendingUp },
] as const;

function DealsPage() {
  const [sort, setSort] = useState<"hot" | "fresh" | "trending">("hot");
  const fn = useServerFn(listDeals);
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["deals", sort],
    queryFn: () => fn({ data: { sort } }),
  });

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-[1400px] px-4 py-12 md:py-16">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Tous les deals</div>
          <h1 className="mt-2 font-display text-5xl font-medium tracking-tighter md:text-6xl">Le feed mode en temps réel</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{deals.length} deals actifs</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
          <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
            {SORTS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${sort === s.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <Icon className="h-4 w-4" /> {s.label}
                </button>
              );
            })}
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-foreground">
            <Filter className="h-4 w-4" /> Filtres
          </button>
        </div>
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Chargement…</div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deals.map((d) => <DealCard key={d.id} deal={d} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
