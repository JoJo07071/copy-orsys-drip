import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { MYSTERY_BOXES } from "@/data/mock";
import { Gift, Sparkles, Lock } from "lucide-react";

export const Route = createFileRoute("/boxes")({
  component: BoxesPage,
  head: () => ({
    meta: [
      { title: "Mystery Boxes — Échange tes points contre des pièces | DRIP" },
      { name: "description", content: "Sneakers, streetwear et luxe : convertis tes points DRIP en mystery boxes physiques." },
      { property: "og:title", content: "Mystery Boxes DRIP" },
    ],
  }),
});

function BoxesPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-ink text-background">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-accent"><Sparkles className="h-3.5 w-3.5" /> Récompenses physiques</div>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tighter md:text-7xl">Mystery Boxes</h1>
            <p className="mt-5 max-w-md text-lg text-background/80">
              Tes points deviennent du tissu, du cuir, des semelles. Curatées par notre équipe à Paris, livrées partout en Europe.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-3">
            <div className="rounded-md border border-background/15 bg-background/5 p-5">
              <div className="text-xs uppercase tracking-wider text-background/60">Tes points</div>
              <div className="mt-1 font-display text-4xl tabular-nums">3 240</div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/10">
                <div className="h-full w-[40%] bg-accent" />
              </div>
              <div className="mt-2 text-xs text-background/60">Encore 1 260 pts pour la box Sneakers</div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {MYSTERY_BOXES.map((b) => {
            const locked = b.points > 3240;
            return (
              <div key={b.id} className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]">
                <div className="relative flex aspect-square items-center justify-center bg-cream">
                  <Gift className="h-20 w-20 text-foreground/15 transition-transform group-hover:scale-110" />
                  <span className="absolute left-3 top-3 rounded-sm bg-ink px-2 py-1 text-[10px] uppercase tracking-wider text-background">{b.rarity}</span>
                  {locked && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[10px] uppercase tracking-wider"><Lock className="h-3 w-3" /> Verrouillé</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl">{b.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{b.desc}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div className="font-display text-2xl tabular-nums">{b.points.toLocaleString("fr")} <span className="text-sm text-muted-foreground">pts</span></div>
                    <button disabled={locked} className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">
                      {locked ? "Verrouillé" : "Échanger"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
