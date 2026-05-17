export type DealView = {
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
  upvotes: number;
  downvotes: number;
  heat: number;
  comments_count: number;
  posted_by: string | null;
  poster_handle: string | null;
  poster_name: string | null;
};

export type CommentView = {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  handle: string;
  display_name: string;
};

export type LeaderboardEntry = {
  user_id: string;
  handle: string;
  display_name: string;
  deals_count: number;
  points: number;
};
