# Frontend Architecture - eTroy OIDC UI

## 1. Technology Stack
- **Framework**: React 18+ (Vite)
- **Language**: TypeScript (Strict mode)
- **Styling**: Vanilla CSS with CSS Variables for Design Tokens
- **Routing**: React Router 6+
- **State Management**: React Context (Auth, Session, UI state)
- **API Client**: Axios with interceptors for error handling

## 2. Directory Structure
```text
src/
├─ app/                 # Router and Main Entry
├─ pages/               # Route-level screens
│  ├─ auth/             # Login, Register, Password Reset
│  ├─ account/          # Profile, Settings
│  ├─ oidc/             # Authorize, Consent
│  └─ admin/            # Dashboard, Clients, Users
├─ features/            # Business logic by domain
│  ├─ auth/
│  ├─ identity/
│  ├─ oidc-interaction/
│  └─ admin-controls/
├─ shared/              # Reusable assets
│  ├─ components/       # UI Library (Button, Input, Card, Modal)
│  ├─ api/              # API Client and Base Services
│  ├─ types/            # DTOs and Shared Types
│  ├─ utils/            # Formatters, Validators
│  └─ hooks/            # Shared React Hooks
├─ assets/              # Static assets (images, fonts)
└─ styles/              # Global styles and tokens
```

## 3. API Client Strategy
- Centralized `apiClient` using Axios.
- Request/Response models derived from `eTroy_OIDC` contracts.
- Global error handler interceptor to map backend `BaseError` to UI alerts.
- No raw token exposure in client-side state beyond what is required for session maintenance.

## 4. Authentication & Session
- Rely on HttpOnly cookies from backend where possible (OIDC session).
- Maintain minimal local state for "Authenticated User" profile.
- Handle 401/403 globally to trigger logout or re-auth flows.

## 5. Component Guidelines
- **Stateless Components**: Prefer functional components.
- **Vanilla CSS**: Use modular CSS or standard global sheets with BEM-like naming.
- **Accessibility**: Ensure ARIA labels and keyboard navigation for identity flows.
