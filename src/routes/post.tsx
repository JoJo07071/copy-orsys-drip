import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { Link2, Image as ImgIcon, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createDeal } from "@/lib/deals.functions";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/post")({
  component: PostPage,
  head: () => ({
    meta: [
      { title: "Poster un deal mode | DRIP" },
      { name: "description", content: "Partage un bon plan mode avec la communauté DRIP." },
    ],
  }),
});

function PostPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const createFn = useServerFn(createDeal);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/post" } });
  }, [user, loading, navigate]);

  const [form, setForm] = useState({
    title: "", brand: "", merchant: "", url: "", image_url: "",
    category: "sneakers", gender: "unisexe" as "homme" | "femme" | "unisexe",
    price_original: "", price_deal: "", code: "",
    tags: "", expires_in_days: "7",
  });

  const mutation = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          title: form.title,
          brand: form.brand,
          merchant: form.merchant,
          url: form.url,
          image_url: form.image_url || null,
          category: form.category,
          gender: form.gender,
          price_original: Number(form.price_original),
          price_deal: Number(form.price_deal),
          code: form.code || null,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          expires_in_days: Number(form.expires_in_days),
        },
      }),
    onSuccess: ({ slug }) => {
      toast.success("Deal publié !");
      navigate({ to: "/deals/$slug", params: { slug } });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Nouvelle contribution</div>
        <h1 className="mt-2 font-display text-5xl tracking-tighter md:text-6xl">Poster un deal</h1>
        <p className="mt-3 text-muted-foreground">Plus ton deal est précis, plus la communauté le valide.</p>

        <form className="mt-10 space-y-6" onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}>
          <Field label="URL du produit" icon={Link2}>
            <input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full bg-transparent text-sm outline-none" placeholder="https://..." />
          </Field>
          <Field label="Titre">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-transparent text-sm outline-none" placeholder="Hoodie Carhartt WIP — Noir" />
          </Field>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Marque">
              <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full bg-transparent text-sm outline-none" placeholder="Carhartt WIP" />
            </Field>
            <Field label="Marchand">
              <input required value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} className="w-full bg-transparent text-sm outline-none" placeholder="Zalando" />
            </Field>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Field label="Prix actuel (€)">
              <input required type="number" step="0.01" value={form.price_deal} onChange={(e) => setForm({ ...form, price_deal: e.target.value })} className="w-full bg-transparent text-sm outline-none" />
            </Field>
            <Field label="Prix initial (€)">
              <input required type="number" step="0.01" value={form.price_original} onChange={(e) => setForm({ ...form, price_original: e.target.value })} className="w-full bg-transparent text-sm outline-none" />
            </Field>
            <Field label="Code promo (opt.)" icon={Tag}>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full bg-transparent text-sm outline-none" placeholder="DRIP10" />
            </Field>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Field label="Catégorie">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-transparent text-sm outline-none">
                {["sneakers", "streetwear", "luxe", "pulls", "pantalons", "robes", "sacs", "accessoires", "sport"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Genre">
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as "homme" | "femme" | "unisexe" })} className="w-full bg-transparent text-sm outline-none">
                <option value="unisexe">Unisexe</option>
                <option value="femme">Femme</option>
                <option value="homme">Homme</option>
              </select>
            </Field>
            <Field label="Expire dans (jours)">
              <input type="number" min={1} max={60} value={form.expires_in_days} onChange={(e) => setForm({ ...form, expires_in_days: e.target.value })} className="w-full bg-transparent text-sm outline-none" />
            </Field>
          </div>
          <Field label="Image (URL)" icon={ImgIcon}>
            <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full bg-transparent text-sm outline-none" placeholder="https://..." />
          </Field>
          <Field label="Tags (séparés par des virgules)">
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full bg-transparent text-sm outline-none" placeholder="streetwear, oversized, soldes" />
          </Field>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="text-xs text-muted-foreground">En postant, tu acceptes la charte deals.</div>
            <button type="submit" disabled={mutation.isPending} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50">
              {mutation.isPending ? "Publication…" : "Publier le deal"}
            </button>
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
