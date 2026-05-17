

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
  - OIDC browser interaction resume
  - Consent approval/denial
  - Registration
  - Email verification result
  - Resend verification
  - Forgot/reset password
  - Account error handling
- Internal support page:
  - `/support` (eTroy Platform Support)
- User area:
  - Profile page (`/`)
  - Connected Applications backed by consent persistence API
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

Copy `.env.example` to `.env.local` for local development:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_BASE_URL=http://localhost:5173
VITE_OIDC_AUTHORIZE_URL=http://localhost:3000/authorize
```

Variables:

- `VITE_API_BASE_URL`: Backend/API base URL used by the Axios client.
- `VITE_APP_BASE_URL`: Frontend base URL, useful when a flow needs to build internal redirects.
- `VITE_OIDC_AUTHORIZE_URL`: Backend authorize URL for client-initiated OIDC browser flows when needed.

Do not commit `.env` or `.env.local`. No client secret belongs in frontend environment files.

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

Local OIDC integration ports:

- OIDC Backend: `http://localhost:3000`
- OIDC UI: `http://localhost:5173`
- ClientTesting: `http://localhost:5174`
- ClientTesting callback: `http://localhost:5174/callback`

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
- `/oidc/login`
- `/consent`
- `/oidc/consent`
- `/register`
- `/platform-user-agreement`
- `/data-privacy-policy`
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
