import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { DealCard } from "@/components/site/deal-card";
import { DEALS, CATEGORIES, BRANDS, TOP_CONTRIBUTORS } from "@/data/mock";
import hero from "@/assets/hero-fashion.jpg";
import { ArrowRight, Flame, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DRIP — Bons plans mode premium en temps réel" },
      { name: "description", content: "La communauté des chasseurs de deals mode. Sneakers, streetwear, luxe, outlet : votés et validés en temps réel." },
      { property: "og:title", content: "DRIP — Le Dealabs de la mode" },
      { property: "og:description", content: "Découvre les bons plans mode votés par la communauté." },
    ],
  }),
});

function Index() {
  const hot = [...DEALS].sort((a, b) => b.heat - a.heat);
  const trending = hot.slice(0, 4);
  const fresh = DEALS.slice(0, 8);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-16 pt-10 md:grid-cols-12 md:gap-12 md:pb-24 md:pt-16">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> 2 412 deals actifs · live
            </div>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[0.95] tracking-tighter text-balance md:text-7xl lg:text-[88px]">
              Les bons plans mode,<br />
              <span className="italic text-accent">curatés</span> par la communauté.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
              Sneakers, streetwear, luxe, outlet — chaque deal est posté, voté et validé par des chasseurs passionnés. Pas d'algorithme opaque, juste de la chaleur réelle.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/deals" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:gap-3 hover:bg-ink">
                Explorer les hot deals <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/post" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-medium hover:border-foreground">
                Poster mon deal
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              <div><div className="font-display text-2xl font-semibold">128k</div><div className="text-xs text-muted-foreground">Membres</div></div>
              <div><div className="font-display text-2xl font-semibold">2.4k</div><div className="text-xs text-muted-foreground">Deals/jour</div></div>
              <div><div className="font-display text-2xl font-semibold">4.6M€</div><div className="text-xs text-muted-foreground">Économisés</div></div>
            </div>
          </div>
          <div className="relative md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
              <img src={hero} alt="Look mode premium" className="h-full w-full object-cover" width={1600} height={1280} />
              <div className="absolute bottom-4 left-4 right-4 rounded-md border border-border bg-background/95 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span>Look du jour</span>
                  <span className="inline-flex items-center gap-1 text-hot"><Flame className="h-3 w-3" /> 847°</span>
                </div>
                <div className="mt-1 font-display text-lg">Manteau laine sable — Arket</div>
                <div className="mt-1 flex items-baseline gap-2"><span className="font-semibold">189€</span><span className="text-sm text-muted-foreground line-through">329€</span><span className="ml-auto text-xs text-accent">-43%</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee marques */}
        <div className="overflow-hidden border-t border-border bg-background py-3">
          <div className="marquee flex w-max gap-12 whitespace-nowrap text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="inline-flex items-center gap-12">{b} <span className="text-accent">·</span></span>
            ))}
          </div>
        </div>
      </section>

      {/* HOT DEALS */}
      <section className="mx-auto max-w-[1400px] px-4 pt-20">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent">
              <Flame className="h-3.5 w-3.5" /> Brûlant maintenant
            </div>
            <h2 className="mt-2 font-display text-4xl font-medium tracking-tight md:text-5xl">Les deals les plus chauds</h2>
          </div>
          <Link to="/deals" className="hidden items-center gap-2 text-sm font-medium hover:text-accent md:inline-flex">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((d) => <DealCard key={d.id} deal={d} />)}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1400px] px-4 pt-24">
        <h2 className="font-display text-3xl font-medium md:text-4xl">Explorer par univers</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/c/$cat"
              params={{ cat: c.slug }}
              className="group flex aspect-square flex-col justify-between rounded-md border border-border bg-cream p-4 transition-all hover:border-foreground hover:bg-card"
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.count}</span>
              <span className="font-display text-xl leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FRESH + LEADERBOARD */}
      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 pt-24 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-end justify-between border-b border-border pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"><Sparkles className="h-3.5 w-3.5" /> Fraîchement posté</div>
              <h2 className="mt-2 font-display text-3xl font-medium md:text-4xl">Dernières trouvailles</h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {fresh.slice(0, 4).map((d) => <DealCard key={d.id} deal={d} />)}
          </div>
        </div>
        <aside>
          <div className="sticky top-28 rounded-md border border-border bg-cream p-6">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"><Trophy className="h-3.5 w-3.5" /> Leaderboard</div>
            <h3 className="mt-2 font-display text-2xl">Top contributeurs</h3>
            <ol className="mt-6 space-y-4">
              {TOP_CONTRIBUTORS.map((u, i) => (
                <li key={u.handle} className="flex items-center gap-3">
                  <span className="w-6 font-display text-xl tabular-nums text-muted-foreground">{i + 1}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-background">{u.name[0]}</div>
                  <div className="flex-1">
                    <div className="font-medium">@{u.handle}</div>
                    <div className="text-xs text-muted-foreground">{u.level} · {u.deals} deals</div>
                  </div>
                  <div className="font-display tabular-nums text-accent">{u.points.toLocaleString("fr")}</div>
                </li>
              ))}
            </ol>
            <Link to="/leaderboard" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium hover:border-foreground">
              Voir tout le classement <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-[1400px] px-4">
        <div className="overflow-hidden rounded-md bg-ink px-6 py-16 text-background md:px-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-accent">Mystery Boxes</div>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] md:text-6xl">
                Tes points<br />deviennent<br /><span className="italic">des pièces.</span>
              </h2>
            </div>
            <div>
              <p className="text-lg text-background/80">
                Chaque deal posté, voté ou commenté te rapporte des points. Échange-les contre des mystery boxes physiques : sneakers, streetwear, luxe.
              </p>
              <Link to="/boxes" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-foreground hover:gap-3">
                Voir les boxes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
