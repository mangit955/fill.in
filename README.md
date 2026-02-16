# Fill.in

Fill.in is a collaborative form builder built with Next.js App Router + Supabase.
It lets users create forms, publish them to a public URL, collect responses, and collaborate with other editors.

## Live Demo

- Production URL: `https://fill-in-ten.vercel.app`
- Public runtime pattern: `/f/[slug]`

If you are evaluating this project for hiring/interview purposes, use the verification checklist below.

## Product Highlights

- Drag-and-drop form builder
- 12 block types:
  - short text, long text, multiple choice
  - email, phone, date, link
  - number, rating, file upload
  - time, linear scale
- Conditional behavior:
  - visibility rules (show/hide blocks)
  - logic jumps (branching)
- Public runtime rendering from stored JSON schema
- Responses table + analytics dashboard
- Collaboration model (owner + editors)
- Autosave editor workflow

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, Radix UI, Framer Motion,
- Supabase (Postgres, Auth, Storage)
- dnd-kit

## High-Level Architecture

- Server routes enforce auth/access and fetch form metadata.
- Builder stores schema in `forms.schema` and autosaves edits.
- Runtime `/f/[slug]` renders schema and writes responses/events.
- Responses page aggregates submissions and event analytics.

See:

- [`docs/architecture.md`](./docs/architecture.md)
- [`docs/data-model.md`](./docs/data-model.md)
- [`docs/plan.md`](./docs/plan.md)

## Routes

- `/` landing
- `/login`, `/signup`, `/auth/callback` auth
- `/dashboard` form listing
- `/create` create new form
- `/create/[slug]` edit form
- `/create/[slug]/responses` responses + analytics
- `/f/[slug]` public runtime
- `/api/invite` collaborator invite API

## Local Setup

### 1. Prerequisites

- Node.js 20+
- npm 10+
- Supabase project

### 2. Install

```bash
npm install
```

### 3. Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in client code.
- Keep `.env.local` out of version control.

### 4. Run

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Supabase Setup (SQL)

Run this in Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null default '',
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  schema jsonb not null,
  user_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.form_members (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'editor' check (role in ('editor')),
  created_at timestamptz not null default now(),
  unique (form_id, user_id)
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.form_events (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  session_id text,
  event_type text not null check (event_type in ('view', 'answer', 'submit')),
  block_id text,
  created_at timestamptz not null default now()
);
```

Create storage bucket:

- Bucket name: `uploads`

Starter runtime upload policy (published forms only):

```sql
create policy "runtime_upload_published_forms"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'uploads'
  and exists (
    select 1
    from public.forms f
    where f.id = split_part(name, '/', 1)::uuid
      and f.status = 'published'
  )
);
```

If bucket is private, add a corresponding `select` policy for runtime reads.

## Verification Checklist

Use this flow to validate the project quickly:

1. Sign in and create a form from `/create`.
2. Add mixed blocks (including file upload and rating).
3. Add at least one visibility rule and one logic jump.
4. Publish and open `/f/[slug]`.
5. Submit:
   - one full response
   - one partial response (abandon midway)
6. Open `/create/[slug]/responses` and verify:
   - table data appears
   - file/rating previews render
   - completion + drop-off metrics update
7. Test collaborator invite from form editor.

## SEO / Sharing Notes

- Root metadata is in `app/layout.tsx`.
- Runtime form metadata is dynamic in `app/(runtime)/f/[slug]/page.tsx`.
- `robots.txt` and `sitemap.xml` are generated via:
  - `app/robots.ts`
  - `app/sitemap.ts`
- Auth/builder routes are `noindex` via:
  - `app/(auth)/layout.tsx`
  - `app/(builder)/layout.tsx`

When preview images seem stale on WhatsApp/X, use a new image URL or re-scrape with platform validators (their cache is aggressive).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
