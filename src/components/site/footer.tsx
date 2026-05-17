import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-cream">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="font-display text-3xl font-black tracking-tighter">DRIP<span className="text-accent">.</span></div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            La communauté européenne des chasseurs de bons plans mode. Sneakers, streetwear, luxe — partagés, votés, validés.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Explorer</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/deals">Tous les deals</Link></li>
            <li><Link to="/c/sneakers">Sneakers</Link></li>
            <li><Link to="/c/luxe">Luxe</Link></li>
            <li><Link to="/c/outlet">Outlet</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Communauté</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            <li><Link to="/boxes">Mystery Boxes</Link></li>
            <li><Link to="/post">Poster un deal</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">À propos</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about">Notre histoire</Link></li>
            <li><Link to="/charte">Charte deals</Link></li>
            <li><Link to="/affiliation">Affiliation</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row">
          <div>Made in Paris</div>
        </div>
      </div>
    </footer>
  );
}
