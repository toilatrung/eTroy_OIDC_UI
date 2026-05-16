import apiClient from '../../shared/api/apiClient';
import type { 
  AuthResponse, 
  VerificationRequestResult, 
  PasswordResetSuccessResponse 
} from './auth.types';

export const authApi = {
  login: (data: Record<string, unknown>) => 
    apiClient.post<AuthResponse>('/login', data),

  register: (data: Record<string, unknown>) => 
    apiClient.post<AuthResponse>('/register', data),

  requestVerification: (userId: string) => 
    apiClient.post<VerificationRequestResult>('/verification/request', { userId }),

  confirmVerification: (token: string) => 
    apiClient.post<AuthResponse>('/verification/confirm', { token }),

  requestPasswordReset: (email: string) => 
    apiClient.post<PasswordResetSuccessResponse>('/password-reset/request', { email }),

  confirmPasswordReset: (data: Record<string, unknown>) => 
    apiClient.post<PasswordResetSuccessResponse>('/password-reset/confirm', data),
    
  logout: () =>
    apiClient.post('/logout')
};
