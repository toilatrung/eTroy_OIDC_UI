import apiClient from '../../shared/api/apiClient';
import type { 
  AdminUserView, 
  AdminCreateUserInput, 
  AdminUpdateProfileInput, 
  AdminClientView, 
  AdminClientWithSecret, 
  AdminCreateClientInput, 
  AdminUpdateClientInput
} from './admin.types';

/**
 * Admin API Adapter
 * 
 * Centralizes all administrative control endpoints.
 * Note: These endpoints require administrative authorization.
 * Current implementation uses 'x-admin-sub' header for context.
 */

const getAdminHeaders = (adminSub?: string) => ({
  'x-admin-sub': adminSub || 'system-admin', // Default placeholder for dev/foundation
});

export const adminApi = {
  // --- Platform / Observability ---
  getHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
  
  getReadiness: async () => {
    const response = await apiClient.get('/ready');
    return response.data;
  },

  getMetrics: async () => {
    // Returns Prometheus text format
    const response = await apiClient.get('/metrics');
    return response.data;
  },

  // --- User Management ---
  listUsers: async (adminSub?: string) => {
    const response = await apiClient.get<{ data: AdminUserView[] }>('/admin/users', {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  getUser: async (sub: string, adminSub?: string) => {
    const response = await apiClient.get<{ data: AdminUserView }>(`/admin/users/${sub}`, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  createUser: async (input: AdminCreateUserInput, adminSub?: string) => {
    const response = await apiClient.post<{ data: AdminUserView }>('/admin/users', input, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  updateUserProfile: async (sub: string, input: AdminUpdateProfileInput, adminSub?: string) => {
    const response = await apiClient.patch<{ data: AdminUserView }>(`/admin/users/${sub}/profile`, input, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  disableUser: async (sub: string, adminSub?: string) => {
    const response = await apiClient.post<{ data: AdminUserView }>(`/admin/users/${sub}/disable`, {}, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  enableUser: async (sub: string, adminSub?: string) => {
    const response = await apiClient.post<{ data: AdminUserView }>(`/admin/users/${sub}/enable`, {}, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  markEmailVerified: async (sub: string, adminSub?: string) => {
    const response = await apiClient.post<{ data: AdminUserView }>(`/admin/users/${sub}/email-verification/mark-verified`, {}, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  // --- Client Management ---
  listClients: async (adminSub?: string) => {
    const response = await apiClient.get<{ data: AdminClientView[] }>('/admin/clients', {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  getClient: async (clientId: string, adminSub?: string) => {
    const response = await apiClient.get<{ data: AdminClientView }>(`/admin/clients/${clientId}`, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  createClient: async (input: AdminCreateClientInput, adminSub?: string) => {
    const payload = {
      ...input,
      allowedScopes: input.allowedScopes || ['openid', 'profile', 'email'],
      grantTypes: input.grantTypes || ['authorization_code', 'refresh_token'],
      responseTypes: input.responseTypes || ['code'],
    };
    const response = await apiClient.post<{ data: AdminClientWithSecret }>('/admin/clients', payload, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  updateClient: async (clientId: string, input: AdminUpdateClientInput, adminSub?: string) => {
    const response = await apiClient.patch<{ data: AdminClientView }>(`/admin/clients/${clientId}`, input, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  disableClient: async (clientId: string, adminSub?: string) => {
    const response = await apiClient.post<{ data: AdminClientView }>(`/admin/clients/${clientId}/disable`, {}, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  enableClient: async (clientId: string, adminSub?: string) => {
    const response = await apiClient.post<{ data: AdminClientView }>(`/admin/clients/${clientId}/enable`, {}, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  rotateClientSecret: async (clientId: string, adminSub?: string) => {
    const response = await apiClient.post<{ data: AdminClientWithSecret }>(`/admin/clients/${clientId}/rotate-secret`, {}, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  // --- JWKS / Key Rotation ---
  getJwks: async () => {
    const response = await apiClient.get('/jwks');
    return response.data;
  },

  // --- Audit Logs ---
  listAuditLogs: async (adminSub?: string) => {
    const response = await apiClient.get<{ data: any[] }>('/admin/audit-logs', {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  // --- Sessions / Token Controls ---
  listSessions: async (adminSub?: string) => {
    const response = await apiClient.get<{ data: any[] }>('/admin/sessions', {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  },

  // --- Maintenance ---
  purgeUnverifiedUsers: async (adminSub?: string) => {
    const response = await apiClient.post<{ data: { deletedCount: number } }>('/admin/maintenance/purge-unverified-users', {}, {
      headers: getAdminHeaders(adminSub),
    });
    return response.data.data;
  }
};
