# Fill.in

Fill.in is a collaborative form builder built with Next.js App Router and Supabase.
It lets users create forms, publish them to a public URL, collect responses, and collaborate with other editors.

## Product Highlights

- Form builder with drag-and-drop blocks
- Supported blocks:
  - short text
  - long text
  - multiple choice (single or multi-select)
  - email
  - phone
  - date
  - link
  - number (min/max validation)
  - rating
  - file upload
  - time
  - linear scale
- Conditional behavior:
  - visibility rules (show/hide blocks)
  - logic jumps (branching to next block)
- Public runtime at `/f/[slug]`
- Response dashboard with table view and basic analytics
- Collaboration model:
  - owner
  - editors via invite flow
- Auth via Supabase (email and OAuth providers configured in Supabase)
- Autosave draft behavior in editor

## Tech Stack

- Framework: Next.js 16 (App Router), React 19, TypeScript
- Styling/UI: Tailwind CSS v4, Radix UI, Framer Motion, Sonner
- Data/Auth/Storage: Supabase (Postgres + Auth + Storage)
- Drag and drop: dnd-kit

## Architecture Overview

- Server-rendered routes fetch form metadata and enforce access rules.
- Client editor manages schema state and persists to Supabase.
- Public runtime renders `form.schema` dynamically and writes responses/events.
- Responses page aggregates response rows plus event-based analytics.

For deeper details, see:
- [`docs/architecture.md`](./docs/architecture.md)
- [`docs/data-model.md`](./docs/data-model.md)
- [`docs/plan.md`](./docs/plan.md)

## Routes

- Landing: `/`
- Auth: `/login`, `/signup`, `/auth/callback`
- Dashboard: `/dashboard`
- Create new form: `/create`
- Edit form: `/create/[slug]`
- Responses: `/create/[slug]/responses`
- Public runtime: `/f/[slug]`
- API: `/api/invite`

## Local Setup

### 1. Prerequisites

- Node.js 20+
- npm 10+
- Supabase project

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Notes:
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to clients.
- Keep `.env.local` out of version control.

### 4. Run development server

```bash
npm run dev
```

App runs on [http://localhost:3000](http://localhost:3000).

## Supabase Requirements

You need the following tables and storage bucket:

- `forms`
- `form_members`
- `responses`
- `form_events`
- Storage bucket: `uploads`

Expected schema is documented in [`docs/data-model.md`](./docs/data-model.md).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Production Checklist

- Add strict RLS policies for all tables and storage bucket
- Verify server-side authz checks on all sensitive routes/actions
- Add integration tests for create, publish, submit, and responses visibility
- Enable CI pipeline (lint, typecheck, test, build)
- Add monitoring and error reporting
- Document backup and restore strategy for form/response data

## Interview Demo Flow

Use this sequence during interviews:

1. Create a form from `/create`
2. Add mixed question types
3. Add one visibility rule and one logic jump
4. Publish and copy public URL
5. Submit sample responses on runtime URL
6. Open `/create/[slug]/responses` and explain analytics
7. Show collaborator invite and role behavior

## Current State

This repo is a strong product prototype with real full-stack behavior.
To present as production-grade, prioritize:

1. Security hardening (authz and RLS review)
2. Lint and type hygiene cleanup
3. Test coverage for core flows

## License

No license file is currently included in this repository.
