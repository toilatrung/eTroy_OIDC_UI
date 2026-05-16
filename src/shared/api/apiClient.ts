import axios from 'axios';
import { ENV } from '../../config/env';

const apiClient = axios.create({
  baseURL: ENV.apiBaseUrl || undefined,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for OIDC session cookies
});

// Request interceptor for logging (SAFE ONLY)
apiClient.interceptors.request.use((config) => {
  // Never log passwords or secrets
  const sanitizedBody = { ...config.data };
  if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
  if (sanitizedBody.newPassword) sanitizedBody.newPassword = '[REDACTED]';
  if (sanitizedBody.client_secret) sanitizedBody.client_secret = '[REDACTED]';
  
  // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, sanitizedBody);
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status);
    return Promise.reject(error);
  }
);

export default apiClient;
