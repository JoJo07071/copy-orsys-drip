import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { DealCard } from "@/components/site/deal-card";
import { getDealBySlug, getDealComments, listDeals, voteDeal, postComment, getMyVotes } from "@/lib/deals.functions";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowBigUp, ArrowBigDown, Flame, Clock, Tag, Share2, Heart, Bell, MessageCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { expiresInLabel, timeAgo } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/deals/$slug")({
  component: DealDetail,
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
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const getDealFn = useServerFn(getDealBySlug);
  const getCommentsFn = useServerFn(getDealComments);
  const listDealsFn = useServerFn(listDeals);
  const voteFn = useServerFn(voteDeal);
  const postCommentFn = useServerFn(postComment);
  const myVotesFn = useServerFn(getMyVotes);

  const { data: deal, isLoading } = useQuery({
    queryKey: ["deal", slug],
    queryFn: () => getDealFn({ data: { slug } }),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", deal?.id],
    queryFn: () => getCommentsFn({ data: { dealId: deal!.id } }),
    enabled: !!deal?.id,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["deals", "hot"],
    queryFn: () => listDealsFn({ data: { sort: "hot", limit: 8 } }),
  });

  const { data: myVotes = {} } = useQuery({
    queryKey: ["myVotes", deal?.id],
    queryFn: () => myVotesFn({ data: { dealIds: deal ? [deal.id] : [] } }),
    enabled: !!deal?.id && !!user,
  });

  const voteMutation = useMutation({
    mutationFn: (value: -1 | 0 | 1) => voteFn({ data: { dealId: deal!.id, value } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deal", slug] });
      qc.invalidateQueries({ queryKey: ["myVotes", deal?.id] });
    },
    onError: (e) => toast.error(e.message),
  });

  const [commentText, setCommentText] = useState("");
  const commentMutation = useMutation({
    mutationFn: (text: string) => postCommentFn({ data: { dealId: deal!.id, text } }),
    onSuccess: () => {
      setCommentText("");
      qc.invalidateQueries({ queryKey: ["comments", deal?.id] });
      qc.invalidateQueries({ queryKey: ["deal", slug] });
      toast.success("Commentaire publié");
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <SiteLayout><div className="py-32 text-center text-muted-foreground">Chargement…</div></SiteLayout>;
  if (!deal) throw notFound();

  const discount = Math.round((1 - deal.price_deal / deal.price_original) * 100);
  const myVote = myVotes[deal.id] ?? 0;

  const requireAuth = () => {
    if (!user) { navigate({ to: "/auth" }); return false; }
    return true;
  };

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
            {deal.image_url ? (
              <img src={deal.image_url} alt={deal.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center text-muted-foreground">Pas d'image</div>
            )}
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
            <div className="font-display text-5xl font-semibold tabular-nums">{deal.price_deal}€</div>
            <div className="text-xl text-muted-foreground line-through tabular-nums">{deal.price_original}€</div>
            <div className="ml-auto text-sm text-accent">Tu économises {deal.price_original - deal.price_deal}€</div>
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
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Lien vérifié</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Expire dans {expiresInLabel(deal.expires_at)}</span>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm hover:border-foreground"><Heart className="h-4 w-4" /> Wishlist</button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm hover:border-foreground"><Bell className="h-4 w-4" /> Alerte prix</button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm hover:border-foreground"><Share2 className="h-4 w-4" /></button>
          </div>

          <div className="mt-8 flex items-center gap-4 rounded-md border border-border bg-cream p-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => requireAuth() && voteMutation.mutate(myVote === 1 ? 0 : 1)}
                className={`rounded-full p-2 hover:bg-background ${myVote === 1 ? "bg-accent text-accent-foreground" : "bg-background"}`}
              >
                <ArrowBigUp className="h-5 w-5" />
              </button>
              <span className="font-display text-2xl tabular-nums">{deal.heat}</span>
              <button
                onClick={() => requireAuth() && voteMutation.mutate(myVote === -1 ? 0 : -1)}
                className={`rounded-full p-2 hover:bg-background ${myVote === -1 ? "bg-destructive text-destructive-foreground" : "bg-background"}`}
              >
                <ArrowBigDown className="h-5 w-5" />
              </button>
            </div>
            <div className="text-sm text-muted-foreground">
              {deal.upvotes} pour · {deal.downvotes} contre
              {deal.poster_handle && (
                <> · posté par <Link to="/u/$handle" params={{ handle: deal.poster_handle }} className="font-medium text-foreground hover:text-accent">@{deal.poster_handle}</Link></>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {deal.tags.map((t) => (
              <Link key={t} to="/c/$cat" params={{ cat: t }} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-foreground">#{t}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="border-b border-border pb-6">
          <h2 className="font-display text-3xl">Discussion <span className="text-muted-foreground">({deal.comments_count})</span></h2>
        </div>
        <div className="mt-6 space-y-5">
          {comments.length === 0 && <p className="text-muted-foreground">Sois le premier à commenter.</p>}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-background">{c.display_name[0]}</div>
              <div className="flex-1 rounded-md border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Link to="/u/$handle" params={{ handle: c.handle }} className="font-medium hover:text-accent">@{c.handle}</Link>
                  <span className="text-xs text-muted-foreground">{timeAgo(c.created_at)}</span>
                </div>
                <p className="mt-2 text-[15px]">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={user ? "Partage ton avis…" : "Connecte-toi pour commenter"}
            disabled={!user}
            className="w-full rounded-md border border-border bg-card p-4 text-sm outline-none focus:border-foreground disabled:opacity-60"
            rows={3}
          />
          <button
            onClick={() => { if (!requireAuth()) return; if (commentText.trim()) commentMutation.mutate(commentText.trim()); }}
            disabled={!commentText.trim() || commentMutation.isPending}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            <MessageCircle className="h-4 w-4" /> Publier
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <h2 className="font-display text-3xl">Tu pourrais aussi aimer</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.filter((d) => d.id !== deal.id).slice(0, 4).map((d) => <DealCard key={d.id} deal={d} />)}
        </div>
      </section>
    </SiteLayout>
  );
}
