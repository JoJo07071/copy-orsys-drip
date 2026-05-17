import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { Sparkles, Heart, Globe2, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Notre histoire — DRIP" },
      { name: "description", content: "DRIP est née à Paris d'une obsession : démocratiser la mode en rendant les meilleurs deals visibles, votés et partagés par une vraie communauté." },
      { property: "og:title", content: "Notre histoire — DRIP" },
      { property: "og:description", content: "La communauté européenne des chasseurs de bons plans mode." },
      { property: "og:url", content: "https://boussbouss.lovable.app/about" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://boussbouss.lovable.app/about" }],
  }),
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-ink text-background">
        <div className="mx-auto max-w-[1400px] px-4 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Notre histoire
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tighter md:text-7xl">
            La mode ne devrait jamais coûter le prix fort.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-background/80">
            DRIP est né à Paris en 2026 d'un constat simple : les meilleurs deals mode existent partout sur le web, mais personne ne les centralise. Nous avons construit la plateforme que nous aurions voulu utiliser — communautaire, transparente et obsédée par le style.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Mission</div>
            <h2 className="mt-3 font-display text-4xl tracking-tighter">Rendre le bon goût accessible</h2>
            <p className="mt-5 text-muted-foreground">
              Sneakers rares, pièces archives, drops streetwear, soldes luxe : chaque deal posté sur DRIP est validé par la communauté avant d'être mis en avant. Pas de placement payant déguisé, pas de faux prix barrés.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Vision</div>
            <h2 className="mt-3 font-display text-4xl tracking-tighter">Le Dealabs européen de la mode</h2>
            <p className="mt-5 text-muted-foreground">
              Nous bâtissons la première communauté pan-européenne dédiée aux bons plans mode. France, Allemagne, Italie, Espagne, UK — un seul feed, une seule monnaie de confiance : le vote.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            { icon: Users, label: "Membres actifs", value: "48 200" },
            { icon: Globe2, label: "Pays couverts", value: "12" },
            { icon: Heart, label: "Deals validés / mois", value: "9 800" },
          ].map((s) => (
            <div key={s.label} className="rounded-md border border-border bg-card p-6">
              <s.icon className="h-5 w-5 text-accent" />
              <div className="mt-4 font-display text-4xl tabular-nums tracking-tighter">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-md border border-border bg-cream p-10 md:p-14">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Rejoindre l'aventure</div>
          <h3 className="mt-3 font-display text-3xl tracking-tighter md:text-4xl">Tu chasses ? On t'attend.</h3>
          <p className="mt-4 max-w-xl text-muted-foreground">Poste ton premier deal, vote, monte dans le leaderboard, débloque des mystery boxes.</p>
          <Link to="/post" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Poster un deal</Link>
        </div>
      </section>
    </SiteLayout>
  );
}