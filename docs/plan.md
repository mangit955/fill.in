# Fill.in Production Plan

This plan reflects the current implementation and defines the path to production readiness.

## 1. Product Scope

### Core capabilities already implemented

- Authenticated dashboard for form ownership
- Form creation and editing
- Public published runtime
- Submission capture
- Collaboration (owner/editor)
- Response table and basic analytics

### Core capabilities to harden for production

- Security and authorization consistency across all sensitive routes
- Reliable analytics instrumentation and validation
- Test coverage for critical flows
- Operational readiness (CI, monitoring, deployment docs)

## 2. Architecture Goals

### Current direction

- Next.js App Router for server/client separation
- Supabase for auth, data, and storage
- JSON schema driven form definition

### Production target

- Clear trust boundaries between client and server actions
- Strong row-level security policies with least privilege
- Deterministic form schema versioning and migration strategy

## 3. Engineering Workstreams

## Workstream A: Security and Authz

- Add explicit authorization checks to all responses and admin-style views
- Enforce ownership checks in server actions (delete, update, invite)
- Review service-role usage and reduce broad admin list operations
- Finalize and test RLS policies for:
  - forms
  - form_members
  - responses
  - form_events
  - uploads bucket objects

## Workstream B: Reliability and Data Integrity

- Ensure runtime submit flow only shows success on confirmed write
- Add idempotency strategy for form event tracking if needed
- Validate analytics math with branching/visibility scenarios
- Add guardrails for legacy data backfill behavior

## Workstream C: Quality Gates

- Resolve lint/type errors and enforce clean `npm run lint`
- Add `npm run typecheck` script and enforce in CI
- Add test layers:
  - unit tests for form logic helpers
  - integration tests for route-level permissions
  - e2e smoke tests for create/publish/submit/respond

## Workstream D: Developer Experience

- Keep docs aligned to implementation and release process
- Add database migration and seed workflow docs
- Add contribution standards (branching, PR checks, review checklist)

## 4. Milestones

## Milestone 1: Security Baseline (Week 1)

- Authz checks in all sensitive server paths
- Ownership validation in destructive actions
- RLS review complete with test cases

Exit criteria:
- Unauthorized users cannot read responses or mutate unrelated forms

## Milestone 2: Quality Baseline (Week 2)

- Lint clean
- Typecheck script clean
- Core helper unit tests added

Exit criteria:
- CI blocks merge on lint/type/test failures

## Milestone 3: Product Confidence (Week 3)

- End-to-end flow tests in staging
- Analytics validation against fixture data
- Deployment and rollback runbook complete

Exit criteria:
- Team can deploy safely and verify core journeys quickly

## 5. Non-Functional Requirements

- Performance: public runtime first interaction under 2s on broadband
- Availability: graceful failure handling for Supabase write errors
- Observability: error logging for API, publish, submit, and invite flows
- Privacy: least-privilege access and controlled exposure of user details

## 6. Interview Readiness Checklist

Use this checklist before sharing the project as a portfolio flagship:

- README and architecture docs are accurate
- Security model is explained and demonstrable
- Lint/type/test gates pass in CI
- One-click demo script exists for evaluator walkthrough
- Known tradeoffs are documented with next steps
