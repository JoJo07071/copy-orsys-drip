import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { TrendingUp, Link2, Wallet, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/affiliation")({
  component: AffiliationPage,
  head: () => ({
    meta: [
      { title: "Programme d'affiliation — DRIP" },
      { name: "description", content: "Marques et créateurs : touchez 48 200+ acheteurs mode européens grâce au programme d'affiliation DRIP. Tracking, payouts mensuels, dashboard temps réel." },
      { property: "og:title", content: "Programme d'affiliation — DRIP" },
      { property: "og:url", content: "https://boussbouss.lovable.app/affiliation" },
    ],
    links: [{ rel: "canonical", href: "https://boussbouss.lovable.app/affiliation" }],
  }),
});

const PERKS = [
  { icon: Link2, title: "Liens trackés", desc: "Chaque deal posté génère un lien d'affiliation tracké automatiquement." },
  { icon: BarChart3, title: "Dashboard temps réel", desc: "Clics, conversions, revenus — tout est consultable en direct." },
  { icon: Wallet, title: "Payouts mensuels", desc: "Virement le 5 de chaque mois dès 50€ de commissions cumulées." },
  { icon: TrendingUp, title: "Boost communautaire", desc: "Les deals affiliés performants sont mis en avant en page d'accueil." },
];

function AffiliationPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 md:grid-cols-2 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" /> Partenariats
            </div>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tighter md:text-6xl">
              Vendez plus, sans budget pub.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Marques mode, e-shops, créateurs indépendants : intégrez le réseau d'affiliation DRIP et touchez une audience qualifiée, prête à acheter.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/contact" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Devenir partenaire</Link>
              <a href="#perks" className="rounded-full border border-border px-6 py-3 text-sm font-medium">En savoir plus</a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: "8%", l: "commission moyenne" },
              { v: "3.2%", l: "taux conversion" },
              { v: "48k+", l: "membres actifs" },
              { v: "12", l: "pays" },
              { v: "9.8k", l: "deals/mois" },
              { v: "4.7€", l: "panier moyen x" },
            ].map((s) => (
              <div key={s.l} className="rounded-md border border-border bg-card p-5">
                <div className="font-display text-3xl tracking-tighter">{s.v}</div>
                <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="perks" className="mx-auto max-w-[1400px] px-4 py-20">
        <h2 className="font-display text-4xl tracking-tighter">Comment ça marche</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p) => (
            <div key={p.title} className="rounded-md border border-border bg-card p-6">
              <p.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-4 font-display text-xl">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-20">
        <div className="rounded-md border border-border bg-cream p-10 md:p-14">
          <h3 className="font-display text-3xl tracking-tighter">Prêt à rejoindre le réseau ?</h3>
          <p className="mt-3 max-w-xl text-muted-foreground">Notre équipe vous répond sous 48h ouvrées avec une proposition sur mesure.</p>
          <Link to="/contact" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Contacter l'équipe</Link>
        </div>
      </section>
    </SiteLayout>
  );
}