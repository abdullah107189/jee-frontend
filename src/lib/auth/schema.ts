import * as z from "zod";

/* ─────────── Register ─────────── */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    phone: z
      .string()
      .trim()
      .regex(/^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/, "Invalid BD phone number"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),

    confirmPassword: z.string().min(1, "Please confirm password"),

    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

/* ─────────── Login ─────────── */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/* ─────────── Verify OTP ─────────── */
export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

/* ─────────── Resend OTP ─────────── */
export const resendOtpSchema = z.object({
  email: z.string().email(),
});

/* ─────────── Forgot Password ─────────── */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

/* ─────────── Reset Password ─────────── */
export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().length(6, "OTP must be 6 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });