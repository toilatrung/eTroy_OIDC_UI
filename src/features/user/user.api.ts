import apiClient from '../../shared/api/apiClient';
import { ADMIN_CONFIG } from '../../config/admin';
import type { 
  UserProfile, 
  UpdateProfilePayload, 
  ChangePasswordPayload,
  ConnectedApplication,
  ApiResponse 
} from './user.types';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const unwrapData = (value: unknown): unknown => {
  let current = value;
  let depth = 0;

  while (isRecord(current) && 'data' in current && depth < 2) {
    current = current.data;
    depth += 1;
  }

  return current;
};

const normalizeScopes = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((scope): scope is string => typeof scope === 'string')
      .map((scope) => scope.trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(/\s+/).map((scope) => scope.trim()).filter(Boolean);
  }

  return [];
};

const firstString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
};

const normalizeConnectedApplication = (value: unknown): ConnectedApplication | null => {
  if (!isRecord(value)) return null;

  const client = isRecord(value.client) ? value.client : undefined;
  const clientId = firstString(value.clientId, value.client_id, client?.clientId, client?.client_id, client?.id);

  if (!clientId) return null;

  return {
    clientId,
    clientName: firstString(value.clientName, value.client_name, value.name, client?.clientName, client?.client_name, client?.name),
    scopes: normalizeScopes(value.scopes ?? value.scope ?? value.grantedScopes ?? value.granted_scopes),
    grantedAt: firstString(value.grantedAt, value.granted_at, value.createdAt, value.created_at),
    updatedAt: firstString(value.updatedAt, value.updated_at),
    lastUsedAt: firstString(value.lastUsedAt, value.last_used_at),
  };
};

const normalizeConnectedApplications = (value: unknown): ConnectedApplication[] => {
  const payload = unwrapData(value);
  const applications = isRecord(payload) ? payload.applications : payload;

  if (!Array.isArray(applications)) {
    return [];
  }

  return applications
    .map(normalizeConnectedApplication)
    .filter((app): app is ConnectedApplication => app !== null);
};

export const userApi = {
  getMe: async () => {
    const response = await apiClient.get<{ data: UserProfile }>('/api/v1/users/me');
    const user = response.data.data;
    
    // Foundation-only Admin Detection:
    // Uses centralized configuration to determine administrative privileges.
    user.isAdmin = ADMIN_CONFIG.checkAdminAccess(user.email);
    
    return user;
  },

  updateProfile: (data: UpdateProfilePayload) => 
    apiClient.patch<ApiResponse<UserProfile>>('/api/v1/users/me/profile', data),

  changePassword: (data: ChangePasswordPayload) => 
    apiClient.post<ApiResponse<UserProfile>>('/api/v1/users/me/password', data),

  signOutFromAllSessions: () => 
    apiClient.delete('/api/v1/users/me/sessions'),

  getConnectedApplications: async () => {
    const response = await apiClient.get('/api/v1/users/me/connected-applications');
    return normalizeConnectedApplications(response.data);
  },

  revokeConnectedApplication: (clientId: string) =>
    apiClient.post(`/api/v1/users/me/connected-applications/${encodeURIComponent(clientId)}/revoke`)
};
