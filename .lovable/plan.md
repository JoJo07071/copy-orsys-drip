## Goal

Turn DRIP from a mock-data prototype into a real app: users sign up, post deals, vote, comment, and earn points — all persisted in Lovable Cloud.

## Step 1 — Enable Lovable Cloud

Provisions the backend (Postgres + auth + storage). No user setup required.

## Step 2 — Database schema (migration)

Tables:

- **`profiles`** — `id` (FK `auth.users`), `handle` (unique), `display_name`, `avatar_url`, `bio`, `created_at`. Auto-created on signup via trigger.
- **`user_roles`** — `user_id`, `role` (enum: `admin`, `moderator`, `user`). Separate table + `has_role()` security-definer function (never store roles on profiles — privilege-escalation safe).
- **`deals`** — `id`, `slug`, `title`, `brand`, `merchant`, `image_url`, `category`, `gender`, `price_original`, `price_deal`, `code`, `url`, `tags[]`, `expires_at`, `posted_by` (FK profiles), `created_at`.
- **`deal_votes`** — `deal_id`, `user_id`, `value` (+1 / -1), unique on (deal_id, user_id).
- **`comments`** — `id`, `deal_id`, `user_id`, `text`, `created_at`.

Computed via views/RPC:
- `deal_heat` view → upvotes − downvotes + recency boost.
- `user_points` view → points from deals posted, upvotes received, comments.

## Step 3 — RLS policies

- `profiles`: public read, user can update own.
- `deals`: public read; authenticated users insert; only `posted_by` (or admin) can update/delete.
- `deal_votes`: authenticated users insert/update/delete own.
- `comments`: public read; authenticated insert; author can delete.

## Step 4 — Auth

Email/password + Google sign-in (via Lovable broker). Rebuild `/auth` with sign-in / sign-up tabs, add header session state, sign-out button. Configure Google provider.

## Step 5 — Replace mock data

- Swap `DEALS` / `TOP_CONTRIBUTORS` reads on `/`, `/deals`, `/c/$cat`, `/deals/$slug`, `/leaderboard`, `/u/$handle` with server functions querying the DB.
- Keep mock seed inserted once so the UI isn't empty.

## Step 6 — Wire interactive features

- **Voting** on `DealCard` — optimistic upvote/downvote, requires login.
- **Comments** on deal detail page — list + post form.
- **Post-a-deal** form at `/post` — image URL or upload to storage, validation, slug generation.

## Step 7 — Image storage

Storage bucket `deal-images` (public read, authenticated write) for user-submitted deal photos.

---

## Scope note

This is a meaty change. I'll ship it in this order so the app stays usable at every step: **Cloud → schema → auth → read paths → write paths (vote/comment/post)**. If you'd rather split it (e.g. land auth + reads first, then voting/posting in a follow-up), say the word.
