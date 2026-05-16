# API Dependency Matrix - eTroy OIDC UI

## 1. Overview
This matrix maps frontend screens to backend endpoints in `eTroy_OIDC`.

## 2. Dependency Matrix

| Screen | Endpoint | Method | Status | Notes |
|--------|----------|--------|--------|-------|
| Login | `/login` | POST | ✅ READY / RUNTIME VALIDATED | |
| Register | `/register` | POST | ✅ READY / RUNTIME VALIDATED | |
| Profile | `/admin/users/:sub` | GET | ⚠️ BLOCKED | No self-service endpoint exists |
| Update Profile | `/admin/users/:sub/profile` | PATCH | ⚠️ BLOCKED | No self-service endpoint exists |
| Verify Email Request | `/verification/request` | POST | ✅ READY / RUNTIME VALIDATED | |
| Verify Email Confirm | `/verification/confirm` | POST | ✅ READY / RUNTIME VALIDATED | |
| Password Reset Request | `/password-reset/request` | POST | ✅ READY / RUNTIME VALIDATED | |
| Password Reset Confirm | `/password-reset/confirm` | POST | ✅ READY / RUNTIME VALIDATED | |
| Authorize | `/authorize` | GET | ✅ READY | |
| Consent/Continue | `/authorize/continue` | POST | ✅ READY | |
| Token Exchange | `/token` | POST | ✅ READY | Usually called by OIDC Clients, not UI |
| Revoke | `/revoke` | POST | ✅ READY | |
| Introspect | `/introspect` | POST | ✅ READY | |
| UserInfo | `/userinfo` | GET | ✅ READY | |
| Logout | `/logout` | POST | ✅ READY | |
| Admin User List | `/admin/users` | GET | ⚠️ FUTURE | Logic needed in `user.service` to list |
| Admin User Detail | `/admin/users/:sub` | GET | ✅ READY | |
| Admin Create User | `/admin/users` | POST | ✅ READY | |
| Admin Disable User | `/admin/users/:sub/disable` | POST | ✅ READY | |
| Admin Client List | `/admin/clients` | GET | ✅ READY | |
| Admin Create Client | `/admin/clients` | POST | ✅ READY | |
| Admin Rotate Secret | `/admin/clients/:id/rotate-secret` | POST | ✅ READY | |
| Health | `/health` | GET | ✅ READY | |
| Readiness | `/ready` | GET | ✅ READY | |
| Metrics | `/metrics` | GET | ✅ READY | |
| JWKS | `/jwks` | GET | ✅ READY | |

## 3. Backend Gaps (Blockers)
1. **Self-Service Endpoints**: `/me` or `/profile` endpoints for normal users to view/edit their own profile are missing.
2. **Change Password**: No self-service change-password endpoint exists for authenticated users.
3. **User Listing**: `GET /admin/users` is not implemented in `server.ts` or `user.controller.ts`.
4. **Audit Listing**: No endpoint to retrieve audit logs for the Audit Event Viewer.
