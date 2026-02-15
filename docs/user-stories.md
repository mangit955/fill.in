# User Stories

This document captures realistic user journeys for the current Fill.in product.

## Personas

- Form owner: creates, publishes, and manages forms
- Collaborator (editor): helps maintain form content
- Respondent: fills and submits published forms

## Story Set

### A. Form Creation and Editing

1. As a form owner, I want to create a new empty form so I can start collecting responses quickly.
2. As a form owner, I want to add different block types so I can capture structured and unstructured information.
3. As a form owner, I want to edit labels/placeholders/settings on each block so the form is clear to respondents.
4. As a form owner, I want to reorder blocks by drag-and-drop so the question flow matches my intent.
5. As a form owner, I want to duplicate or delete a block so I can iterate faster.
6. As a form owner, I want draft edits to autosave so I do not lose progress.

### B. Form Logic

1. As a form owner, I want visibility rules so some questions only appear when relevant.
2. As a form owner, I want logic jumps so respondents can branch to different next questions.
3. As a form owner, I want required-field controls so I can enforce mandatory questions.

### C. Publishing and Sharing

1. As a form owner, I want to publish a form so it becomes available at a public URL.
2. As a form owner, I want to copy the public link quickly so I can share it in any channel.
3. As a form owner, I want to return to editor mode after publishing so I can continue refining content.

### D. Runtime Experience

1. As a respondent, I want a clear one-question-at-a-time flow so the form feels simple.
2. As a respondent, I want input validation feedback (email, phone, URL, number, file size) so I can fix mistakes immediately.
3. As a respondent, I want to go back to previous questions so I can correct answers before submit.
4. As a respondent, I want a success confirmation after submit so I know my response was received.

### E. Collaboration

1. As a form owner, I want to invite collaborators by email so others can edit my form.
2. As a form owner, I want to remove collaborator access so permissions stay controlled.
3. As a collaborator, I want access only to forms I am invited to so data remains private.

### F. Responses and Analytics

1. As a form owner, I want to view submissions in a table so I can review answers efficiently.
2. As a form owner, I want question labels as table columns so responses are easy to interpret.
3. As a form owner, I want views/submits/completion/drop-off stats so I can optimize my form.

## Acceptance Criteria (MVP)

- Owner can create, edit, and publish forms
- Public runtime can submit responses to published forms
- Responses page shows response rows and analytics summary
- Collaboration invite/remove works for owner-managed forms
- Core validations and required-field checks are enforced in runtime

## Out of Scope (Current Repo)

- Payments and billing
- Webhooks and external integrations
- Advanced workflow automation
- White-label custom domains
