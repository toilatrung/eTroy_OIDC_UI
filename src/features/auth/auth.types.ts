export interface UserProfile {
  sub: string;
  email: string;
  name?: string;
  avatar_url?: string;
  email_verified: boolean;
  status: 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  data: {
    user: UserProfile;
  };
}

export interface VerificationRequestResult {
  message: string;
}

export interface PasswordResetSuccessResponse {
  message: string;
}
