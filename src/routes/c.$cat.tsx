import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { DealCard } from "@/components/site/deal-card";
import { DEALS, CATEGORIES } from "@/data/mock";

export const Route = createFileRoute("/c/$cat")({
  component: CategoryPage,
  head: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.cat);
    const name = cat?.name ?? params.cat;
    return {
      meta: [
        { title: `${name} — Bons plans mode | DRIP` },
        { name: "description", content: `Les meilleurs deals ${name.toLowerCase()} votés par la communauté DRIP.` },
        { property: "og:title", content: `${name} — DRIP` },
        { property: "og:description", content: `Bons plans ${name.toLowerCase()} en temps réel.` },
      ],
    };
  },
});

function CategoryPage() {
  const { cat } = Route.useParams();
  const meta = CATEGORIES.find((c) => c.slug === cat);
  const filtered = DEALS.filter(
    (d) => d.category === cat || d.gender === cat || d.tags.includes(cat)
  );
  const list = filtered.length ? filtered : DEALS;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-[1400px] px-4 py-12 md:py-20">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Accueil</Link> / Catégorie
          </div>
          <h1 className="mt-3 font-display text-6xl font-medium tracking-tighter md:text-8xl">
            {meta?.name ?? cat}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            {list.length} deals actifs dans cette catégorie. Triés par chaleur, validés par la communauté.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((d) => <DealCard key={d.id} deal={d} />)}
        </div>
      </section>
    </SiteLayout>
  );
}
