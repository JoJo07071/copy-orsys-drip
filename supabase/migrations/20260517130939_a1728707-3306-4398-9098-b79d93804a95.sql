
-- ENUMS
create type public.app_role as enum ('admin', 'moderator', 'user');
create type public.deal_gender as enum ('homme', 'femme', 'unisexe');

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- USER ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "user roles viewable by everyone"
  on public.user_roles for select using (true);
create policy "admins manage roles"
  on public.user_roles for all using (public.has_role(auth.uid(), 'admin'));

-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_handle text;
  final_handle text;
  n int := 0;
begin
  base_handle := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'handle', split_part(new.email, '@', 1), 'user'), '[^a-z0-9_]', '', 'g'));
  if length(base_handle) < 3 then base_handle := 'user' || substr(new.id::text, 1, 6); end if;
  final_handle := base_handle;
  while exists (select 1 from public.profiles where handle = final_handle) loop
    n := n + 1;
    final_handle := base_handle || n::text;
  end loop;
  insert into public.profiles (id, handle, display_name, avatar_url)
  values (
    new.id,
    final_handle,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', final_handle),
    new.raw_user_meta_data->>'avatar_url'
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- DEALS
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  brand text not null,
  merchant text not null,
  image_url text,
  category text not null,
  gender public.deal_gender not null default 'unisexe',
  price_original numeric(10,2) not null,
  price_deal numeric(10,2) not null,
  code text,
  url text not null,
  tags text[] not null default '{}',
  expires_at timestamptz,
  posted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index deals_created_at_idx on public.deals (created_at desc);
create index deals_category_idx on public.deals (category);

alter table public.deals enable row level security;
create policy "deals are viewable by everyone"
  on public.deals for select using (true);
create policy "authenticated can insert deals"
  on public.deals for insert with check (auth.uid() = posted_by);
create policy "owner or admin can update"
  on public.deals for update using (auth.uid() = posted_by or public.has_role(auth.uid(), 'admin'));
create policy "owner or admin can delete"
  on public.deals for delete using (auth.uid() = posted_by or public.has_role(auth.uid(), 'admin'));

-- VOTES
create table public.deal_votes (
  deal_id uuid not null references public.deals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (deal_id, user_id)
);
alter table public.deal_votes enable row level security;
create policy "votes viewable by everyone"
  on public.deal_votes for select using (true);
create policy "users insert own vote"
  on public.deal_votes for insert with check (auth.uid() = user_id);
create policy "users update own vote"
  on public.deal_votes for update using (auth.uid() = user_id);
create policy "users delete own vote"
  on public.deal_votes for delete using (auth.uid() = user_id);

-- COMMENTS
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  text text not null check (length(text) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index comments_deal_idx on public.comments (deal_id, created_at desc);

alter table public.comments enable row level security;
create policy "comments viewable by everyone"
  on public.comments for select using (true);
create policy "authenticated insert own comment"
  on public.comments for insert with check (auth.uid() = user_id);
create policy "author or admin delete"
  on public.comments for delete using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- VIEWS
create or replace view public.deal_stats as
select
  d.id as deal_id,
  coalesce(sum(case when v.value = 1 then 1 else 0 end), 0)::int as upvotes,
  coalesce(sum(case when v.value = -1 then 1 else 0 end), 0)::int as downvotes,
  coalesce(sum(v.value), 0)::int as heat,
  (select count(*) from public.comments c where c.deal_id = d.id)::int as comments_count
from public.deals d
left join public.deal_votes v on v.deal_id = d.id
group by d.id;

create or replace view public.user_points as
select
  p.id as user_id,
  p.handle,
  p.display_name,
  (select count(*) from public.deals d where d.posted_by = p.id)::int as deals_count,
  (
    coalesce((select sum(case when v.value = 1 then 10 else -2 end)
              from public.deal_votes v
              join public.deals d on d.id = v.deal_id
              where d.posted_by = p.id), 0)
    + (select count(*) from public.deals d where d.posted_by = p.id) * 5
    + (select count(*) from public.comments c where c.user_id = p.id) * 2
  )::int as points
from public.profiles p;

-- STORAGE
insert into storage.buckets (id, name, public) values ('deal-images', 'deal-images', true);

create policy "deal images public read"
  on storage.objects for select using (bucket_id = 'deal-images');
create policy "users upload to own folder"
  on storage.objects for insert with check (
    bucket_id = 'deal-images' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "users update own files"
  on storage.objects for update using (
    bucket_id = 'deal-images' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "users delete own files"
  on storage.objects for delete using (
    bucket_id = 'deal-images' and auth.uid()::text = (storage.foldername(name))[1]
  );
