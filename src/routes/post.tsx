import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { Link2, Image as ImgIcon, Tag } from "lucide-react";

export const Route = createFileRoute("/post")({
  component: PostPage,
  head: () => ({
    meta: [
      { title: "Poster un deal mode | DRIP" },
      { name: "description", content: "Partage un bon plan mode avec la communauté DRIP et gagne des points." },
    ],
  }),
});

function PostPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Nouvelle contribution</div>
        <h1 className="mt-2 font-display text-5xl tracking-tighter md:text-6xl">Poster un deal</h1>
        <p className="mt-3 text-muted-foreground">Plus ton deal est précis, plus la communauté le valide. +50 pts à la publication.</p>

        <form className="mt-10 space-y-6">
          <Field label="URL du produit" icon={Link2}>
            <input className="w-full bg-transparent text-sm outline-none" placeholder="https://www.zalando.fr/..." />
          </Field>
          <Field label="Titre du deal">
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Ex : Hoodie Carhartt WIP — Noir" />
          </Field>
          <div className="grid gap-6 md:grid-cols-3">
            <Field label="Prix actuel">
              <input type="number" className="w-full bg-transparent text-sm outline-none" placeholder="49" />
            </Field>
            <Field label="Prix initial">
              <input type="number" className="w-full bg-transparent text-sm outline-none" placeholder="99" />
            </Field>
            <Field label="Code promo (opt.)" icon={Tag}>
              <input className="w-full bg-transparent text-sm outline-none" placeholder="DRIP10" />
            </Field>
          </div>
          <Field label="Description">
            <textarea rows={5} className="w-full bg-transparent text-sm outline-none" placeholder="Pourquoi c'est un bon deal ? Tailles dispo, livraison, retours…" />
          </Field>
          <Field label="Image (URL ou upload)" icon={ImgIcon}>
            <input className="w-full bg-transparent text-sm outline-none" placeholder="https://..." />
          </Field>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="text-xs text-muted-foreground">En postant, tu acceptes la charte deals.</div>
            <button type="button" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Publier le deal</button>
          </div>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-3 focus-within:border-foreground">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {children}
      </div>
    </label>
  );
}
