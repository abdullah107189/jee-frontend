"use server";

import { redirect } from "next/navigation";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/auth/schema";
import { forwardSetCookies, clearAuthCookies } from "@/lib/auth/cookie";
import type { AuthActionState, AuthUser } from "@/lib/types/auth.types";
import { auth } from "@/lib/auth/session";

const API_URL = process.env.API_URL!;
/* ─────────────────────────────────────────
   Register
   ───────────────────────────────────────── */
export async function registerAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms") === "on",
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const { name, email, phone, password } = parsed.data;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return {
        success: false,
        message: json.message ?? "Registration failed",
      };
    }

    return {
      success: true,
      message: json.message ?? "OTP sent to your email",
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

/* ─────────────────────────────────────────
   Login
   ───────────────────────────────────────── */
export async function loginAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return {
        success: false,
        message: json.message ?? "Login failed",
      };
    }
    await forwardSetCookies(res);

    return {
      success: true,
      message: "Login successful",
      user: json.data.user as AuthUser,
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

/* ─────────────────────────────────────────
   Verify Email OTP
   ───────────────────────────────────────── */
export async function verifyEmailAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    email: formData.get("email"),
    otp: formData.get("otp"),
  };

  const parsed = verifyOtpSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid OTP",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  try {
    const res = await fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return {
        success: false,
        message: json.message ?? "Verification failed",
      };
    }

    return {
      success: true,
      message: json.message ?? "Email verified successfully!",
      user: json.data?.user as AuthUser,
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

/* ─────────────────────────────────────────
   Resend OTP
   ───────────────────────────────────────── */
export async function resendOtpAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = { email: formData.get("email") };
  const parsed = resendOtpSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, message: "Invalid email" };
  }

  try {
    const res = await fetch(`${API_URL}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return { success: false, message: json.message ?? "Resend failed" };
    }

    return { success: true, message: json.message ?? "OTP resent" };
  } catch {
    return { success: false, message: "Network error" };
  }
}

/* ─────────────────────────────────────────
   Logout
   ───────────────────────────────────────── */
export async function logoutAction(): Promise<void> {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    const cookieHeader = store.toString();

    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
    });
  } catch {
    // ignore — cookie clear anyway
  }

  await clearAuthCookies();
  redirect("/");
}

/* ─────────────────────────────────────────
   Forgot Password
   ───────────────────────────────────────── */
export async function forgotPasswordAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = { email: formData.get("email") };
  const parsed = forgotPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, message: "Invalid email" };
  }

  try {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const json = await res.json();

    return {
      success: json.success,
      message: json.message ?? "Request submitted",
    };
  } catch {
    return { success: false, message: "Network error" };
  }
}

/* ─────────────────────────────────────────
   Reset Password
   ───────────────────────────────────────── */
export async function resetPasswordAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    email: formData.get("email"),
    otp: formData.get("otp"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const { email, otp, password } = parsed.data;

  try {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    });
    const json = await res.json();

    return {
      success: json.success,
      message: json.message ?? "Password reset",
    };
  } catch {
    return { success: false, message: "Network error" };
  }
}

/* ─────────────────────────────────────────
   Helper — Already logged in check
   ───────────────────────────────────────── */
export async function getLoggedInUserAction(): Promise<AuthUser | null> {
  return auth();
}
