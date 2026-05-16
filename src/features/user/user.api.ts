import apiClient from '../../shared/api/apiClient';
import { ADMIN_CONFIG } from '../../config/admin';
import type { 
  UserProfile, 
  UpdateProfilePayload, 
  ChangePasswordPayload,
  ApiResponse 
} from './user.types';

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

  getConnectedApplications: () =>
    // Handled as empty state since backend lacks aggregation service
    Promise.resolve({ data: { data: [] } })
};
