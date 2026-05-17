import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DealView, CommentView, LeaderboardEntry } from "@/types/deal";
import { slugify } from "@/lib/format";

type DealRow = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  merchant: string;
  image_url: string | null;
  category: string;
  gender: "homme" | "femme" | "unisexe";
  price_original: number;
  price_deal: number;
  code: string | null;
  url: string;
  tags: string[];
  expires_at: string | null;
  created_at: string;
  posted_by: string | null;
  profiles: { handle: string; display_name: string } | null;
};

async function hydrate(deals: DealRow[]): Promise<DealView[]> {
  if (deals.length === 0) return [];
  const ids = deals.map((d) => d.id);
  const { data: stats } = await supabaseAdmin
    .from("deal_stats")
    .select("*")
    .in("deal_id", ids);
  const sMap = new Map((stats ?? []).filter((s) => s.deal_id).map((s) => [s.deal_id as string, s] as const));
  return deals.map((d) => {
    const s = sMap.get(d.id);
    return {
      id: d.id,
      slug: d.slug,
      title: d.title,
      brand: d.brand,
      merchant: d.merchant,
      image_url: d.image_url,
      category: d.category,
      gender: d.gender,
      price_original: Number(d.price_original),
      price_deal: Number(d.price_deal),
      code: d.code,
      url: d.url,
      tags: d.tags ?? [],
      expires_at: d.expires_at,
      created_at: d.created_at,
      upvotes: s?.upvotes ?? 0,
      downvotes: s?.downvotes ?? 0,
      heat: s?.heat ?? 0,
      comments_count: s?.comments_count ?? 0,
      posted_by: d.posted_by,
      poster_handle: d.profiles?.handle ?? null,
      poster_name: d.profiles?.display_name ?? null,
    };
  });
}

// ---------- Public reads ----------

export const listDeals = createServerFn({ method: "GET" })
  .inputValidator((input: { sort?: "hot" | "fresh" | "trending"; category?: string; limit?: number } | undefined) =>
    z
      .object({
        sort: z.enum(["hot", "fresh", "trending"]).default("fresh"),
        category: z.string().optional(),
        limit: z.number().min(1).max(100).default(60),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    let q = supabaseAdmin
      .from("deals")
      .select("*, profiles:posted_by(handle, display_name)")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.category) {
      q = q.or(`category.eq.${data.category},gender.eq.${data.category},tags.cs.{${data.category}}`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    let deals = await hydrate((rows ?? []) as DealRow[]);
    if (data.sort === "hot" || data.sort === "trending") {
      deals = [...deals].sort((a, b) => b.heat - a.heat);
    }
    return deals;
  });

export const getDealBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("deals")
      .select("*, profiles:posted_by(handle, display_name)")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const [deal] = await hydrate([row as DealRow]);
    return deal;
  });

export const getDealComments = createServerFn({ method: "GET" })
  .inputValidator((input: { dealId: string }) => z.object({ dealId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("comments")
      .select("id, text, created_at, user_id, profiles:user_id(handle, display_name)")
      .eq("deal_id", data.dealId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r: { id: string; text: string; created_at: string; user_id: string; profiles: { handle: string; display_name: string } | null }) => ({
      id: r.id,
      text: r.text,
      created_at: r.created_at,
      user_id: r.user_id,
      handle: r.profiles?.handle ?? "user",
      display_name: r.profiles?.display_name ?? "User",
    })) satisfies CommentView[];
  });

export const getLeaderboard = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("user_points")
      .select("*")
      .order("points", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as LeaderboardEntry[];
  });

export const getProfileByHandle = createServerFn({ method: "GET" })
  .inputValidator((input: { handle: string }) => z.object({ handle: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, handle, display_name, avatar_url, bio, created_at")
      .eq("handle", data.handle)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!profile) return null;
    const { data: points } = await supabaseAdmin
      .from("user_points")
      .select("points, deals_count")
      .eq("user_id", profile.id)
      .maybeSingle();
    const { data: dealRows } = await supabaseAdmin
      .from("deals")
      .select("*, profiles:posted_by(handle, display_name)")
      .eq("posted_by", profile.id)
      .order("created_at", { ascending: false })
      .limit(40);
    const deals = await hydrate((dealRows ?? []) as DealRow[]);
    return {
      profile,
      points: points?.points ?? 0,
      deals_count: points?.deals_count ?? 0,
      deals,
    };
  });

