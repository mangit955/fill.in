## 🧭 Goal

> Build a **modern, Notion-style form builder** (Tally.so clone) where users can type or drag fields, customize them live, and share dynamic forms publicly.

---

## ⚙️ Tech Stack (Finalized)

| Layer                           | Tech                                                        | Notes                                          |
| ------------------------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| **Frontend**                    | Next.js (App Router) + React + Tailwind CSS + Framer Motion | Modern, fast, supports both UI & server routes |
| **Drag & Drop / Typing Engine** | React DnD + Custom `/command` parser                        | For Notion-style interactions                  |
| **Database**                    | MongoDB (with Prisma ORM)                                   | Flexible JSON-based form schema                |
| **Auth**                        | NextAuth.js                                                 | Email + OAuth support                          |
| **Validation**                  | Zod                                                         | For schema + input validation                  |
| **Deployment**                  | Vercel                                                      | Frontend + serverless backend                  |
| **Storage**                     | Cloudinary / UploadThing                                    | For file upload fields                         |
| **Optional**                    | Clerk.dev / Stripe / Resend                                 | For premium features, payments, emails         |

---

## 🧩 High-Level Phases

| Phase | Focus                     | Outcome                                            |
| ----- | ------------------------- | -------------------------------------------------- |
| 1️⃣    | Planning & Design         | Schema, UX wireframes, architecture                |
| 2️⃣    | Core Builder UI           | Notion-style editor, live schema rendering         |
| 3️⃣    | Field Engine              | Text, Email, Checkbox, Dropdown, File Upload       |
| 4️⃣    | Form Schema & Persistence | Save/load forms from DB                            |
| 5️⃣    | Public Form Rendering     | Dynamic route-based forms                          |
| 6️⃣    | Submissions System        | Collect and view responses                         |
| 7️⃣    | Auth & Dashboard          | User accounts, saved forms                         |
| 8️⃣    | Polish & Pro Features     | Conditional logic, themes, analytics, integrations |
| 9️⃣    | Deployment & CI/CD        | Vercel + GitHub Actions pipeline                   |

---

## 🗓️ Detailed Weekly Breakdown

### Phase 1 – Planning & Design (Week 1)

**Goal:** Lock the blueprint before touching code.

- [ ] Write **user stories** (core + advanced)
- [ ] Define **form JSON schema**
- [ ] Create **wireframes / layout sketch**
- [ ] Setup repo (Next.js + Tailwind + ESLint + Prettier)
- [ ] Plan DB schema for `Form`, `Submission`, `User`

🧠 _Deliverable:_ `docs/specs.md` — full product + schema plan

---

### Phase 2 – Builder UI Base (Weeks 2–3)

**Goal:** Implement Notion-like typing and basic field blocks.

- [ ] Create builder layout (Left: Fields, Center: Canvas, Right: Properties)
- [ ] Implement `/command` style input (e.g., typing `/text` adds a text field)
- [ ] Support drag + drop for reordering fields
- [ ] Render fields live from schema (`form.fields` array)
- [ ] Add delete/edit controls for each field

🧠 _Deliverable:_ You can add, edit, and reorder fields dynamically.

---

### Phase 3 – Field Components & Schema Sync (Weeks 4–5)

**Goal:** Standardize all input types & make them persist in schema.

- [ ] Define a `Field` interface in TypeScript
- [ ] Create reusable components:  
       `TextField`, `EmailField`, `CheckboxField`, `DropdownField`, `DateField`, `FileField`
- [ ] Add property editor (right panel)
- [ ] Sync field changes (label, placeholder, required) to JSON schema
- [ ] Auto-generate preview from schema

🧠 _Deliverable:_ JSON-based form builder working fully offline.

---

### Phase 4 – Database Integration (Weeks 6–7)

**Goal:** Connect the builder to your backend.

- [ ] Setup MongoDB + Prisma
- [ ] Models: `User`, `Form`, `Field`, `Submission`
- [ ] Next.js API routes: `/api/forms` (CRUD)
- [ ] Save/load form JSON
- [ ] Implement auto-save (debounced)

🧠 _Deliverable:_ User can save and reload forms from DB.

---

### Phase 5 – Public Form Renderer (Weeks 8–9)

**Goal:** Make forms accessible publicly.

- [ ] Dynamic routes: `/f/[formId]`
- [ ] Render form from schema
- [ ] Handle input validation (Zod)
- [ ] Submit responses → `/api/submissions`
- [ ] Show success page or redirect

🧠 _Deliverable:_ Shareable, functional public forms.

---

### Phase 6 – Submissions Dashboard (Week 10)

**Goal:** Let creators view responses.

- [ ] Dashboard route `/dashboard/forms/[id]/submissions`
- [ ] Fetch responses from DB
- [ ] Display in table (with export to CSV)
- [ ] Add submission counts in builder list

🧠 _Deliverable:_ Full CRUD + response visibility.

---

### Phase 7 – Auth & User Management (Week 11)

**Goal:** Add authentication and ownership.

- [ ] Integrate NextAuth (Email, Google)
- [ ] Associate forms to user IDs
- [ ] Protected routes (only owner can edit)
- [ ] Dashboard: List user’s forms

🧠 _Deliverable:_ Multi-user accounts with form ownership.

---

### Phase 8 – Premium Features & Polish (Weeks 12–14)

**Goal:** Match Tally’s advanced UX.

- [ ] Conditional logic (show/hide fields)
- [ ] Theming (light/dark, brand colors)
- [ ] Webhooks & Integrations (Zapier, Notion)
- [ ] Analytics (views, submissions)
- [ ] Custom domain & branding

🧠 _Deliverable:_ Tally-level power features unlocked.

---

### Phase 9 – CI/CD, Deployment, Docs (Week 15)

**Goal:** Prepare for production.

- [ ] Vercel deployment + Mongo Atlas
- [ ] GitHub Actions CI/CD pipeline
- [ ] README + API docs
- [ ] Beta testing and feedback loop

🧠 _Deliverable:_ Fully deployed Tally.so clone (v1).

---

## 📂 Folder Structure (Final Form)

```bash
tally-clone/
├── app/
│   ├── builder/              # Form builder
│   ├── f/[id]/               # Public form view
│   ├── dashboard/            # User dashboard
│   ├── api/                  # Backend routes
│   │   ├── forms/
│   │   └── submissions/
├── components/               # Reusable UI
├── hooks/                    # Custom hooks
├── lib/                      # DB, validation, utils
├── prisma/                   # DB schema
├── public/
└── package.json
```
