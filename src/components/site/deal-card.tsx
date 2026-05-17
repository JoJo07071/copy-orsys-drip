import { Link } from "@tanstack/react-router";
import { Flame, MessageCircle, ArrowBigUp, ArrowBigDown, Clock, Tag } from "lucide-react";
import type { Deal } from "@/data/mock";

function HeatBadge({ heat }: { heat: number }) {
  const hot = heat >= 500;
  return (
    <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums ${hot ? "hot-gradient text-hot-foreground" : "bg-muted text-foreground"}`}>
      <Flame className="h-3 w-3" />
      {heat}°
    </div>
  );
}

export function DealCard({ deal, featured = false }: { deal: Deal; featured?: boolean }) {
  const discount = Math.round((1 - deal.priceDeal / deal.priceOriginal) * 100);
  return (
    <Link
      to="/deals/$slug"
      params={{ slug: deal.slug }}
      className="group relative flex flex-col overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={deal.image}
          alt={deal.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <span className="rounded-sm bg-ink px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-background">
            -{discount}%
          </span>
          {deal.code && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-accent px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
              <Tag className="h-3 w-3" /> {deal.code}
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3"><HeatBadge heat={deal.heat} /></div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{deal.brand}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{deal.expiresIn}</span>
        </div>
        <h3 className={`font-display font-medium leading-snug text-foreground ${featured ? "text-2xl" : "text-base"}`}>
          {deal.title}
        </h3>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold tabular-nums">{deal.priceDeal}€</span>
            <span className="text-sm text-muted-foreground line-through tabular-nums">{deal.priceOriginal}€</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><ArrowBigUp className="h-4 w-4" />{deal.upvotes}</span>
            <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{deal.comments}</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>par <span className="font-medium text-foreground">@{deal.postedBy}</span></span>
          <div className="flex items-center gap-1">
            <button className="rounded p-1 hover:bg-muted" onClick={(e) => e.preventDefault()}><ArrowBigUp className="h-4 w-4" /></button>
            <button className="rounded p-1 hover:bg-muted" onClick={(e) => e.preventDefault()}><ArrowBigDown className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </Link>
  );
}
