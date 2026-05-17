import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { DealCard } from "@/components/site/deal-card";
import { getProfileByHandle } from "@/lib/deals.functions";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Flame, Award } from "lucide-react";
import { levelFor } from "@/lib/format";

export const Route = createFileRoute("/u/$handle")({
  component: ProfilePage,
  head: ({ params }) => ({
    meta: [
      { title: `@${params.handle} — Profil chasseur de deals | DRIP` },
      { name: "description", content: `Découvrez les deals partagés par @${params.handle} sur DRIP.` },
    ],
  }),
});

function ProfilePage() {
  const { handle } = Route.useParams();
  const fn = useServerFn(getProfileByHandle);
  const { data, isLoading } = useQuery({
    queryKey: ["profile", handle],
    queryFn: () => fn({ data: { handle } }),
  });

  if (isLoading) return <SiteLayout><div className="py-32 text-center text-muted-foreground">Chargement…</div></SiteLayout>;
  if (!data) return <SiteLayout><div className="py-32 text-center"><h1 className="font-display text-4xl">Profil introuvable</h1></div></SiteLayout>;

  const { profile, points, deals_count, deals } = data;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:py-20">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-ink font-display text-5xl text-background">{profile.display_name[0]}</div>
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Chasseur de deals</div>
            <h1 className="mt-1 font-display text-5xl tracking-tighter md:text-6xl">{profile.display_name}</h1>
            <div className="mt-2 text-muted-foreground">@{profile.handle}</div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"><Trophy className="h-3.5 w-3.5" /> {levelFor(points)}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs"><Award className="h-3.5 w-3.5" /> {deals_count} deals</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs"><Flame className="h-3.5 w-3.5" /> {points} pts</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 md:gap-10">
            <div><div className="font-display text-3xl">{points.toLocaleString("fr")}</div><div className="text-xs text-muted-foreground">Points</div></div>
            <div><div className="font-display text-3xl">{deals_count}</div><div className="text-xs text-muted-foreground">Deals</div></div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="border-b border-border pb-4">
          <h2 className="font-display text-2xl">Deals publiés</h2>
        </div>
        {deals.length === 0 ? (
          <div className="py-12 text-muted-foreground">Aucun deal pour le moment.</div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((d) => <DealCard key={d.id} deal={d} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
