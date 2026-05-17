import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — DRIP" },
      { name: "description", content: "Une question, un partenariat, un signalement ? L'équipe DRIP vous répond sous 48h." },
      { property: "og:title", content: "Contact — DRIP" },
      { property: "og:url", content: "https://boussbouss.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://boussbouss.lovable.app/contact" }],
  }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-ink text-background">
        <div className="mx-auto max-w-[1400px] px-4 py-20 md:py-24">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-accent">
            <MessageCircle className="h-3.5 w-3.5" /> Contact
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tighter md:text-6xl">
            On t'écoute.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-background/80">
            Bug, idée de feature, demande presse, partenariat marque — choisis ton canal et on revient vers toi rapidement.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          {[
            { icon: Mail, title: "Email", value: "hello@drip.fashion", desc: "Réponse sous 48h ouvrées" },
            { icon: MessageCircle, title: "Support membres", value: "support@drip.fashion", desc: "Compte, points, mystery boxes" },
            { icon: MapPin, title: "Bureau", value: "12 rue de Paradis, 75010 Paris", desc: "Sur rendez-vous uniquement" },
          ].map((c) => (
            <div key={c.title} className="rounded-md border border-border bg-card p-6">
              <c.icon className="h-5 w-5 text-accent" />
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{c.title}</div>
              <div className="mt-1 font-display text-lg">{c.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-md border border-border bg-card p-8"
        >
          <h2 className="font-display text-3xl tracking-tighter">Envoyer un message</h2>
          <p className="mt-2 text-sm text-muted-foreground">Les champs marqués d'un * sont obligatoires.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Nom *</span>
              <input required className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Email *</span>
              <input required type="email" className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5" />
            </label>
          </div>

          <label className="mt-4 block text-sm">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Sujet *</span>
            <select required className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5">
              <option>Question générale</option>
              <option>Partenariat / affiliation</option>
              <option>Presse</option>
              <option>Signaler un deal</option>
              <option>Support compte</option>
            </select>
          </label>

          <label className="mt-4 block text-sm">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Message *</span>
            <textarea required rows={6} className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5" />
          </label>

          <button type="submit" className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Envoyer
          </button>

          {sent && (
            <div className="mt-4 rounded-sm border border-accent/30 bg-accent/10 p-3 text-sm">
              Merci, ton message a été envoyé. On revient vers toi sous 48h.
            </div>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}