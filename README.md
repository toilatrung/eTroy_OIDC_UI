<img width="1121" height="713" alt="Screenshot 2026-05-17 011429" src="https://github.com/user-attachments/assets/5f5367cd-56f6-4431-a66c-3da4490c8198" />

# eTroy OIDC UI

Frontend application for the **eTroy OpenID Connect (OIDC)** platform.

This project provides the user-facing and admin-facing interfaces for authentication and identity-related workflows in the eTroy ecosystem, including login, registration, email verification, password reset, account profile, and admin operations.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **React Router**
- **Axios**
- **ESLint**

## Key Features

- Authentication flows:
  - Login
  - Registration
  - Email verification result
  - Resend verification
  - Forgot/reset password
  - Account error handling
- Internal support page:
  - `/support` (eTroy Platform Support)
- User area:
  - Profile page (`/`)
- Admin area (guarded routes):
  - Overview
  - Users
  - Clients
  - Sessions
  - Audit
  - Observability
  - Keys

## Project Structure

```text
src/
  app/                 # App shell and router
  config/              # App configuration (e.g., admin access config)
  features/            # Domain modules (auth, admin, user)
  pages/               # Route-level pages (auth, user, admin)
  shared/              # Reusable APIs, components, and layouts
  styles/              # Global styles and design tokens
public/                # Static assets
```

## Requirements

- **Node.js 18+** (recommended: latest LTS)
- **npm 9+**

## Environment Variables

Create a `.env` file in the project root (optional if using defaults):

```env
VITE_API_BASE_URL=http://localhost:3000
```

If not provided, the app defaults to `http://localhost:3000`.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Default Vite dev server:
- `http://localhost:5173`

## Build and Preview

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

## Routing Overview

Main routes configured in `src/app/router.tsx`:

- `/login`
- `/register`
- `/register/success`
- `/resend-verification`
- `/verify-email/result`
- `/forgot-password`
- `/reset-password`
- `/account/error`
- `/support`
- `/` (profile)
- `/admin/*` (admin module, guarded)

## API Integration

HTTP client is configured in `src/shared/api/apiClient.ts` with:

- `withCredentials: true` for OIDC session cookies
- `Content-Type: application/json`
- Request/response interceptors with sensitive field redaction for safe logging

## Notes

- This repository is focused on the UI layer for eTroy OIDC.
- Admin access behavior is currently controlled by `src/config/admin.ts` and should be replaced by proper role claims/scopes in production.

