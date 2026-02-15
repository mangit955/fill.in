# Data Model

This document describes the tables and storage currently used by Fill.in.

## 1. forms

Stores form metadata and full JSON schema.

Suggested columns:

- `id` uuid primary key
- `slug` text unique not null
- `title` text not null
- `description` text
- `status` text not null check (`draft`, `published`)
- `schema` jsonb not null
- `user_id` uuid nullable (legacy rows may be null)
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

## 2. form_members

Maps additional users to forms for collaboration.

Suggested columns:

- `id` uuid primary key
- `form_id` uuid not null references `forms(id)` on delete cascade
- `user_id` uuid not null
- `role` text not null check (`editor`)
- `created_at` timestamptz default now()

Suggested constraint:
- unique (`form_id`, `user_id`)

## 3. responses

Stores submitted answer payloads per form.

Suggested columns:

- `id` uuid primary key
- `form_id` uuid not null references `forms(id)` on delete cascade
- `answers` jsonb not null
- `created_at` timestamptz default now()

## 4. form_events

Tracks runtime analytics events by session.

Suggested columns:

- `id` uuid primary key
- `form_id` uuid not null references `forms(id)` on delete cascade
- `session_id` text
- `event_type` text not null check (`view`, `answer`, `submit`)
- `block_id` text nullable
- `created_at` timestamptz default now()

## 5. Supabase Storage

Bucket:

- `uploads`

Object path pattern used by runtime:

- `{form_id}/{block_id}/{uuid}-{original_filename}`

## 6. Form Schema (JSON)

The `forms.schema` JSON matches TypeScript types in:

- `/Users/manasraghuwanshi/Developer/projects/fill.in/lib/forms/types.ts`

Top-level shape:

```json
{
  "id": "uuid",
  "slug": "uuid-or-string",
  "title": "string",
  "description": "string",
  "blocks": [],
  "logicJumps": [],
  "visibilityRules": []
}
```

Supported block `type` values:

- `short_text`
- `long_text`
- `multiple_choice`
- `email`
- `phone`
- `date`
- `link`
- `number`
- `rating`
- `fileUpload`
- `time`
- `linear_scale`

## 7. RLS Guidance

Production policies should ensure:

- `forms`
  - owner and members can read form metadata/schema
  - only owner can delete
  - owner and editors can update schema
- `responses`
  - public insert allowed for published forms only (if desired)
  - read restricted to owner/editors
- `form_members`
  - owner manages membership
  - members can read membership for their forms
- `form_events`
  - insert allowed for runtime tracking
  - read restricted to owner/editors
- `uploads`
  - write/read policy scoped by form ownership and runtime rules

## 8. Index Suggestions

- `forms(slug)` unique
- `forms(user_id)`
- `responses(form_id, created_at desc)`
- `form_members(form_id, user_id)` unique
- `form_events(form_id, event_type, created_at desc)`
