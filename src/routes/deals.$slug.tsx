import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { DealCard } from "@/components/site/deal-card";
import { DEALS, COMMENTS } from "@/data/mock";
import { ArrowBigUp, ArrowBigDown, Flame, Clock, Tag, Share2, Heart, Bell, MessageCircle, ExternalLink, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/deals/$slug")({
  component: DealDetail,
  loader: ({ params }) => {
    const deal = DEALS.find((d) => d.slug === params.slug);
    if (!deal) throw notFound();
    return { deal };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Deal — DRIP" }] };
    const d = loaderData.deal;
    return {
      meta: [
        { title: `${d.title} — ${d.priceDeal}€ | DRIP` },
        { name: "description", content: `${d.brand} chez ${d.merchant}. ${d.priceDeal}€ au lieu de ${d.priceOriginal}€. Voté ${d.upvotes} fois par la communauté.` },
        { property: "og:title", content: `${d.title} — ${d.priceDeal}€` },
        { property: "og:description", content: `${d.brand} · ${d.priceDeal}€ au lieu de ${d.priceOriginal}€` },
        { property: "og:image", content: d.image },
        { property: "twitter:image", content: d.image },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="font-display text-5xl">Deal introuvable</h1>
        <Link to="/deals" className="mt-6 inline-block underline">Retour aux deals</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="font-display text-3xl">Erreur</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
    </SiteLayout>
  ),
});

function DealDetail() {
  const { deal } = Route.useLoaderData();
  const discount = Math.round((1 - deal.priceDeal / deal.priceOriginal) * 100);
  const related = DEALS.filter((d) => d.id !== deal.id).slice(0, 4);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-4 pt-8">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Accueil</Link> ·{" "}
          <Link to="/deals" className="hover:text-foreground">Deals</Link> · {deal.brand}
        </div>
      </div>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 py-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-md border border-border bg-cream">
            <img src={deal.image} alt={deal.title} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-ink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-background">-{discount}%</span>
            <span className="inline-flex items-center gap-1 rounded-full hot-gradient px-3 py-1 text-[11px] font-semibold text-hot-foreground"><Flame className="h-3 w-3" />{deal.heat}° HOT</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{deal.brand} · {deal.merchant}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-medium leading-tight md:text-5xl">{deal.title}</h1>

          <div className="mt-6 flex items-baseline gap-3">
            <div className="font-display text-5xl font-semibold tabular-nums">{deal.priceDeal}€</div>
            <div className="text-xl text-muted-foreground line-through tabular-nums">{deal.priceOriginal}€</div>
            <div className="ml-auto text-sm text-accent">Tu économises {deal.priceOriginal - deal.priceDeal}€</div>
          </div>

          {deal.code && (
            <div className="mt-5 flex items-center gap-3 rounded-md border border-dashed border-accent bg-accent/5 px-4 py-3">
              <Tag className="h-4 w-4 text-accent" />
              <div className="text-sm">Code promo</div>
              <code className="ml-auto rounded bg-background px-3 py-1 font-mono text-sm font-semibold tracking-wider">{deal.code}</code>
            </div>
          )}

          <a href={deal.url} target="_blank" rel="noopener noreferrer sponsored" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground transition-all hover:bg-ink">
            Voir l'offre chez {deal.merchant} <ExternalLink className="h-4 w-4" />
          </a>

          <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Lien vérifié · affilié</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Expire dans {deal.expiresIn}</span>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm hover:border-foreground"><Heart className="h-4 w-4" /> Wishlist</button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm hover:border-foreground"><Bell className="h-4 w-4" /> Alerte prix</button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm hover:border-foreground"><Share2 className="h-4 w-4" /></button>
          </div>

          {/* Vote box */}
          <div className="mt-8 flex items-center gap-4 rounded-md border border-border bg-cream p-4">
            <div className="flex items-center gap-1">
              <button className="rounded-full bg-background p-2 hover:bg-card"><ArrowBigUp className="h-5 w-5" /></button>
              <span className="font-display text-2xl tabular-nums">{deal.upvotes - deal.downvotes}</span>
              <button className="rounded-full bg-background p-2 hover:bg-card"><ArrowBigDown className="h-5 w-5" /></button>
            </div>
            <div className="text-sm text-muted-foreground">
              {deal.upvotes} pour · {deal.downvotes} contre · posté par <Link to="/u/$handle" params={{ handle: deal.postedBy }} className="font-medium text-foreground hover:text-accent">@{deal.postedBy}</Link>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {deal.tags.map((t: string) => (
              <Link key={t} to="/c/$cat" params={{ cat: t }} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-foreground">#{t}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="border-b border-border pb-6">
          <h2 className="font-display text-3xl">Discussion <span className="text-muted-foreground">({deal.comments})</span></h2>
        </div>
        <div className="mt-6 space-y-5">
          {COMMENTS.map((c, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-background">{c.user[0]}</div>
              <div className="flex-1 rounded-md border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">@{c.user}</span>
                  <span className="text-xs text-muted-foreground">{c.at}</span>
                </div>
                <p className="mt-2 text-[15px]">{c.text}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <button className="inline-flex items-center gap-1 hover:text-foreground"><ArrowBigUp className="h-3.5 w-3.5" /> {c.up}</button>
                  <button className="inline-flex items-center gap-1 hover:text-foreground"><MessageCircle className="h-3.5 w-3.5" /> Répondre</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <textarea placeholder="Partage ton avis ou ton retour d'expérience…" className="w-full rounded-md border border-border bg-card p-4 text-sm outline-none focus:border-foreground" rows={3} />
          <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Publier</button>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <h2 className="font-display text-3xl">Tu pourrais aussi aimer</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((d) => <DealCard key={d.id} deal={d} />)}
        </div>
      </section>
    </SiteLayout>
  );
}
