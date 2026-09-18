import "server-only";
import { cookies } from "next/headers";
import type { AuthUser, UserRole } from "@/lib/types/auth.types";

const API_URL = process.env.API_URL!;

/**
 * Server-only — Express /auth/me hit kore, cookie forward kore.
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) return null;

    const res = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return (json?.data as AuthUser) ?? null;
  } catch {
    return null;
  }
};

export const requireAuth = async (): Promise<AuthUser> => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required");
  return user;
};

export const requireRole = async (role: UserRole): Promise<AuthUser> => {
  const user = await requireAuth();
  if (user.role !== role) throw new Error(`${role} access required`);
  return user;
};