"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from "@/lib/auth/schema";
import { forwardSetCookies, clearAuthCookies } from "@/lib/auth/cookie";
import type { AuthActionState, AuthUser } from "@/lib/types/auth.types";

const API_URL = process.env.API_URL!;

/* ─────────────────────────────────────────
   Login
   ───────────────────────────────────────── */
export async function loginAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

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
      return { success: false, message: json.message ?? "Login failed" };
    }

    await forwardSetCookies(res);

    return {
      success: true,
      message: "Login successful",
      user: json.data.user as AuthUser,
    };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}

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
    return { success: false, message: "Network error. Please try again." };
  }
}

/* ─────────────────────────────────────────
   Verify OTP
   ───────────────────────────────────────── */
export async function verifyEmailAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = verifyOtpSchema.safeParse({
    email: formData.get("email"),
    otp: formData.get("otp"),
  });

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
    return { success: false, message: "Network error. Please try again." };
  }
}

/* ─────────────────────────────────────────
   Resend OTP
   ───────────────────────────────────────── */
export async function resendOtpAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resendOtpSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { success: false, message: "Invalid email" };

  try {
    const res = await fetch(`${API_URL}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const json = await res.json();
    return {
      success: json.success,
      message: json.message ?? "OTP resent",
    };
  } catch {
    return { success: false, message: "Network error" };
  }
}

/* ─────────────────────────────────────────
   Logout
   ───────────────────────────────────────── */
export async function logoutAction(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
    });
  } catch {
    // ignore
  }

  await clearAuthCookies(); 
  revalidatePath("/", "layout");
  redirect("/");
}
