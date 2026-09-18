import type { UserRole } from "@/lib/types/common.types";

export type { UserRole };

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// Server Action state (useActionState)
export interface AuthActionState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  user?: AuthUser;
}