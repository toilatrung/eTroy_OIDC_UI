export type UserStatus = 'active' | 'suspended' | 'pending';

export interface UserProfile {
  sub: string;
  email: string;
  email_verified: boolean;
  status: UserStatus;
  name?: string;
  avatar_url?: string;
  isAdmin: boolean;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar_url?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  data: T;
}
