export type UserRole = 'user' | 'seller' | 'admin';
export type Role = UserRole;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface UserSession {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: Role;
  phone?: string | null;
  emailVerified?: Date | null;
}

export interface PasswordStrengthResult {
  score: number;
  label: string;
  color: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}
