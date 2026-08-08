# Bookmark Pro

A bold, fast bookmark manager built with Next.js (App Router) + TypeScript,
backed by Supabase for auth and storage.

## Stack

- Next.js 15 (App Router, Server Components)
- React 19
- TypeScript 5.7
- Tailwind CSS v4
- Supabase (`@supabase/ssr` + `@supabase/supabase-js`) — auth + Postgres + Realtime

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. Once created, open **SQL Editor** → New query, paste the contents of
   `supabase/schema.sql`, and run it. This creates the `items` table with
   Row Level Security so every user only ever sees their own bookmarks.
3. Go to **Authentication → Providers** and make sure **Email** is enabled.
   For quick local testing you can turn off "Confirm email" so sign-up logs
   the user straight in (re-enable it before going to production).
4. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the two values from step 2:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

## 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to
`/login`. Sign up, and you'll land in your own empty bookmark space.

## 5. Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com) — set the
same two environment variables in the Vercel project settings. No other
config needed.

## Features

- Email/password auth, per-user data isolated via Postgres Row Level Security
- Folders + bookmarks, nested arbitrarily deep
- **Material 3 Expressive** design system: full tonal color palette (violet
  seed), M3 shape scale, type scale, state layers, and motion tokens —
  defined in `src/app/globals.css`
- Light / dark / system theme, toggle in the side menu, persisted, no flash
  on load
- Floating search bar (M3 search-bar component) that expands in place;
  circular logo and menu icon buttons
- Sort by name / date / type, ascending or descending
- Realtime sync — changes reflect instantly across open tabs/devices
- All icons are custom inline SVGs (no emoji, no icon font)
- Accessible: visible focus rings, ARIA roles/labels on interactive
  elements, `prefers-reduced-motion` respected, 44px+ touch targets
