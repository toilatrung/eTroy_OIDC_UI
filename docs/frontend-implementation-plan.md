# Frontend Implementation Plan - eTroy OIDC UI

## 1. Overview
This plan outlines the phases for implementing the eTroy OIDC UI, adhering to the "docs-first" governance model.

## 2. Phase 0: Project Bootstrap (In Progress)
- [x] Propose Technology Stack (Vite, React, TS, Vanilla CSS)
- [x] Create UI/UX Requirements
- [x] Create Frontend Architecture
- [x] Create API Dependency Matrix
- [x] Initialize Repository Structure

## 3. Phase 1: Identity & Layout Baseline
- **Goal**: Implement the core identity flows and common layouts.
- **Tasks**:
  - Setup Global Styles and CSS Variables.
  - Implement `shared/components` (Button, Input, Card).
  - Implement Login and Register pages (blocked by backend wiring).
  - Implement Profile and Edit Profile pages.
  - Implement Layout wrappers (AuthLayout, AdminLayout).

## 4. Phase 2: OIDC Protocol UI
- **Goal**: Implement the interaction screens for OIDC flows.
- **Tasks**:
  - Implement `/authorize` landing and validation.
  - Implement Consent screen with scope review.
  - Implement Error screens for OIDC specific failures (Invalid Client, Redirect mismatch).
  - Implement Logout flow and result page.

## 5. Phase 3: Admin Control Plane
- **Goal**: Implement the administrative interface.
- **Tasks**:
  - Implement Admin Dashboard with Health/Metrics widgets.
  - Implement OIDC Client CRUD (List, Create, Detail, Update).
  - Implement Client Secret Rotation with one-time display.
  - Implement User Search and Detail (limited to available backend fields).

## 6. Phase 4: Hardening & Refinement
- **Goal**: Security hardening and UX polish.
- **Tasks**:
  - Implement CSRF protection handling in API client.
  - Add micro-animations and transitions.
  - Performance optimization (Code splitting, Asset optimization).
  - Comprehensive testing of identity flows.

## 7. Validation Plan
- **Linting**: ESLint + Prettier.
- **Typing**: Strict TypeScript checks.
- **Unit Testing**: Vitest for utility logic and API mapping.
- **Manual QA**: Scenario-based testing for all OIDC flows.

## 8. Next Immediate Step
1. [x] **Wire Backend Handlers**: Fix the gap in `eTroy_OIDC/src/app/server.ts` to expose registration, login, verification, and password-reset endpoints.
2. [x] **Initialize Frontend**: Run `npm init vite@latest` in `eTroy_OIDC_UI`.
