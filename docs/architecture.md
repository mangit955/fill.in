# Architecture

## Overview

Fill.in uses a schema-first architecture where each form is persisted as JSON in `forms.schema` and rendered by two surfaces:

- Builder surface (`/create/[slug]`) for editing schema
- Runtime surface (`/f/[slug]`) for collecting responses

## High-Level Components

- Next.js App Router
  - Server components for protected data fetches
  - Client components for interactive editor/runtime UX
- Supabase
  - Auth: session and identity
  - Postgres: forms, responses, members, events
  - Storage: uploaded files
- Form logic engine
  - Block visibility evaluation
  - Logic jump evaluation for branching flow

## Data Flow

### Builder flow

1. User opens `/create/[slug]`
2. Server loads form by slug
3. Client editor mutates local schema state
4. Autosave persists schema to `forms`
5. Publish updates form status to `published`

### Runtime flow

1. Public user opens `/f/[slug]`
2. Server loads published form schema
3. Runtime renders one block at a time
4. Runtime evaluates visibility and jumps using answers
5. Submit writes record to `responses`
6. Runtime writes events to `form_events` (view/answer/submit)

### Responses flow

1. User opens `/create/[slug]/responses`
2. Server fetches form metadata + latest responses
3. Server aggregates event metrics for completion/drop-off
4. Client table renders dynamic columns from block schema

## Security Boundary

- Client is untrusted
- Server routes/actions and RLS policies must enforce ownership/membership
- Service role operations should remain minimal and server-only

## Deployment Shape

- App deployed on Vercel (recommended)
- Supabase hosted project for DB/Auth/Storage
- Environment variables injected per environment

## Operational Concerns

- Add CI checks: lint, typecheck, tests, build
- Add monitoring around submit and invite failures
- Add migration docs for schema and policy changes
