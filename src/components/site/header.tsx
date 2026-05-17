import { Link } from "@tanstack/react-router";
import { Search, User, Bell, Heart, Flame, Menu } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="border-b border-border/60 bg-ink text-background">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-3 px-4 py-2 text-[11px] uppercase tracking-[0.2em]">
          <Flame className="h-3.5 w-3.5 text-accent" />
          <span className="opacity-80">Livraison gratuite chez ASOS dès 35€ · code DRIP10</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-4 md:py-5">
        <Link to="/" className="font-display text-2xl font-black tracking-tighter md:text-3xl">
          DRIP<span className="text-accent">.</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link to="/deals" className="hover:text-accent transition-colors">Hot</Link>
          <Link to="/c/femme" className="hover:text-accent transition-colors">Femme</Link>
          <Link to="/c/homme" className="hover:text-accent transition-colors">Homme</Link>
          <Link to="/c/sneakers" className="hover:text-accent transition-colors">Sneakers</Link>
          <Link to="/c/luxe" className="hover:text-accent transition-colors">Luxe</Link>
          <Link to="/c/outlet" className="hover:text-accent transition-colors">Outlet</Link>
          <Link to="/leaderboard" className="hover:text-accent transition-colors">Communauté</Link>
        </nav>
        <div className="ml-auto hidden flex-1 max-w-md md:block">
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Rechercher une marque, un produit, un deal…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button className="rounded-full p-2 hover:bg-muted" aria-label="Notifications"><Bell className="h-5 w-5" /></button>
          <button className="rounded-full p-2 hover:bg-muted" aria-label="Wishlist"><Heart className="h-5 w-5" /></button>
          <Link to="/auth" className="rounded-full p-2 hover:bg-muted" aria-label="Compte"><User className="h-5 w-5" /></Link>
          <Link to="/post" className="ml-2 hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-ink md:inline-block">
            Poster un deal
          </Link>
          <button className="ml-1 rounded-full p-2 hover:bg-muted md:hidden" aria-label="Menu"><Menu className="h-5 w-5" /></button>
        </div>
      </div>
    </header>
  );
}
