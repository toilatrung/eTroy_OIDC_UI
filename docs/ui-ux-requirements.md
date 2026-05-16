# UI/UX Requirements - eTroy OIDC UI

## 1. Overview
This document defines the UI/UX requirements for the eTroy OIDC frontend, based on the backend architecture and contracts of `eTroy_OIDC`.

## 2. Design Principles
- **Premium Aesthetics**: High-quality, modern design with smooth transitions and professional typography.
- **Security-First**: No sensitive data (hashes, raw tokens) displayed except one-time client secrets.
- **Clear Feedback**: Informative error messages without exposing backend internals.
- **Responsive**: Mobile-first design for identity flows.

## 3. Screen-by-Screen Requirements

### A. End User Identity UI
| Screen | Purpose | Backend Dependency |
|--------|---------|-------------------|
| Login | Credential input for local auth | `POST /login` (READY) |
| Register | New user account creation | `POST /register` (READY) |
| Email Verification Pending | Instruction to check email | `POST /verification/request` (READY) |
| Email Verification Result | Success/Failure of verification | `POST /verification/confirm` (READY) |
| Forgot Password | Trigger reset email | `POST /password-reset/request` (READY) |
| Reset Password | New password input with token | `POST /password-reset/confirm` (READY) |
| User Profile | View current identity data | ⚠️ BLOCKED (No self-service endpoint) |
| Edit Display Name | Update profile name | ⚠️ BLOCKED (No self-service endpoint) |
| Change Password | Update current password | ⚠️ BLOCKED (No self-service endpoint) |
| Logout Confirmation | End session | `POST /logout` |
| Generic Account Error | Account-level error feedback | N/A |

### B. OIDC Interaction UI
| Screen | Purpose | Backend Dependency |
|--------|---------|-------------------|
| Authorization Request | Landing for `/authorize` | `GET /authorize` |
| Login Required | Login prompt during OIDC flow | `POST /login` |
| Consent Screen | User approval for scopes | `POST /authorize/continue` |
| Invalid Auth Request | Error for bad client/params | N/A |
| Invalid Client | Error for bad `client_id` | N/A |
| Invalid Redirect URI | Error for URI mismatch | N/A |
| Session Expired | Re-auth prompt during flow | N/A |
| Post-Logout Result | Confirmation of logout | `POST /logout` redirect |

### C. Admin / Operator UI
| Screen | Purpose | Backend Dependency |
|--------|---------|-------------------|
| Admin Boundary | Access gate for admin area | N/A (Session based) |
| Admin Dashboard | System overview metrics | `/health`, `/metrics` |
| User Search/Detail | Management of users | `GET /admin/users`, `GET /admin/users/:sub` |
| Client Management | CRUD for OIDC clients | `/admin/clients` |
| Create OIDC Client | Form for new client | `POST /admin/clients` |
| Rotate Client Secret | One-time display of new secret | `POST /admin/clients/:id/rotate-secret` |
| Audit Event Viewer | Security log review | `GET /admin/audit` (Future Scope) |
| Health/Readiness | Status of dependencies | `/health`, `/ready` |
| JWKS Status | Signing key metadata | `GET /jwks` |

## 4. Security Display Rules
- **Passwords**: Never display raw or hashed.
- **Tokens**: Never display Access/ID/Refresh tokens in UI.
- **Client Secrets**: Display **ONLY ONCE** after creation or rotation with clear warning.
- **Error Messages**: No stack traces or DB internals.

## 5. Implementation Phases
- **Phase 1**: Identity Foundation (Login, Register, Profile).
- **Phase 2**: OIDC Protocol UI (Authorize, Consent).
- **Phase 3**: Admin Control Plane (User/Client Management).
- **Phase 4**: Observability & Hardening (Health, Metrics, Audit).
