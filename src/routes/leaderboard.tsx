import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { TOP_CONTRIBUTORS } from "@/data/mock";
import { Trophy, Crown } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  component: Leaderboard,
  head: () => ({
    meta: [
      { title: "Leaderboard — Les meilleurs chasseurs de deals | DRIP" },
      { name: "description", content: "Classement mensuel de la communauté DRIP : top contributeurs, chasseurs Gold, Silver, Bronze." },
      { property: "og:title", content: "Leaderboard DRIP" },
    ],
  }),
});

function Leaderboard() {
  const all = [...TOP_CONTRIBUTORS, ...TOP_CONTRIBUTORS.map((u, i) => ({ ...u, handle: u.handle + i, points: u.points - 1500 - i * 200 }))];
  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-[1400px] px-4 py-12 md:py-20">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent"><Trophy className="h-3.5 w-3.5" /> Classement Octobre 2026</div>
          <h1 className="mt-3 font-display text-5xl font-medium tracking-tighter md:text-7xl">Hall of Fame</h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">Les chasseurs qui font vibrer la communauté. Points cumulés ce mois-ci.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {TOP_CONTRIBUTORS.slice(0, 3).map((u, i) => (
            <div key={u.handle} className={`rounded-md border bg-card p-6 ${i === 0 ? "border-accent" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl text-muted-foreground">#{i + 1}</span>
                {i === 0 && <Crown className="h-6 w-6 text-accent" />}
              </div>
              <div className="mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-2xl text-background">{u.name[0]}</div>
              <div className="mt-3 font-display text-xl">{u.name}</div>
              <div className="text-sm text-muted-foreground">@{u.handle}</div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-3xl tabular-nums">{u.points.toLocaleString("fr")}</span>
                <span className="text-xs text-muted-foreground">pts</span>
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-accent">{u.level}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-md border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Chasseur</th>
                <th className="px-5 py-4 hidden md:table-cell">Niveau</th>
                <th className="px-5 py-4 hidden md:table-cell">Deals</th>
                <th className="px-5 py-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {all.map((u, i) => (
                <tr key={u.handle + i} className="border-t border-border hover:bg-cream">
                  <td className="px-5 py-4 font-display tabular-nums text-muted-foreground">{i + 1}</td>
                  <td className="px-5 py-4">
                    <Link to="/u/$handle" params={{ handle: u.handle }} className="flex items-center gap-3 hover:text-accent">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-background">{u.name[0]}</div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">@{u.handle}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">{u.level}</td>
                  <td className="hidden px-5 py-4 tabular-nums md:table-cell">{u.deals}</td>
                  <td className="px-5 py-4 text-right font-display tabular-nums">{u.points.toLocaleString("fr")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SiteLayout>
  );
}
