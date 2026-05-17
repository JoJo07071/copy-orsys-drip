import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" ? s.redirect : "/" }),
  head: () => ({
    meta: [
      { title: "Connexion — DRIP" },
      { name: "description", content: "Rejoins la communauté DRIP." },
    ],
  }),
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });

  useEffect(() => {
    if (user) navigate({ to: search.redirect ?? "/" });
  }, [user, navigate, search.redirect]);

  const handleEmail = async () => {
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { handle: handle || email.split("@")[0], display_name: handle || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Compte créé. Vérifie ton email pour confirmer.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connecté");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) throw result.error;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur Google");
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-[1400px] gap-0 px-4 py-12 md:grid-cols-2">
        <div className="hidden rounded-l-md bg-cream p-12 md:block">
          <div className="text-[11px] uppercase tracking-[0.25em] text-accent">DRIP. Communauté</div>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tighter">Le luxe<br />du <span className="italic">bon plan.</span></h1>
          <p className="mt-6 max-w-sm text-muted-foreground">Rejoins les chasseurs qui partagent les meilleurs deals mode.</p>
          <ul className="mt-10 space-y-3 text-sm">
            <li>· Accès aux deals en temps réel</li>
            <li>· Points et mystery boxes</li>
            <li>· Alertes prix personnalisées</li>
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
            <button onClick={handleGoogle} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium hover:border-foreground disabled:opacity-50">
              Continuer avec Google
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou par email <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleEmail(); }} className="space-y-4">
            {mode === "signup" && (
              <input value={handle} onChange={(e) => setHandle(e.target.value)} className="w-full rounded-md border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-foreground" placeholder="Pseudo (lettres et chiffres)" />
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-md border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-foreground" placeholder="Email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} className="w-full rounded-md border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-foreground" placeholder="Mot de passe (6 caractères min.)" />
            <button type="submit" disabled={loading} className="w-full rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50">
              {loading ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            En continuant, tu acceptes nos <Link to="/" className="underline">CGU</Link>.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
