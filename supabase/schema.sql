-- ============================================================
-- Bookmark Pro — Supabase schema
-- Run this once in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- Extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Table: items  (folders + bookmarks, one tree per user)
-- ------------------------------------------------------------
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  parent_id   uuid references public.items (id) on delete cascade,
  type        text not null check (type in ('folder', 'bookmark')),
  name        text not null check (char_length(trim(name)) > 0),
  url         text,
  icon        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint bookmark_requires_url check (
    (type = 'bookmark' and url is not null) or (type = 'folder')
  )
);

create index if not exists items_user_id_idx on public.items (user_id);
create index if not exists items_parent_id_idx on public.items (parent_id);
create index if not exists items_user_parent_idx on public.items (user_id, parent_id);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists items_set_updated_at on public.items;
create trigger items_set_updated_at
  before update on public.items
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security — each user only ever sees their own rows
-- ------------------------------------------------------------
alter table public.items enable row level security;

drop policy if exists "Users can view own items" on public.items;
create policy "Users can view own items"
  on public.items for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own items" on public.items;
create policy "Users can insert own items"
  on public.items for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own items" on public.items;
create policy "Users can update own items"
  on public.items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own items" on public.items;
create policy "Users can delete own items"
  on public.items for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Setup notes
-- ============================================================
-- 1. Supabase Dashboard -> Authentication -> Providers -> Email
--    Enable "Email" provider. For local/dev testing you can turn
--    off "Confirm email" so signup logs the user in immediately.
-- 2. Supabase Dashboard -> Project Settings -> API
--    Copy "Project URL" and "anon public" key into .env.local
--    (see .env.local.example in the project root).
-- 3. That's it — no server code needed, the browser client talks
--    to Supabase directly and RLS enforces per-user isolation.
