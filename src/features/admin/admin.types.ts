import type { UserStatus } from '../user/user.types';

export interface AdminUserView {
  id: string;
  sub: string;
  email: string;
  email_verified: boolean;
  status: UserStatus;
  name?: string;
  avatar_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCreateUserInput {
  email: string;
  password?: string;
  name?: string;
  avatar_url?: string;
  email_verified?: boolean;
}

export interface AdminUpdateProfileInput {
  name?: string;
  avatar_url?: string;
}

export interface AdminClientView {
  clientId: string;
  name?: string;
  redirectUris: string[];
  status: 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
}

export interface AdminClientWithSecret extends AdminClientView {
  clientSecret: string;
}

export interface AdminCreateClientInput {
  name: string;
  redirectUris: string[];
  allowedScopes?: string[];
  grantTypes?: string[];
  responseTypes?: string[];
}

export interface AdminUpdateClientInput {
  name?: string;
  redirectUris?: string[];
}

export interface AdminPlatformStats {
  health: 'UP' | 'DOWN' | 'DEGRADED';
  readiness: 'READY' | 'NOT_READY';
  // Aggregate counts are currently MISSING_BACKEND
  userCount?: number;
  clientCount?: number;
  activeSessionCount?: number;
}

export interface AdminAuditLog {
  id: string;
  eventType: string;
  occurredAt: string;
  severity: 'critical' | 'warning' | 'info' | string;
  outcome: 'success' | 'failure' | string;
  actor?: {
    adminSub?: string;
    sub?: string;
    type?: string;
  };
  subject?: {
    type?: string;
    sub?: string;
    clientId?: string;
  };
}

export interface AdminSessionView {
  sessionId: string;
  subject: string;
  clientIds: string[];
  status: 'active' | 'disabled' | 'expired' | string;
  lastSeenAt: string;
}

export interface JwksResponse {
  keys?: unknown[];
  [key: string]: unknown;
}

export interface HealthResponse {
  status?: string;
  [key: string]: unknown;
}
