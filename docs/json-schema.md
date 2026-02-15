# JSON Schema Contract

This document describes the form JSON structure used by Fill.in.

Source of truth for runtime types:

- `lib/forms/types.ts`

## Top-Level Form Shape

```json
{
  "id": "uuid",
  "slug": "string",
  "title": "string",
  "description": "string",
  "blocks": [],
  "logicJumps": [],
  "visibilityRules": []
}
```

## Block Union

Each item in `blocks` must include:

- `id: string`
- `type: string` (one of supported block types)
- `required: boolean` (present on most blocks)
- `config: object` (shape depends on block type)

Supported `type` values:

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

## Block Config Examples

### short_text

```json
{
  "id": "short_text_a1",
  "type": "short_text",
  "required": true,
  "config": {
    "label": "Full name",
    "placeholder": "Type your answer",
    "maxLength": 100
  }
}
```

### long_text

```json
{
  "id": "long_text_b1",
  "type": "long_text",
  "required": true,
  "config": {
    "label": "Tell us about yourself",
    "placeholder": "Type your answer",
    "rows": 4
  }
}
```

### multiple_choice

```json
{
  "id": "multiple_choice_c1",
  "type": "multiple_choice",
  "required": true,
  "config": {
    "label": "Preferred work model",
    "allowMultiple": false,
    "options": [
      { "id": "opt_1", "label": "On-site" },
      { "id": "opt_2", "label": "Hybrid" },
      { "id": "opt_3", "label": "Remote" }
    ]
  }
}
```

### email

```json
{
  "id": "email_d1",
  "type": "email",
  "required": true,
  "config": {
    "label": "Work email",
    "placeholder": "you@company.com"
  }
}
```

### phone

```json
{
  "id": "phone_e1",
  "type": "phone",
  "required": false,
  "config": {
    "label": "Phone number",
    "placeholder": "Enter your phone number"
  }
}
```

### date

```json
{
  "id": "date_f1",
  "type": "date",
  "required": true,
  "config": {
    "label": "Preferred interview date",
    "placeholder": "Pick a date"
  }
}
```

### link

```json
{
  "id": "link_g1",
  "type": "link",
  "required": false,
  "config": {
    "label": "Portfolio URL",
    "placeholder": "https://example.com"
  }
}
```

### number

```json
{
  "id": "number_h1",
  "type": "number",
  "required": false,
  "config": {
    "label": "Years of experience",
    "placeholder": "Enter a number",
    "min": 0,
    "max": 30
  }
}
```

### rating

```json
{
  "id": "rating_i1",
  "type": "rating",
  "required": true,
  "config": {
    "label": "Rate this application flow",
    "max": 5
  }
}
```

### fileUpload

```json
{
  "id": "file_j1",
  "type": "fileUpload",
  "required": true,
  "config": {
    "label": "Upload resume",
    "multiple": false,
    "accept": ".pdf,.doc,.docx",
    "maxSizeMB": 10
  }
}
```

### time

```json
{
  "id": "time_k1",
  "type": "time",
  "required": false,
  "config": {
    "label": "Preferred interview time"
  }
}
```

### linear_scale

```json
{
  "id": "linear_scale_l1",
  "type": "linear_scale",
  "required": true,
  "config": {
    "label": "How confident are you with React?",
    "min": 1,
    "max": 5,
    "minLabel": "Beginner",
    "maxLabel": "Expert"
  }
}
```

## Logic Rules

### visibilityRules

Each rule controls whether a target block is shown.

```json
{
  "id": "vr_1",
  "targetBlockId": "block_to_show_or_hide",
  "condition": {
    "blockId": "source_block_id",
    "operator": "equals",
    "value": "Remote"
  }
}
```

### logicJumps

Each jump can redirect the next block when condition matches.

```json
{
  "id": "jump_1",
  "fromBlockId": "current_block_id",
  "order": 1,
  "condition": {
    "blockId": "current_block_id",
    "operator": "greater_than",
    "value": 3
  },
  "toBlockId": "destination_block_id"
}
```

Supported operators:

- `equals`
- `not_equals`
- `contains`
- `greater_than`
- `less_than`

## Persistence Notes

- Form JSON is stored in `forms.schema`.
- Responses are stored as `responses.answers` keyed by `block.id`.
- Runtime may normalize some values before save (for example link URLs).

## Compatibility Guidance

- Keep `type` values stable after publish to avoid response rendering issues.
- Prefer additive changes to `config` fields.
- When removing a block, existing responses may still contain historical keys.