export const getMyVotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { dealIds: string[] }) => z.object({ dealIds: z.array(z.string().uuid()).max(200) }).parse(input))
  .handler(async ({ data, context }) => {
    if (data.dealIds.length === 0) return {} as Record<string, number>;
    const { data: rows, error } = await context.supabase
      .from("deal_votes")
      .select("deal_id, value")
      .in("deal_id", data.dealIds);
    if (error) throw new Error(error.message);
    const map: Record<string, number> = {};
    (rows ?? []).forEach((r: { deal_id: string; value: number }) => {
      map[r.deal_id] = r.value;
    });
    return map;
  });

// ---------- Authenticated writes ----------

export const voteDeal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { dealId: string; value: -1 | 0 | 1 }) =>
    z.object({ dealId: z.string().uuid(), value: z.union([z.literal(-1), z.literal(0), z.literal(1)]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.value === 0) {
      const { error } = await supabase.from("deal_votes").delete().eq("deal_id", data.dealId).eq("user_id", userId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("deal_votes")
        .upsert({ deal_id: data.dealId, user_id: userId, value: data.value }, { onConflict: "deal_id,user_id" });
      if (error) throw new Error(error.message);
    }
    const { data: stats } = await supabaseAdmin.from("deal_stats").select("*").eq("deal_id", data.dealId).maybeSingle();
    return stats ?? { deal_id: data.dealId, upvotes: 0, downvotes: 0, heat: 0, comments_count: 0 };
  });

export const postComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { dealId: string; text: string }) =>
    z.object({ dealId: z.string().uuid(), text: z.string().min(1).max(2000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("comments")
      .insert({ deal_id: data.dealId, user_id: userId, text: data.text })
      .select("id, text, created_at, user_id")
      .single();
    if (error) throw new Error(error.message);
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("handle, display_name")
      .eq("id", userId)
      .maybeSingle();
    return {
      id: row.id,
      text: row.text,
      created_at: row.created_at,
      user_id: row.user_id,
      handle: profile?.handle ?? "user",
      display_name: profile?.display_name ?? "User",
    } satisfies CommentView;
  });

export const createDeal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        title: z.string().min(3).max(160),
        brand: z.string().min(1).max(80),
        merchant: z.string().min(1).max(80),
        url: z.string().url(),
        image_url: z.string().url().nullable().optional(),
        category: z.string().min(1).max(40),
        gender: z.enum(["homme", "femme", "unisexe"]).default("unisexe"),
        price_original: z.number().positive().max(100000),
        price_deal: z.number().nonnegative().max(100000),
        code: z.string().max(40).nullable().optional(),
        tags: z.array(z.string().max(30)).max(10).default([]),
        expires_in_days: z.number().int().min(1).max(60).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const baseSlug = slugify(`${data.brand}-${data.title}`);
    let slug = baseSlug;
    for (let i = 1; i < 50; i++) {
      const { data: exists } = await supabaseAdmin.from("deals").select("id").eq("slug", slug).maybeSingle();
      if (!exists) break;
      slug = `${baseSlug}-${i}`;
    }
    const expires_at = data.expires_in_days
      ? new Date(Date.now() + data.expires_in_days * 86400000).toISOString()
      : null;
    const { data: row, error } = await supabase
      .from("deals")
      .insert({
        slug,
        title: data.title,
        brand: data.brand,
        merchant: data.merchant,
        url: data.url,
        image_url: data.image_url ?? null,
        category: data.category,
        gender: data.gender,
        price_original: data.price_original,
        price_deal: data.price_deal,
        code: data.code ?? null,
        tags: data.tags,
        expires_at,
        posted_by: userId,
      })
      .select("slug")
      .single();
    if (error) throw new Error(error.message);
    return { slug: row.slug };
  });
