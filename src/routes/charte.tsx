import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { ShieldCheck, Check, X } from "lucide-react";

export const Route = createFileRoute("/charte")({
  component: ChartePage,
  head: () => ({
    meta: [
      { title: "Charte des deals — DRIP" },
      { name: "description", content: "Les règles de la communauté DRIP : qualité des deals, transparence des liens d'affiliation, modération et bonnes pratiques." },
      { property: "og:title", content: "Charte des deals — DRIP" },
      { property: "og:url", content: "https://boussbouss.lovable.app/charte" },
    ],
    links: [{ rel: "canonical", href: "https://boussbouss.lovable.app/charte" }],
  }),
});

const RULES_OK = [
  "Le deal doit concerner un produit mode (vêtement, sneakers, accessoire, beauté).",
  "Le prix doit être réellement inférieur au prix de marché constaté.",
  "Indique clairement le code promo, les conditions et la date d'expiration si applicable.",
  "Ajoute une photo nette du produit, idéalement issue du site marchand officiel.",
  "Mentionne les frais de port et la disponibilité des tailles si pertinent.",
];

const RULES_KO = [
  "Pas de liens d'affiliation cachés. Les liens affiliés DRIP sont automatiquement signalés.",
  "Pas de faux prix barrés ni de promotions permanentes vendues comme exceptionnelles.",
  "Pas de contrefaçons, ni de plateformes de revente non vérifiées.",
  "Pas de spam : un même deal ne peut être posté qu'une seule fois.",
  "Pas de propos haineux, sexistes ou discriminatoires dans les commentaires.",
];

function ChartePage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-[1400px] px-4 py-20 md:py-24">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Charte communautaire
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tighter md:text-6xl">
            Les règles qui font tenir la communauté
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            DRIP fonctionne grâce à la confiance entre membres. Cette charte définit ce qui est attendu de chaque deal posté et de chaque interaction sur la plateforme.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 py-20 md:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-8">
          <h2 className="font-display text-2xl tracking-tighter">Ce qu'un bon deal contient</h2>
          <ul className="mt-6 space-y-4 text-sm">
            {RULES_OK.map((r) => (
              <li key={r} className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-border bg-card p-8">
          <h2 className="font-display text-2xl tracking-tighter">Ce qui est interdit</h2>
          <ul className="mt-6 space-y-4 text-sm">
            {RULES_KO.map((r) => (
              <li key={r} className="flex gap-3">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-20">
        <div className="rounded-md border border-border bg-ink p-10 text-background md:p-14">
          <h3 className="font-display text-3xl tracking-tighter">Modération</h3>
          <p className="mt-4 max-w-2xl text-background/80">
            Notre équipe et les membres de confiance (niveau Gold et +) vérifient les deals signalés. Tout contenu enfreignant la charte est dépublié sous 24h. Trois infractions entraînent la suspension du compte.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}