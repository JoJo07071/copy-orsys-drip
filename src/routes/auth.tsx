import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Connexion — DRIP" },
      { name: "description", content: "Rejoins la communauté DRIP." },
    ],
  }),
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-[1400px] gap-0 px-4 py-12 md:grid-cols-2">
        <div className="hidden rounded-l-md bg-cream p-12 md:block">
          <div className="text-[11px] uppercase tracking-[0.25em] text-accent">DRIP. Communauté</div>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tighter">
            Le luxe<br />du <span className="italic">bon plan.</span>
          </h1>
          <p className="mt-6 max-w-sm text-muted-foreground">Rejoins 128 000 chasseurs qui ont économisé 4,6M€ cette année.</p>
          <ul className="mt-10 space-y-3 text-sm">
            <li>· Accès aux deals en temps réel</li>
            <li>· Points et mystery boxes physiques</li>
            <li>· Alertes prix et restock personnalisées</li>
          </ul>
        </div>
        <div className="rounded-r-md border border-border bg-card p-8 md:p-12">
          <div className="flex gap-1 rounded-full border border-border bg-cream p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full px-4 py-2 text-sm transition ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {m === "login" ? "Se connecter" : "Créer un compte"}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <button className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium hover:border-foreground">
              Continuer avec Google
            </button>
            <button className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium hover:border-foreground">
              Continuer avec Apple
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou par email <span className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-4">
            {mode === "signup" && (
              <input className="w-full rounded-md border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-foreground" placeholder="Pseudo (@handle)" />
            )}
            <input type="email" className="w-full rounded-md border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-foreground" placeholder="Email" />
            <input type="password" className="w-full rounded-md border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-foreground" placeholder="Mot de passe" />
            <button type="button" className="w-full rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            En continuant, tu acceptes nos <Link to="/" className="underline">CGU</Link> et notre politique de confidentialité.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
